import { 
  type User, type InsertUser, type RegisterUser, 
  type TenantProfile, type LandlordProfile, type EnterpriseProfile,
  type Property, type Lease, type Payment, type MaintenanceRequest, type Document,
  users, properties, leases, payments, maintenanceRequests, documents
} from "@shared/schema";
import { randomUUID } from "crypto";
import session from "express-session";
import createMemoryStore from "memorystore";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, and } from "drizzle-orm";
import pkg from "pg";
const { Pool } = pkg;
import connectPgSimple from "connect-pg-simple";

const MemoryStore = createMemoryStore(session);
const PgSession = connectPgSimple(session);

export interface IStorage {
  sessionStore: session.Store;
  
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createUserWithProfile(payload: RegisterUser): Promise<User>;
  
  // Phase 1: Properties & Leases
  createProperty(property: Omit<Property, "id">): Promise<Property>;
  getPropertiesByLandlord(landlordId: string): Promise<Property[]>;
  createLease(lease: Omit<Lease, "id">): Promise<Lease>;
  getLeasesByProperty(propertyId: string): Promise<Lease[]>;
  getLeaseByTenant(tenantId: string): Promise<Lease | undefined>;
  updateLeaseAutopay(tenantId: string, enabled: boolean): Promise<Lease | undefined>;
  
  // Phase 1: Payments
  createPayment(payment: Omit<Payment, "id">): Promise<Payment>;
  getPaymentsByLease(leaseId: string): Promise<Payment[]>;
  getPaymentsByTenant(tenantId: string): Promise<Payment[]>;
  
  // Phase 1: Maintenance
  createMaintenanceRequest(request: Omit<MaintenanceRequest, "id" | "createdAt">): Promise<MaintenanceRequest>;
  getMaintenanceRequestsByProperty(propertyId: string): Promise<MaintenanceRequest[]>;
  getMaintenanceRequestsByTenant(tenantId: string): Promise<MaintenanceRequest[]>;

  // Phase 1: Documents
  createDocument(doc: Omit<Document, "id" | "createdAt">): Promise<Document>;
  getDocumentsByTenant(tenantId: string): Promise<Document[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private properties: Map<string, Property>;
  private leases: Map<string, Lease>;
  private payments: Map<string, Payment>;
  private maintenanceRequests: Map<string, MaintenanceRequest>;
  private documents: Map<string, Document>;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.leases = new Map();
    this.payments = new Map();
    this.maintenanceRequests = new Map();
    this.documents = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      profileData: insertUser.profileData || {}
    };
    this.users.set(id, user);
    return user;
  }

  async createUserWithProfile(payload: RegisterUser): Promise<User> {
    const baseUser = {
      username: payload.username,
      password: payload.password,
      userType: payload.userType,
      profileData: payload.profile,
    };
    return this.createUser(baseUser);
  }

  // Properties
  async createProperty(property: Omit<Property, "id">): Promise<Property> {
    const id = randomUUID();
    const newProperty: Property = { ...property, id };
    this.properties.set(id, newProperty);
    return newProperty;
  }

  async getPropertiesByLandlord(landlordId: string): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (p) => p.landlordId === landlordId
    );
  }

  // Leases
  async createLease(lease: Omit<Lease, "id">): Promise<Lease> {
    const id = randomUUID();
    const newLease: Lease = { ...lease, id };
    this.leases.set(id, newLease);
    return newLease;
  }

  async getLeasesByProperty(propertyId: string): Promise<Lease[]> {
    return Array.from(this.leases.values()).filter(
      (l) => l.propertyId === propertyId
    );
  }

  async getLeaseByTenant(tenantId: string): Promise<Lease | undefined> {
    return Array.from(this.leases.values()).find(
      (l) => l.tenantId === tenantId && l.status === "active"
    );
  }

  async updateLeaseAutopay(tenantId: string, enabled: boolean): Promise<Lease | undefined> {
    const lease = await this.getLeaseByTenant(tenantId);
    if (!lease) return undefined;
    
    const updatedLease = { ...lease, autopayEnabled: enabled ? "true" : "false" };
    this.leases.set(lease.id, updatedLease);
    return updatedLease;
  }

  // Payments
  async createPayment(payment: Omit<Payment, "id">): Promise<Payment> {
    const id = randomUUID();
    const newPayment: Payment = { ...payment, id };
    this.payments.set(id, newPayment);
    return newPayment;
  }

  async getPaymentsByLease(leaseId: string): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(
      (p) => p.leaseId === leaseId
    );
  }

  async getPaymentsByTenant(tenantId: string): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(
      (p) => p.tenantId === tenantId
    );
  }

  // Maintenance
  async createMaintenanceRequest(request: Omit<MaintenanceRequest, "id" | "createdAt">): Promise<MaintenanceRequest> {
    const id = randomUUID();
    const newRequest: MaintenanceRequest = { 
      ...request, 
      id,
      createdAt: new Date().toISOString()
    };
    this.maintenanceRequests.set(id, newRequest);
    return newRequest;
  }

  async getMaintenanceRequestsByProperty(propertyId: string): Promise<MaintenanceRequest[]> {
    return Array.from(this.maintenanceRequests.values()).filter(
      (r) => r.propertyId === propertyId
    );
  }

  async getMaintenanceRequestsByTenant(tenantId: string): Promise<MaintenanceRequest[]> {
    return Array.from(this.maintenanceRequests.values()).filter(
      (r) => r.tenantId === tenantId
    );
  }

  // Documents
  async createDocument(doc: Omit<Document, "id" | "createdAt">): Promise<Document> {
    const id = randomUUID();
    const newDoc: Document = { 
      ...doc, 
      id,
      createdAt: new Date().toISOString()
    };
    this.documents.set(id, newDoc);
    return newDoc;
  }

  async getDocumentsByTenant(tenantId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (d) => d.tenantId === tenantId
    );
  }
}

