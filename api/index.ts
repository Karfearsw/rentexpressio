import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { Pool } from "pg";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { Resend } from "resend";

const scryptAsync = promisify(scrypt);

async function sendChargeEmail(
  type: "invoice" | "reminder" | "receipt",
  toEmail: string,
  tenantName: string,
  amount: string,
  dueDate: string,
  description: string
): Promise<{ success: boolean; error?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@rentexpress.io";
  
  if (!resendApiKey) {
    console.log(`[Email] Skipping ${type} email - RESEND_API_KEY not configured`);
    return { success: true };
  }

  const resend = new Resend(resendApiKey);
  
  const templates: Record<string, { subject: string; html: string }> = {
    invoice: {
      subject: `Invoice: ${description}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a;">Invoice from RentExpress</h1>
          <p>Hello ${tenantName},</p>
          <p>You have a new charge on your account:</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Description:</strong> ${description}</p>
            <p style="margin: 10px 0 0;"><strong>Amount:</strong> $${amount}</p>
            <p style="margin: 10px 0 0;"><strong>Due Date:</strong> ${dueDate}</p>
          </div>
          <p>Please log in to your tenant portal to make a payment.</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">This is an automated email from RentExpress.</p>
        </div>
      `
    },
    reminder: {
      subject: `Payment Reminder: ${description}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #e65100;">Payment Reminder</h1>
          <p>Hello ${tenantName},</p>
          <p>This is a friendly reminder that the following charge is due soon:</p>
          <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e65100;">
            <p style="margin: 0;"><strong>Description:</strong> ${description}</p>
            <p style="margin: 10px 0 0;"><strong>Amount:</strong> $${amount}</p>
            <p style="margin: 10px 0 0;"><strong>Due Date:</strong> ${dueDate}</p>
          </div>
          <p>Please log in to your tenant portal to make a payment before the due date.</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">This is an automated email from RentExpress.</p>
        </div>
      `
    },
    receipt: {
      subject: `Payment Receipt: ${description}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2e7d32;">Payment Received</h1>
          <p>Hello ${tenantName},</p>
          <p>Thank you for your payment! Here is your receipt:</p>
          <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2e7d32;">
            <p style="margin: 0;"><strong>Description:</strong> ${description}</p>
            <p style="margin: 10px 0 0;"><strong>Amount Paid:</strong> $${amount}</p>
            <p style="margin: 10px 0 0;"><strong>Date:</strong> ${dueDate}</p>
          </div>
          <p>This payment has been applied to your account.</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">This is an automated email from RentExpress.</p>
        </div>
      `
    }
  };

  try {
    const template = templates[type];
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: template.subject,
      html: template.html
    });
    console.log(`[Email] Successfully sent ${type} to ${toEmail}`);
    return { success: true };
  } catch (error: any) {
    console.error(`[Email] Failed to send ${type}:`, error);
    return { success: false, error: error.message };
  }
}

const app = express();

app.use(express.json());
app.use(cookieParser());

const jwtSecretEnv = process.env.SESSION_SECRET || process.env.JWT_SECRET;
if (!jwtSecretEnv) {
  throw new Error("SESSION_SECRET or JWT_SECRET environment variable is required");
}
const JWT_SECRET: string = jwtSecretEnv;
const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

interface APIUser {
  id: string;
  username: string;
  userType: string;
  password?: string;
  profileData?: unknown;
}

declare global {
  namespace Express {
    interface Request {
      apiUser?: APIUser;
    }
  }
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

function generateToken(user: { id: string; username: string; userType: string }): string {
  return jwt.sign(
    { id: user.id, username: user.username, userType: user.userType },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as APIUser;
    req.apiUser = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as APIUser;
      req.apiUser = decoded;
    } catch (err) {
    }
  }
  next();
}

