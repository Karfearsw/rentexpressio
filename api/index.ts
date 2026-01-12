import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { Pool } from "pg";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

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

interface JWTPayload {
  userId: string;
  username: string;
  userType: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
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
    { userId: user.id, username: user.username, userType: user.userType },
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
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      req.user = decoded;
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
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  try {
    const result = await pool.query(
      `SELECT id, username, user_type as "userType", profile_data as "profileData" 
       FROM users WHERE id = $1`,
      [req.user.userId]
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
  if (req.user?.userType !== "landlord") {
    return res.status(403).json({ message: "Landlord access only" });
  }
  
  try {
    const result = await pool.query(
      `SELECT id, landlord_id as "landlordId", name, address, city, state, zip, type,
              bedrooms, bathrooms, square_feet as "squareFeet", rent, status
       FROM properties WHERE landlord_id = $1`,
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get properties error:", error);
    res.status(500).json({ message: "Failed to get properties" });
  }
});

app.post("/api/properties", authenticateToken, async (req: Request, res: Response) => {
  if (req.user?.userType !== "landlord") {
    return res.status(403).json({ message: "Landlord access only" });
  }
  
  try {
    const { name, address, city, state, zip, type, bedrooms, bathrooms, squareFeet, rent, status } = req.body;
    const result = await pool.query(
      `INSERT INTO properties (id, landlord_id, name, address, city, state, zip, type, bedrooms, bathrooms, square_feet, rent, status)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id, landlord_id as "landlordId", name, address, city, state, zip, type,
                 bedrooms, bathrooms, square_feet as "squareFeet", rent, status`,
      [req.user.userId, name, address, city, state, zip, type, bedrooms, bathrooms, squareFeet, rent, status || "Vacant"]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create property error:", error);
    res.status(500).json({ message: "Failed to create property" });
  }
});

app.get("/api/leases", authenticateToken, async (req: Request, res: Response) => {
  try {
    if (req.user?.userType === "landlord") {
      const properties = await pool.query(
        "SELECT id FROM properties WHERE landlord_id = $1",
        [req.user.userId]
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
    } else if (req.user?.userType === "tenant") {
      const result = await pool.query(
        `SELECT id, property_id as "propertyId", tenant_id as "tenantId", landlord_id as "landlordId",
                start_date as "startDate", end_date as "endDate", rent, deposit, status,
                autopay_enabled as "autopayEnabled"
         FROM leases WHERE tenant_id = $1`,
        [req.user.userId]
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
  if (req.user?.userType !== "tenant") {
    return res.status(403).json({ message: "Tenant access only" });
  }
  
  try {
    const { enabled } = req.body;
    const result = await pool.query(
      `UPDATE leases SET autopay_enabled = $1 WHERE tenant_id = $2 
       RETURNING id, property_id as "propertyId", tenant_id as "tenantId", landlord_id as "landlordId",
                 start_date as "startDate", end_date as "endDate", rent, deposit, status,
                 autopay_enabled as "autopayEnabled"`,
      [enabled ? "true" : "false", req.user.userId]
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
    if (req.user?.userType === "landlord") {
      const properties = await pool.query(
        "SELECT id FROM properties WHERE landlord_id = $1",
        [req.user.userId]
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
    } else if (req.user?.userType === "tenant") {
      const result = await pool.query(
        `SELECT id, lease_id as "leaseId", tenant_id as "tenantId", amount, date, status, method
         FROM payments WHERE tenant_id = $1`,
        [req.user.userId]
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
  if (req.user?.userType !== "tenant") {
    return res.status(403).json({ message: "Tenant access only" });
  }
  
  try {
    const leaseResult = await pool.query(
      "SELECT id FROM leases WHERE tenant_id = $1 AND status = 'active' LIMIT 1",
      [req.user.userId]
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
      [leaseResult.rows[0].id, req.user.userId, amount, paidDate]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create payment error:", error);
    res.status(500).json({ message: "Failed to create payment" });
  }
});

app.get("/api/payments/:id/receipt", authenticateToken, async (req: Request, res: Response) => {
  if (req.user?.userType !== "tenant") {
    return res.status(403).json({ message: "Tenant access only" });
  }
  
  try {
    const result = await pool.query(
      `SELECT id, amount, date, status FROM payments WHERE id = $1 AND tenant_id = $2`,
      [req.params.id, req.user.userId]
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
    if (req.user?.userType === "landlord") {
      const properties = await pool.query(
        "SELECT id FROM properties WHERE landlord_id = $1",
        [req.user.userId]
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
    } else if (req.user?.userType === "tenant") {
      const result = await pool.query(
        `SELECT id, property_id as "propertyId", tenant_id as "tenantId", title, description, 
                priority, status, category, created_at as "createdAt"
         FROM maintenance_requests WHERE tenant_id = $1
         ORDER BY created_at DESC`,
        [req.user.userId]
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
  if (req.user?.userType !== "tenant") {
    return res.status(403).json({ message: "Tenant access only" });
  }
  
  try {
    const leaseResult = await pool.query(
      "SELECT property_id FROM leases WHERE tenant_id = $1 AND status = 'active' LIMIT 1",
      [req.user.userId]
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
      [leaseResult.rows[0].property_id, req.user.userId, title, description, priority || "Medium", category]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create maintenance error:", error);
    res.status(500).json({ message: "Failed to create maintenance request" });
  }
});

app.get("/api/documents", authenticateToken, async (req: Request, res: Response) => {
  if (req.user?.userType !== "tenant") {
    return res.status(403).json({ message: "Tenant access only" });
  }
  
  try {
    const result = await pool.query(
      `SELECT id, tenant_id as "tenantId", name, type, url, created_at as "createdAt"
       FROM documents WHERE tenant_id = $1
       ORDER BY created_at DESC`,
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get documents error:", error);
    res.status(500).json({ message: "Failed to get documents" });
  }
});

app.post("/api/documents", authenticateToken, async (req: Request, res: Response) => {
  if (req.user?.userType !== "tenant") {
    return res.status(403).json({ message: "Tenant access only" });
  }
  
  try {
    const { name, type, url } = req.body;
    
    const result = await pool.query(
      `INSERT INTO documents (id, tenant_id, name, type, url, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
       RETURNING id, tenant_id as "tenantId", name, type, url, created_at as "createdAt"`,
      [req.user.userId, name, type, url]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create document error:", error);
    res.status(500).json({ message: "Failed to create document" });
  }
});

app.get("/api/documents/:id/download", authenticateToken, async (req: Request, res: Response) => {
  if (req.user?.userType !== "tenant") {
    return res.status(403).json({ message: "Tenant access only" });
  }
  
  res.setHeader("Content-Disposition", 'attachment; filename="document.txt"');
  res.setHeader("Content-Type", "text/plain");
  res.send("This is a placeholder for the actual document content.");
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Server error:", err);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
