import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth helper
  app.get("/api/auth/check-username", async (req, res) => {
    const username = (req.query.username as string) || "";
    if (!username) {
      return res.status(400).json({ message: "username is required" });
    }
    const existing = await storage.getUserByUsername(username);
    return res.json({ available: !existing });
  });

  // Protected Routes
  
  // Properties
  app.get("/api/properties", isAuthenticated, async (req, res) => {
    if (req.user?.userType !== "landlord") return res.sendStatus(403);
    const properties = await storage.getPropertiesByLandlord(req.user.id);
    res.json(properties);
  });

  app.post("/api/properties", isAuthenticated, async (req, res) => {
    if (req.user?.userType !== "landlord") return res.sendStatus(403);
    const property = await storage.createProperty({
      ...req.body,
      landlordId: req.user.id,
    });
    res.status(201).json(property);
  });

  // Leases
  app.get("/api/leases", isAuthenticated, async (req, res) => {
    // For landlord: all leases for their properties
    // For tenant: their own lease
    if (req.user?.userType === "landlord") {
      // simplified: fetch all properties then all leases (inefficient but works for MVP)
      const properties = await storage.getPropertiesByLandlord(req.user.id);
      const leases = [];
      for (const p of properties) {
        const propLeases = await storage.getLeasesByProperty(p.id);
        leases.push(...propLeases);
      }
      return res.json(leases);
    } else if (req.user?.userType === "tenant") {
      const lease = await storage.getLeaseByTenant(req.user.id);
      return res.json(lease ? [lease] : []);
    }
    res.sendStatus(403);
  });

  app.patch("/api/leases/autopay", isAuthenticated, async (req, res) => {
    if (req.user?.userType !== "tenant") return res.sendStatus(403);
    const { enabled } = req.body;
    const lease = await storage.updateLeaseAutopay(req.user.id, enabled);
    if (!lease) return res.status(404).json({ message: "No active lease found" });
    res.json(lease);
  });

  // Payments (Rent Collection Engine)
  app.get("/api/payments", isAuthenticated, async (req, res) => {
    if (req.user?.userType === "landlord") {
      // simplified: get all payments for owned properties
      // TODO: optimize query in storage
      const properties = await storage.getPropertiesByLandlord(req.user.id);
      const allPayments = [];
      for (const p of properties) {
        const leases = await storage.getLeasesByProperty(p.id);
        for (const l of leases) {
          const payments = await storage.getPaymentsByLease(l.id);
          allPayments.push(...payments);
        }
      }
      return res.json(allPayments);
    } else if (req.user?.userType === "tenant") {
      const payments = await storage.getPaymentsByTenant(req.user.id);
      return res.json(payments);
    }
    res.sendStatus(403);
  });

  app.post("/api/payments", isAuthenticated, async (req, res) => {
    if (req.user?.userType !== "tenant") return res.sendStatus(403);
    const lease = await storage.getLeaseByTenant(req.user.id);
    if (!lease) return res.status(404).json({ message: "No active lease found" });

    const payment = await storage.createPayment({
      leaseId: lease.id,
      tenantId: req.user.id,
      amount: req.body.amount,
      dueDate: req.body.dueDate || new Date().toISOString(),
      status: "paid", // Mocking immediate success
      paidDate: new Date().toISOString(),
    });
    res.status(201).json(payment);
  });

  app.get("/api/payments/:id/receipt", isAuthenticated, async (req, res) => {
    if (req.user?.userType !== "tenant") return res.sendStatus(403);
    const payments = await storage.getPaymentsByTenant(req.user.id);
    const payment = payments.find((p) => p.id === req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    // Return a simple HTML receipt for MVP
    const id = req.params.id;
    // In real app, verify ownership
    res.setHeader("Content-Type", "text/html");
    res.send(`
      <html>
        <body style="font-family: sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; border: 1px solid #ccc;">
          <h1 style="color: #333;">Rent Receipt</h1>
          <p><strong>Payment ID:</strong> ${id}</p>
          <p><strong>Date:</strong> ${new Date(payment.paidDate || Date.now()).toLocaleDateString()}</p>
          <hr/>
          <p>This confirms that we have received your rent payment.</p>
          <p><strong>Amount Paid:</strong> $${payment.amount}</p>
          <p><strong>Status:</strong> ${payment.status}</p>
          <br/>
          <p>Thank you,<br/>RentExpress Management</p>
        </body>
      </html>
    `);
  });

  // Maintenance (Triage Engine)
  app.get("/api/maintenance", isAuthenticated, async (req, res) => {
    if (req.user?.userType === "landlord") {
      const properties = await storage.getPropertiesByLandlord(req.user.id);
      const requests = [];
      for (const p of properties) {
        const propRequests = await storage.getMaintenanceRequestsByProperty(p.id);
        requests.push(...propRequests);
      }
      return res.json(requests);
    } else if (req.user?.userType === "tenant") {
      const requests = await storage.getMaintenanceRequestsByTenant(req.user.id);
      return res.json(requests);
    }
    res.sendStatus(403);
  });

  app.post("/api/maintenance", isAuthenticated, async (req, res) => {
    if (req.user?.userType !== "tenant") return res.sendStatus(403);
    // Need property ID. Usually tenant knows, or we infer from lease.
    // Inferring from lease is safer.
    const lease = await storage.getLeaseByTenant(req.user.id);
    if (!lease) return res.status(404).json({ message: "No active lease found" });

    const request = await storage.createMaintenanceRequest({
      ...req.body,
      tenantId: req.user.id,
      propertyId: lease.propertyId,
      status: "open",
    });
    res.status(201).json(request);
  });

  // Documents (Digital Filing Cabinet)
  app.get("/api/documents", isAuthenticated, async (req, res) => {
    if (req.user?.userType !== "tenant") return res.sendStatus(403);
    const docs = await storage.getDocumentsByTenant(req.user.id);
    res.json(docs);
  });

  app.post("/api/documents", isAuthenticated, async (req, res) => {
    if (req.user?.userType !== "tenant") return res.sendStatus(403);
    const doc = await storage.createDocument({
      ...req.body,
      tenantId: req.user.id,
    });
    res.status(201).json(doc);
  });

  app.get("/api/documents/:id/download", isAuthenticated, async (req, res) => {
    if (req.user?.userType !== "tenant") return res.sendStatus(403);
    // In real app: stream file from storage (S3/Disk)
    // MVP: Return a text file
    res.setHeader("Content-Disposition", 'attachment; filename="document.txt"');
    res.setHeader("Content-Type", "text/plain");
    res.send("This is a placeholder for the actual document content.");
  });

  return httpServer;
}
