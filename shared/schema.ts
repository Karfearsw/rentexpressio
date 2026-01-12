import { sql } from "drizzle-orm";
import { jsonb, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  userType: text("user_type").notNull(),
  // Store profile data as JSONB for flexibility across roles
  profileData: jsonb("profile_data").default({}), 
});

export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  landlordId: varchar("landlord_id").notNull(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city"),
  state: text("state"),
  zip: text("zip"),
  type: text("type"),
  bedrooms: text("bedrooms"),
  bathrooms: text("bathrooms"),
  squareFeet: text("square_feet"),
  rent: text("rent"),
  status: text("status").default("Vacant"),
});

export const leases = pgTable("leases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull(),
  tenantId: varchar("tenant_id").notNull(),
  landlordId: varchar("landlord_id").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  rent: text("rent").notNull(),
  deposit: text("deposit"),
  status: text("status").notNull().default("active"),
  autopayEnabled: text("autopay_enabled").notNull().default("false"),
});

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // Lease, Receipt, Checklist, Policy, etc.
  url: text("url").notNull(), // In MVP, this might be a local path or stub
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leaseId: varchar("lease_id").notNull(),
  tenantId: varchar("tenant_id").notNull(),
  amount: text("amount").notNull(),
  date: text("date").notNull(),
  status: text("status").notNull().default("Pending"),
  method: text("method"),
});

export const maintenanceRequests = pgTable("maintenance_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull(),
  tenantId: varchar("tenant_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: text("priority").notNull().default("Medium"),
  status: text("status").notNull().default("Open"),
  category: text("category"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  userType: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Property = typeof properties.$inferSelect;
export type Lease = typeof leases.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type MaintenanceRequest = typeof maintenanceRequests.$inferSelect;

export const userTypeEnum = z.enum(["tenant", "landlord", "enterprise"]);

export const tenantProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid 10-digit phone number"),
  
  // Application Basics
  currentCity: z.string().min(1, "Current city is required"),
  currentState: z.string().min(2, "State is required"),
  desiredMoveInDate: z.string().min(1, "Move-in date is required"),
  pets: z.boolean().default(false),
  petDetails: z.string().optional(),
  smoking: z.boolean().default(false),
  occupants: z.number().int().min(1, "At least 1 occupant").default(1),
  preferredRentMax: z.number().positive().optional(),
  preferredUnitSize: z.string().optional(),

  // Employment & Income
  monthlyIncome: z.number().positive("Income must be positive"),
  employmentStatus: z.enum(["employed", "self-employed", "student", "unemployed", "retired"]),
  employerName: z.string().optional(),
  jobTitle: z.string().optional(),
  timeAtJob: z.string().optional(),
  consentContactEmployer: z.boolean().default(false),

  // Rental History
  residenceType: z.enum(["renting", "own", "family", "other"]),
  currentLandlordName: z.string().optional(),
  currentLandlordContact: z.string().optional(),
  timeAtAddress: z.string().optional(),
  reasonForMoving: z.string().optional(),

  // Consent Flags
  consentFlags: z.object({
    marketing: z.boolean().default(false),
    screening: z.boolean().default(false), // FCRA Consent
    screeningTimestamp: z.string().optional(),
    screeningIp: z.string().optional(),
  }).default({ marketing: false, screening: false }),
});

export const landlordProfileSchema = z.object({
  // Company & Contact
  companyName: z.string().min(1, "Company name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid 10-digit phone number"),
  roleType: z.enum(["individual", "management_company", "investment_group"]).default("individual"),
  website: z.string().url().optional().or(z.literal("")),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  timeInBusiness: z.enum(["<1y", "1-3y", "3-5y", "5y+"]).optional(),

  // Portfolio
  portfolioSize: z.number().int().nonnegative().optional(), // Units Under Management
  propertiesManaged: z.number().int().nonnegative().optional(), // Number of Properties
  propertyTypes: z.array(z.string()).default([]),
  averageRent: z.string().optional(),

  // Goals & Plan
  primaryGoal: z.string().optional(),
  mustHaveFeatures: z.array(z.string()).default([]),
  currentTools: z.string().optional(),
  planInterest: z.enum(["demo", "10-50", "51-200", "200+"]).optional(),

  // Consents
  consentFlags: z.object({
    terms: z.boolean().refine(val => val === true, "You must accept the terms"),
    marketing: z.boolean().default(false),
  }).default({ terms: false, marketing: false }),
});

export const enterpriseProfileSchema = z.object({
  // Organization Details
  orgName: z.string().min(1, "Organization name is required"),
  orgType: z.enum(["management_company", "institutional", "brokerage", "corporate_housing", "other"]).default("management_company"),
  regions: z.string().min(1, "Regions/Markets are required"),
  unitsManaged: z.number().int().nonnegative().optional(),
  propertiesCount: z.number().int().nonnegative().optional(),
  timeInBusiness: z.string().optional(),

  // Operational Scope & Modules
  primaryUseCase: z.enum(["internal", "resale", "both"]).default("internal"),
  criticalModules: z.array(z.string()).default([]),
  compliancePriorities: z.array(z.string()).default([]),
  securityFeatures: z.array(z.string()).default([]),
  anticipatedRoles: z.string().optional(),

  // Integrations & Technical
  existingSystems: z.array(z.string()).default([]),
  existingSystemsOther: z.string().optional(),
  technicalContact: z.string().email().optional().or(z.literal("")),
  itResources: z.enum(["dedicated", "shared", "external", "none"]).default("dedicated"),

  // Account Owner
  adminName: z.string().min(1, "Admin name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid 10-digit phone number"),

  // Plan & Commitment
  subscriptionPlan: z.enum(["growth", "pro", "enterprise", "custom"]).default("growth"),
  initialSeats: z.number().int().positive().default(1),
  timelineToLaunch: z.string().optional(),

  // Consents
  consentFlags: z.object({
    terms: z.boolean().refine(val => val === true, "You must accept the terms"),
    marketing: z.boolean().default(false),
  }).default({ terms: false, marketing: false }),
});

export const registerUserSchema = z.discriminatedUnion("userType", [
  z.object({
    userType: z.literal("tenant"),
    username: z.string().min(3),
    password: z.string().min(6),
    profile: tenantProfileSchema,
  }),
  z.object({
    userType: z.literal("landlord"),
    username: z.string().min(3),
    password: z.string().min(6),
    profile: landlordProfileSchema,
  }),
  z.object({
    userType: z.literal("enterprise"),
    username: z.string().min(3),
    password: z.string().min(6),
    profile: enterpriseProfileSchema,
  }),
]);

export type TenantProfile = z.infer<typeof tenantProfileSchema>;
export type LandlordProfile = z.infer<typeof landlordProfileSchema>;
export type EnterpriseProfile = z.infer<typeof enterpriseProfileSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema>;