// PostgreSQL Storage Implementation
export class PgStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;
  private pool: InstanceType<typeof Pool>;
  sessionStore: session.Store;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is required");
    }
    
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    
    this.db = drizzle(this.pool);
    
    this.sessionStore = new PgSession({
      pool: this.pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async createUserWithProfile(payload: RegisterUser): Promise<User> {
    const baseUser = {
      username: payload.username,
      password: payload.password,
      userType: payload.userType,
      profileData: payload.profile,
    };
    return this.createUser(baseUser);
  }

  // Properties
  async createProperty(property: Omit<Property, "id">): Promise<Property> {
    const result = await this.db.insert(properties).values(property).returning();
    return result[0];
  }

  async getPropertiesByLandlord(landlordId: string): Promise<Property[]> {
    return await this.db.select().from(properties).where(eq(properties.landlordId, landlordId));
  }

  // Leases
  async createLease(lease: Omit<Lease, "id">): Promise<Lease> {
    const result = await this.db.insert(leases).values(lease).returning();
    return result[0];
  }

  async getLeasesByProperty(propertyId: string): Promise<Lease[]> {
    return await this.db.select().from(leases).where(eq(leases.propertyId, propertyId));
  }

  async getLeaseByTenant(tenantId: string): Promise<Lease | undefined> {
    const result = await this.db
      .select()
      .from(leases)
      .where(and(eq(leases.tenantId, tenantId), eq(leases.status, "active")));
    return result[0];
  }

  async updateLeaseAutopay(tenantId: string, enabled: boolean): Promise<Lease | undefined> {
    const result = await this.db
      .update(leases)
      .set({ autopayEnabled: enabled ? "true" : "false" })
      .where(and(eq(leases.tenantId, tenantId), eq(leases.status, "active")))
      .returning();
    return result[0];
  }

  // Payments
  async createPayment(payment: Omit<Payment, "id">): Promise<Payment> {
    const result = await this.db.insert(payments).values(payment).returning();
    return result[0];
  }

  async getPaymentsByLease(leaseId: string): Promise<Payment[]> {
    return await this.db.select().from(payments).where(eq(payments.leaseId, leaseId));
  }

  async getPaymentsByTenant(tenantId: string): Promise<Payment[]> {
    return await this.db.select().from(payments).where(eq(payments.tenantId, tenantId));
  }

  // Maintenance
  async createMaintenanceRequest(request: Omit<MaintenanceRequest, "id" | "createdAt">): Promise<MaintenanceRequest> {
    const result = await this.db.insert(maintenanceRequests).values(request).returning();
    return result[0];
  }

  async getMaintenanceRequestsByProperty(propertyId: string): Promise<MaintenanceRequest[]> {
    return await this.db.select().from(maintenanceRequests).where(eq(maintenanceRequests.propertyId, propertyId));
  }

  async getMaintenanceRequestsByTenant(tenantId: string): Promise<MaintenanceRequest[]> {
    return await this.db.select().from(maintenanceRequests).where(eq(maintenanceRequests.tenantId, tenantId));
  }

  // Documents
  async createDocument(doc: Omit<Document, "id" | "createdAt">): Promise<Document> {
    const result = await this.db.insert(documents).values(doc).returning();
    return result[0];
  }

  async getDocumentsByTenant(tenantId: string): Promise<Document[]> {
    return await this.db.select().from(documents).where(eq(documents.tenantId, tenantId));
  }
}

// Use PostgreSQL storage
export const storage = new PgStorage();