app.post("/api/auth/register", async (req: Request, res: Response) => {
  try {
    const { username, password, userType, profileData } = req.body;
    
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await hashPassword(password);
    
    const result = await pool.query(
      `INSERT INTO users (id, username, password, user_type, profile_data) 
       VALUES (gen_random_uuid(), $1, $2, $3, $4) 
       RETURNING id, username, user_type as "userType", profile_data as "profileData"`,
      [username, hashedPassword, userType || "tenant", JSON.stringify(profileData || {})]
    );
    
    const user = result.rows[0];
    const token = generateToken({ id: user.id, username: user.username, userType: user.userType });
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    res.status(201).json(user);
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    const result = await pool.query(
      `SELECT id, username, password, user_type as "userType", profile_data as "profileData" 
       FROM users WHERE username = $1`,
      [username]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const user = result.rows[0];
    const isValid = await comparePasswords(password, user.password);
    
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const token = generateToken({ id: user.id, username: user.username, userType: user.userType });
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

app.post("/api/auth/logout", (_req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

app.get("/api/user", optionalAuth, async (req: Request, res: Response) => {
  if (!req.apiUser) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  try {
    const result = await pool.query(
      `SELECT id, username, user_type as "userType", profile_data as "profileData" 
       FROM users WHERE id = $1`,
      [req.apiUser?.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Failed to get user" });
  }
});

app.get("/api/auth/check-username", async (req: Request, res: Response) => {
  const username = (req.query.username as string) || "";
  
  if (!username) {
    return res.status(400).json({ message: "username is required" });
  }
  
  const result = await pool.query(
    "SELECT id FROM users WHERE username = $1",
    [username]
  );
  
  res.json({ available: result.rows.length === 0 });
});

app.get("/api/properties", authenticateToken, async (req: Request, res: Response) => {
  if (req.apiUser?.userType !== "landlord") {
    return res.status(403).json({ message: "Landlord access only" });
  }
  
  try {
    const result = await pool.query(
      `SELECT id, landlord_id as "landlordId", name, address, city, state, zip, type,
              bedrooms, bathrooms, square_feet as "squareFeet", rent, status
       FROM properties WHERE landlord_id = $1`,
      [req.apiUser?.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get properties error:", error);
    res.status(500).json({ message: "Failed to get properties" });
  }
});

app.post("/api/properties", authenticateToken, async (req: Request, res: Response) => {
  if (req.apiUser?.userType !== "landlord") {
    return res.status(403).json({ message: "Landlord access only" });
  }
  
  try {
    const { name, address, city, state, zip, type, bedrooms, bathrooms, squareFeet, rent, status } = req.body;
    const result = await pool.query(
      `INSERT INTO properties (id, landlord_id, name, address, city, state, zip, type, bedrooms, bathrooms, square_feet, rent, status)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id, landlord_id as "landlordId", name, address, city, state, zip, type,
                 bedrooms, bathrooms, square_feet as "squareFeet", rent, status`,
      [req.apiUser?.id, name, address, city, state, zip, type, bedrooms, bathrooms, squareFeet, rent, status || "Vacant"]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create property error:", error);
    res.status(500).json({ message: "Failed to create property" });
  }
});

app.get("/api/leases", authenticateToken, async (req: Request, res: Response) => {
  try {
    if (req.apiUser?.userType === "landlord") {
      const properties = await pool.query(
        "SELECT id FROM properties WHERE landlord_id = $1",
        [req.apiUser?.id]
      );
      const propertyIds = properties.rows.map(p => p.id);
      
      if (propertyIds.length === 0) {
        return res.json([]);
      }
      
      const result = await pool.query(
        `SELECT id, property_id as "propertyId", tenant_id as "tenantId", landlord_id as "landlordId",
                start_date as "startDate", end_date as "endDate", rent, deposit, status, 
                autopay_enabled as "autopayEnabled"
         FROM leases WHERE property_id = ANY($1)`,
        [propertyIds]
      );
      return res.json(result.rows);
    } else if (req.apiUser?.userType === "tenant") {
      const result = await pool.query(
        `SELECT id, property_id as "propertyId", tenant_id as "tenantId", landlord_id as "landlordId",
                start_date as "startDate", end_date as "endDate", rent, deposit, status,
                autopay_enabled as "autopayEnabled"
         FROM leases WHERE tenant_id = $1`,
        [req.apiUser?.id]
      );
      return res.json(result.rows);
    }
    res.status(403).json({ message: "Forbidden" });
  } catch (error) {
    console.error("Get leases error:", error);
    res.status(500).json({ message: "Failed to get leases" });
  }
});

app.patch("/api/leases/autopay", authenticateToken, async (req: Request, res: Response) => {
  if (req.apiUser?.userType !== "tenant") {
    return res.status(403).json({ message: "Tenant access only" });
  }
  
  try {
    const { enabled } = req.body;
    const result = await pool.query(
      `UPDATE leases SET autopay_enabled = $1 WHERE tenant_id = $2 
       RETURNING id, property_id as "propertyId", tenant_id as "tenantId", landlord_id as "landlordId",
                 start_date as "startDate", end_date as "endDate", rent, deposit, status,
                 autopay_enabled as "autopayEnabled"`,
      [enabled ? "true" : "false", req.apiUser?.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No active lease found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update autopay error:", error);
    res.status(500).json({ message: "Failed to update autopay" });
  }
});

app.get("/api/payments", authenticateToken, async (req: Request, res: Response) => {
  try {
    if (req.apiUser?.userType === "landlord") {
      const properties = await pool.query(
        "SELECT id FROM properties WHERE landlord_id = $1",
        [req.apiUser?.id]
      );
      const propertyIds = properties.rows.map(p => p.id);
      
      if (propertyIds.length === 0) {
        return res.json([]);
      }
      
      const leases = await pool.query(
        "SELECT id FROM leases WHERE property_id = ANY($1)",
        [propertyIds]
      );
      const leaseIds = leases.rows.map(l => l.id);
      
      if (leaseIds.length === 0) {
        return res.json([]);
      }
      
      const result = await pool.query(
        `SELECT id, lease_id as "leaseId", tenant_id as "tenantId", amount, date, status, method
         FROM payments WHERE lease_id = ANY($1)`,
        [leaseIds]
      );
      return res.json(result.rows);
    } else if (req.apiUser?.userType === "tenant") {
      const result = await pool.query(
        `SELECT id, lease_id as "leaseId", tenant_id as "tenantId", amount, date, status, method
         FROM payments WHERE tenant_id = $1`,
        [req.apiUser?.id]
      );
      return res.json(result.rows);
    }
    res.status(403).json({ message: "Forbidden" });
  } catch (error) {
    console.error("Get payments error:", error);
    res.status(500).json({ message: "Failed to get payments" });
  }
});

app.post("/api/payments", authenticateToken, async (req: Request, res: Response) => {
  if (req.apiUser?.userType !== "tenant") {
    return res.status(403).json({ message: "Tenant access only" });
  }
  
  try {
    const leaseResult = await pool.query(
      "SELECT id FROM leases WHERE tenant_id = $1 AND status = 'active' LIMIT 1",
      [req.apiUser?.id]
    );
    
    if (leaseResult.rows.length === 0) {
      return res.status(404).json({ message: "No active lease found" });
    }
    
    const { amount, dueDate } = req.body;
    const paidDate = new Date().toISOString();
    
    const result = await pool.query(
      `INSERT INTO payments (id, lease_id, tenant_id, amount, date, status, method)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, 'paid', 'card')
       RETURNING id, lease_id as "leaseId", tenant_id as "tenantId", amount, date, status, method`,
      [leaseResult.rows[0].id, req.apiUser?.id, amount, paidDate]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create payment error:", error);
    res.status(500).json({ message: "Failed to create payment" });
  }
});

app.get("/api/payments/:id/receipt", authenticateToken, async (req: Request, res: Response) => {
  if (req.apiUser?.userType !== "tenant") {
    return res.status(403).json({ message: "Tenant access only" });
  }
  
  try {
    const result = await pool.query(
      `SELECT id, amount, date, status FROM payments WHERE id = $1 AND tenant_id = $2`,
      [req.params.id, req.apiUser?.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }
    
    const payment = result.rows[0];
    
    res.setHeader("Content-Type", "text/html");
    res.send(`
      <html>
        <body style="font-family: sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; border: 1px solid #ccc;">
          <h1 style="color: #333;">Rent Receipt</h1>
          <p><strong>Payment ID:</strong> ${payment.id}</p>
          <p><strong>Date:</strong> ${new Date(payment.date || Date.now()).toLocaleDateString()}</p>
          <hr/>
          <p>This confirms that we have received your rent payment.</p>
          <p><strong>Amount Paid:</strong> $${payment.amount}</p>
          <p><strong>Status:</strong> ${payment.status}</p>
          <br/>
          <p>Thank you,<br/>RentExpress Management</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Get receipt error:", error);
    res.status(500).json({ message: "Failed to get receipt" });
  }
});

app.get("/api/maintenance", authenticateToken, async (req: Request, res: Response) => {
  try {
    if (req.apiUser?.userType === "landlord") {
      const properties = await pool.query(
        "SELECT id FROM properties WHERE landlord_id = $1",
        [req.apiUser?.id]
      );
      const propertyIds = properties.rows.map(p => p.id);
      
      if (propertyIds.length === 0) {
        return res.json([]);
      }
      
      const result = await pool.query(
        `SELECT id, property_id as "propertyId", tenant_id as "tenantId", title, description, 
                priority, status, category, created_at as "createdAt"
         FROM maintenance_requests WHERE property_id = ANY($1)
         ORDER BY created_at DESC`,
        [propertyIds]
      );
      return res.json(result.rows);
    } else if (req.apiUser?.userType === "tenant") {
      const result = await pool.query(
        `SELECT id, property_id as "propertyId", tenant_id as "tenantId", title, description, 
                priority, status, category, created_at as "createdAt"
         FROM maintenance_requests WHERE tenant_id = $1
         ORDER BY created_at DESC`,
        [req.apiUser?.id]
      );
      return res.json(result.rows);
    }
    res.status(403).json({ message: "Forbidden" });
  } catch (error) {
    console.error("Get maintenance error:", error);
    res.status(500).json({ message: "Failed to get maintenance requests" });
  }
});

app.post("/api/maintenance", authenticateToken, async (req: Request, res: Response) => {
  if (req.apiUser?.userType !== "tenant") {
    return res.status(403).json({ message: "Tenant access only" });
  }
  
  try {
    const leaseResult = await pool.query(
      "SELECT property_id FROM leases WHERE tenant_id = $1 AND status = 'active' LIMIT 1",
      [req.apiUser?.id]
    );
    
    if (leaseResult.rows.length === 0) {
      return res.status(404).json({ message: "No active lease found" });
    }
    
    const { title, description, priority, category } = req.body;
    
    const result = await pool.query(
      `INSERT INTO maintenance_requests (id, property_id, tenant_id, title, description, priority, status, category, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 'Open', $6, NOW())
       RETURNING id, property_id as "propertyId", tenant_id as "tenantId", title, description, 
                 priority, status, category, created_at as "createdAt"`,
      [leaseResult.rows[0].property_id, req.apiUser?.id, title, description, priority || "Medium", category]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create maintenance error:", error);
    res.status(500).json({ message: "Failed to create maintenance request" });
  }
});

app.get("/api/documents", authenticateToken, async (req: Request, res: Response) => {
  if (req.apiUser?.userType !== "tenant") {
    return res.status(403).json({ message: "Tenant access only" });
  }
  
  try {
    const result = await pool.query(
      `SELECT id, tenant_id as "tenantId", name, type, url, created_at as "createdAt"
       FROM documents WHERE tenant_id = $1
       ORDER BY created_at DESC`,
      [req.apiUser?.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get documents error:", error);
    res.status(500).json({ message: "Failed to get documents" });
  }
});

app.post("/api/documents", authenticateToken, async (req: Request, res: Response) => {
  if (req.apiUser?.userType !== "tenant") {
    return res.status(403).json({ message: "Tenant access only" });
  }
  
  try {
    const { name, type, url } = req.body;
    
    const result = await pool.query(
      `INSERT INTO documents (id, tenant_id, name, type, url, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
       RETURNING id, tenant_id as "tenantId", name, type, url, created_at as "createdAt"`,
      [req.apiUser?.id, name, type, url]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create document error:", error);
    res.status(500).json({ message: "Failed to create document" });
  }
});

app.get("/api/documents/:id/download", authenticateToken, async (req: Request, res: Response) => {
  if (req.apiUser?.userType !== "tenant") {
    return res.status(403).json({ message: "Tenant access only" });
  }
  
  res.setHeader("Content-Disposition", 'attachment; filename="document.txt"');
  res.setHeader("Content-Type", "text/plain");
  res.send("This is a placeholder for the actual document content.");
});

app.get("/api/charges", authenticateToken, async (req: Request, res: Response) => {
  try {
    let query = "";
    let params: any[] = [];
    
    if (req.apiUser?.userType === "landlord") {
      query = `SELECT c.*, l.id as "leaseId", u.username as "tenantName", p.name as "propertyName"
               FROM charges c
               LEFT JOIN leases l ON c.lease_id = l.id
               LEFT JOIN users u ON c.tenant_id = u.id
               LEFT JOIN properties p ON l.property_id = p.id
               WHERE c.landlord_id = $1
               ORDER BY c.charge_date DESC`;
      params = [req.apiUser?.id];
    } else if (req.apiUser?.userType === "tenant") {
      query = `SELECT c.*, l.id as "leaseId", p.name as "propertyName"
               FROM charges c
               LEFT JOIN leases l ON c.lease_id = l.id
               LEFT JOIN properties p ON l.property_id = p.id
               WHERE c.tenant_id = $1
               ORDER BY c.charge_date DESC`;
      params = [req.apiUser?.id];
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Get charges error:", error);
    res.status(500).json({ message: "Failed to get charges" });
  }
});

app.post("/api/charges", authenticateToken, async (req: Request, res: Response) => {
  if (req.apiUser?.userType !== "landlord") {
    return res.status(403).json({ message: "Landlord access only" });
  }
  
  try {
    const { leaseId, tenantId, description, amount, chargeDate, dueDate, category } = req.body;
    
    const result = await pool.query(
      `INSERT INTO charges (id, lease_id, tenant_id, landlord_id, description, amount, charge_date, due_date, status, category, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, 'scheduled', $8, NOW())
       RETURNING *`,
      [leaseId, tenantId, req.apiUser?.id, description, amount, chargeDate, dueDate, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create charge error:", error);
    res.status(500).json({ message: "Failed to create charge" });
  }
});

app.patch("/api/charges/:id", authenticateToken, async (req: Request, res: Response) => {
  if (req.apiUser?.userType !== "landlord") {
    return res.status(403).json({ message: "Landlord access only" });
  }
  
  try {
    const { status, invoiceSent, reminderSent, receiptSent } = req.body;
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;
    
    if (status) {
      updates.push(`status = $${paramIndex++}`);
      params.push(status);
    }
    if (invoiceSent !== undefined) {
      updates.push(`invoice_sent = $${paramIndex++}`);
      params.push(invoiceSent);
    }
    if (reminderSent !== undefined) {
      updates.push(`reminder_sent = $${paramIndex++}`);
      params.push(reminderSent);
    }
    if (receiptSent !== undefined) {
      updates.push(`receipt_sent = $${paramIndex++}`);
      params.push(receiptSent);
    }
    
    params.push(req.params.id, req.apiUser?.id);
    
    const result = await pool.query(
      `UPDATE charges SET ${updates.join(", ")} WHERE id = $${paramIndex++} AND landlord_id = $${paramIndex}
       RETURNING *`,
      params
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Charge not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update charge error:", error);
    res.status(500).json({ message: "Failed to update charge" });
  }
});

app.delete("/api/charges/:id", authenticateToken, async (req: Request, res: Response) => {
  if (req.apiUser?.userType !== "landlord") {
    return res.status(403).json({ message: "Landlord access only" });
  }
  
  try {
    const result = await pool.query(
      `DELETE FROM charges WHERE id = $1 AND landlord_id = $2 RETURNING id`,
      [req.params.id, req.apiUser?.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Charge not found" });
    }
    res.json({ message: "Charge deleted" });
  } catch (error) {
    console.error("Delete charge error:", error);
    res.status(500).json({ message: "Failed to delete charge" });
  }
});

app.post("/api/charges/:id/send-notification", authenticateToken, async (req: Request, res: Response) => {
  if (req.apiUser?.userType !== "landlord") {
    return res.status(403).json({ message: "Landlord access only" });
  }
  
  try {
    const { type } = req.body;
    if (!["invoice", "reminder", "receipt"].includes(type)) {
      return res.status(400).json({ message: "Invalid notification type" });
    }
    
    const chargeResult = await pool.query(
      `SELECT c.*, u.username as tenant_username, 
              (u.profile_data->>'email') as tenant_email,
              (u.profile_data->>'firstName') as tenant_first_name
       FROM charges c
       LEFT JOIN users u ON c.tenant_id = u.id
       WHERE c.id = $1 AND c.landlord_id = $2`,
      [req.params.id, req.apiUser?.id]
    );
    
    if (chargeResult.rows.length === 0) {
      return res.status(404).json({ message: "Charge not found" });
    }
    
    const charge = chargeResult.rows[0];
    const tenantEmail = charge.tenant_email;
    const tenantName = charge.tenant_first_name || charge.tenant_username || "Tenant";
    const updateField = type === "invoice" ? "invoice_sent" : type === "reminder" ? "reminder_sent" : "receipt_sent";
    
    if (tenantEmail) {
      const emailResult = await sendChargeEmail(
        type as "invoice" | "reminder" | "receipt",
        tenantEmail,
        tenantName,
        charge.amount,
        charge.due_date,
        charge.description
      );
      
      if (!emailResult.success) {
        return res.status(500).json({ message: `Failed to send email: ${emailResult.error}` });
      }
    }
    
    await pool.query(`UPDATE charges SET ${updateField} = 'true' WHERE id = $1`, [req.params.id]);
    
    const message = tenantEmail 
      ? `${type} email sent to ${tenantEmail}` 
      : `Notification marked as sent (no email configured for tenant)`;
    
    res.json({ message });
  } catch (error) {
    console.error("Send notification error:", error);
    res.status(500).json({ message: "Failed to send notification" });
  }
});

app.get("/api/syndication", authenticateToken, async (req: Request, res: Response) => {
  if (req.apiUser?.userType !== "landlord") {
    return res.status(403).json({ message: "Landlord access only" });
  }
  
  try {
    const result = await pool.query(
      `SELECT ps.*, p.name as "propertyName", p.address
       FROM property_syndication ps
       LEFT JOIN properties p ON ps.property_id = p.id
       WHERE p.landlord_id = $1
       ORDER BY ps.created_at DESC`,
      [req.apiUser?.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get syndication error:", error);
    res.status(500).json({ message: "Failed to get syndication data" });
  }
});

app.post("/api/syndication", authenticateToken, async (req: Request, res: Response) => {
  if (req.apiUser?.userType !== "landlord") {
    return res.status(403).json({ message: "Landlord access only" });
  }
  
  try {
    const { propertyId, platform, enabled } = req.body;
    
    const existing = await pool.query(
      `SELECT id FROM property_syndication WHERE property_id = $1 AND platform = $2`,
      [propertyId, platform]
    );
    
    if (existing.rows.length > 0) {
      const result = await pool.query(
        `UPDATE property_syndication SET enabled = $1, last_synced_at = NOW() WHERE id = $2 RETURNING *`,
        [enabled, existing.rows[0].id]
      );
      return res.json(result.rows[0]);
    }
    
    const result = await pool.query(
      `INSERT INTO property_syndication (id, property_id, platform, enabled, status, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, 'pending', NOW())
       RETURNING *`,
      [propertyId, platform, enabled]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create syndication error:", error);
    res.status(500).json({ message: "Failed to create syndication" });
  }
});

app.patch("/api/syndication/:id/sync", authenticateToken, async (req: Request, res: Response) => {
  if (req.apiUser?.userType !== "landlord") {
    return res.status(403).json({ message: "Landlord access only" });
  }
  
  try {
    const result = await pool.query(
      `UPDATE property_syndication 
       SET status = 'synced', last_synced_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Syndication not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Sync syndication error:", error);
    res.status(500).json({ message: "Failed to sync" });
  }
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Server error:", err);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
