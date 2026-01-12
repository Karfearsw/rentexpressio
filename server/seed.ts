import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { users, properties, leases, payments, maintenanceRequests, documents } from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  console.log("🌱 Starting database seed...");

  const hashedPassword = await hashPassword("password123");

  // Create test users
  console.log("Creating users...");
  const [landlord, tenant1, tenant2, admin] = await db
    .insert(users)
    .values([
      {
        username: "landlord",
        password: hashedPassword,
        userType: "Landlord",
        profileData: {
          name: "Sarah Johnson",
          email: "sarah.johnson@example.com",
          phone: "(555) 123-4567",
          companyName: "Prime Properties LLC",
        },
      },
      {
        username: "tenant1",
        password: hashedPassword,
        userType: "Tenant",
        profileData: {
          name: "Michael Chen",
          email: "michael.chen@example.com",
          phone: "(555) 234-5678",
        },
      },
      {
        username: "tenant2",
        password: hashedPassword,
        userType: "Tenant",
        profileData: {
          name: "Emily Rodriguez",
          email: "emily.r@example.com",
          phone: "(555) 345-6789",
        },
      },
      {
        username: "admin",
        password: hashedPassword,
        userType: "Enterprise/Admin",
        profileData: {
          name: "Admin User",
          email: "admin@rentexpress.com",
          phone: "(555) 999-0000",
          companyName: "RentExpress HQ",
        },
      },
    ])
    .returning();

  console.log("✓ Created 4 users (landlord, tenant1, tenant2, admin)");

  // Create properties
  console.log("Creating properties...");
  const [prop1, prop2, prop3] = await db
    .insert(properties)
    .values([
      {
        landlordId: landlord.id,
        name: "Sunset Apartments",
        address: "123 Main Street, Unit 4B",
        city: "San Francisco",
        state: "CA",
        zip: "94102",
        type: "Apartment",
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1200,
        rent: 3500,
        status: "Occupied",
      },
      {
        landlordId: landlord.id,
        name: "Riverside Lofts",
        address: "456 River Road, Suite 12",
        city: "Oakland",
        state: "CA",
        zip: "94607",
        type: "Loft",
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 850,
        rent: 2800,
        status: "Occupied",
      },
      {
        landlordId: landlord.id,
        name: "Downtown Studios",
        address: "789 Market Street, #201",
        city: "San Francisco",
        state: "CA",
        zip: "94103",
        type: "Studio",
        bedrooms: 0,
        bathrooms: 1,
        squareFeet: 500,
        rent: 2200,
        status: "Vacant",
      },
    ])
    .returning();

  console.log("✓ Created 3 properties");

  // Create leases
  console.log("Creating leases...");
  const [lease1, lease2] = await db
    .insert(leases)
    .values([
      {
        propertyId: prop1.id,
        tenantId: tenant1.id,
        landlordId: landlord.id,
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        rent: 3500,
        deposit: 3500,
        status: "active",
        autopayEnabled: "true",
      },
      {
        propertyId: prop2.id,
        tenantId: tenant2.id,
        landlordId: landlord.id,
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        rent: 2800,
        deposit: 2800,
        status: "active",
        autopayEnabled: "false",
      },
    ])
    .returning();

  console.log("✓ Created 2 active leases");

  // Create payment records
  console.log("Creating payment records...");
  await db.insert(payments).values([
    {
      leaseId: lease1.id,
      tenantId: tenant1.id,
      amount: 3500,
      date: "2025-01-01",
      status: "Paid",
      method: "Auto-Pay",
    },
    {
      leaseId: lease1.id,
      tenantId: tenant1.id,
      amount: 3500,
      date: "2025-02-01",
      status: "Pending",
      method: "Auto-Pay",
    },
    {
      leaseId: lease2.id,
      tenantId: tenant2.id,
      amount: 2800,
      date: "2025-01-01",
      status: "Paid",
      method: "Credit Card",
    },
    {
      leaseId: lease2.id,
      tenantId: tenant2.id,
      amount: 2800,
      date: "2025-02-01",
      status: "Overdue",
      method: "Credit Card",
    },
  ]);

  console.log("✓ Created 4 payment records");

  // Create maintenance requests
  console.log("Creating maintenance requests...");
  await db.insert(maintenanceRequests).values([
    {
      propertyId: prop1.id,
      tenantId: tenant1.id,
      title: "Leaking faucet in kitchen",
      description: "The kitchen sink faucet has been dripping constantly for the past week. It's wasting water and making noise at night.",
      priority: "Medium",
      status: "In Progress",
      category: "Plumbing",
    },
    {
      propertyId: prop1.id,
      tenantId: tenant1.id,
      title: "HVAC not heating properly",
      description: "The heater is running but not producing enough warm air. Temperature inside is only reaching 60°F.",
      priority: "High",
      status: "Open",
      category: "HVAC",
    },
    {
      propertyId: prop2.id,
      tenantId: tenant2.id,
      title: "Broken window lock",
      description: "The lock on the bedroom window is broken and won't secure properly. This is a security concern.",
      priority: "High",
      status: "Open",
      category: "Security",
    },
    {
      propertyId: prop2.id,
      tenantId: tenant2.id,
      title: "Light fixture buzzing",
      description: "The overhead light in the living room makes a buzzing sound when turned on.",
      priority: "Low",
      status: "Completed",
      category: "Electrical",
    },
  ]);

  console.log("✓ Created 4 maintenance requests");

  // Create documents
  console.log("Creating documents...");
  await db.insert(documents).values([
    {
      tenantId: tenant1.id,
      name: "Lease Agreement - Sunset Apartments",
      type: "Lease Agreement",
      url: "/documents/lease-sunset-2025.pdf",
    },
    {
      tenantId: tenant1.id,
      name: "Move-in Inspection Report",
      type: "Inspection",
      url: "/documents/inspection-sunset-movein.pdf",
    },
    {
      tenantId: tenant1.id,
      name: "January 2025 Rent Receipt",
      type: "Receipt",
      url: "/documents/receipt-jan-2025.pdf",
    },
    {
      tenantId: tenant2.id,
      name: "Lease Agreement - Riverside Lofts",
      type: "Lease Agreement",
      url: "/documents/lease-riverside-2025.pdf",
    },
    {
      tenantId: tenant2.id,
      name: "Renter's Insurance Policy",
      type: "Insurance",
      url: "/documents/insurance-policy.pdf",
    },
  ]);

  console.log("✓ Created 5 documents");

  console.log("\n🎉 Database seeding completed successfully!");
  console.log("\nTest accounts (all passwords: password123):");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Landlord: landlord / password123");
  console.log("  - Manages 3 properties");
  console.log("  - Has 2 active leases");
  console.log("");
  console.log("Tenant 1: tenant1 / password123");
  console.log("  - Rents Sunset Apartments");
  console.log("  - Autopay enabled");
  console.log("  - Has 2 maintenance requests");
  console.log("");
  console.log("Tenant 2: tenant2 / password123");
  console.log("  - Rents Riverside Lofts");
  console.log("  - Has overdue payment");
  console.log("  - Has 2 maintenance requests");
  console.log("");
  console.log("Admin: admin / password123");
  console.log("  - Enterprise dashboard access");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  await pool.end();
}

main().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
