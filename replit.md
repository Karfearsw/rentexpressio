# IKON Property Management Platform

## Overview

IKON is a full-stack, subscription-ready Tenant & Property Management SaaS platform. It provides three distinct portals:

1. **Landlord Portal** - Property listings, tenant screening, lease management, rent collection, and maintenance oversight
2. **Tenant Portal** - Rent payments, maintenance requests, document access, and profile management
3. **Admin Console** - User management, compliance monitoring, and system configuration

The platform implements end-to-end property management workflows: listing → syndication → applications & screening → lease & e-sign → rent collection → maintenance → reporting.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack Query for server state, React Context for auth
- **UI Components**: shadcn/ui built on Radix UI primitives
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Build Tool**: Vite with custom plugins for meta images and development tools

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **Authentication**: Passport.js with local strategy, express-session for session management
- **Password Hashing**: scrypt with random salt
- **API Pattern**: RESTful JSON API under `/api/*` prefix

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Migrations**: Drizzle Kit with `db:push` command
- **Session Store**: connect-pg-simple for production, memorystore for development

### Key Design Patterns
- **Shared Types**: Schema definitions in `/shared` directory are used by both frontend and backend
- **Role-Based Access**: Three user types (tenant, landlord, enterprise) with route-level authorization
- **Protected Routes**: Client-side route protection via `ProtectedRoute` component
- **Storage Abstraction**: `IStorage` interface in `server/storage.ts` allows swapping implementations

### Directory Structure
```
├── client/src/          # React frontend
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks (auth, toast, mobile)
│   ├── lib/             # Utilities, API helpers, validation
│   └── pages/           # Page components (route targets)
├── server/              # Express backend
│   ├── routes.ts        # API route definitions
│   ├── storage.ts       # Database operations
│   └── auth.ts          # Authentication setup
├── shared/              # Shared types and schema
│   └── schema.ts        # Drizzle schema + Zod validation
└── migrations/          # Database migrations
```

## External Dependencies

### Database
- **PostgreSQL** - Primary database via `DATABASE_URL` environment variable
- **Drizzle ORM** - Type-safe database queries and schema management

### UI Framework
- **Radix UI** - Accessible component primitives (dialog, dropdown, tabs, etc.)
- **shadcn/ui** - Pre-built component library (New York style variant)
- **Lucide React** - Icon library

### Authentication & Security
- **Passport.js** - Authentication middleware with local strategy
- **bcryptjs** - Password hashing (backup to native scrypt)
- **express-session** - Session management

### Form Handling & Validation
- **React Hook Form** - Form state management
- **Zod** - Schema validation (shared between client and server via drizzle-zod)

### Fonts
- **Plus Jakarta Sans** - Headings (Google Fonts)
- **Inter** - Body text (Google Fonts)

### Development Tools
- **Vite** - Development server and build tool
- **esbuild** - Server bundling for production
- **TSX** - TypeScript execution for development

### Planned Integrations (Designed as Abstractions)
- **Payment Processing** - Stripe (interface ready, implementation pending)
- **Tenant Screening** - Credit/eviction/employment vendors (mock adapters in place)
- **E-Signature** - DocuSign/Adobe Sign (abstraction layer ready)
- **Listing Syndication** - Zillow, Apartments.com (RESO/ListHub-style feed design)

## Vercel Deployment

The project includes a Vercel-compatible serverless API setup for deployment outside Replit.

### Key Files
- `api/index.ts` - Express app exported as serverless function with JWT authentication
- `vercel.json` - Configuration for routing API and static file requests

### Environment Variables Required for Vercel
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` or `JWT_SECRET` - Secret key for JWT token signing

### Authentication
- **Local Development**: Uses Passport.js with express-session
- **Vercel Deployment**: Uses JWT tokens stored in httpOnly cookies (stateless, serverless-compatible)

### Deployment Steps
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Recent Changes

- **Jan 12, 2026**: Added Charges feature - landlords can schedule tenant charges with automatic email notifications (invoice, reminder, receipt)
- **Jan 12, 2026**: Added Syndication feature - landlords can market properties to external platforms (Zillow, Apartments.com, etc.)
- **Jan 2026**: Added Vercel serverless deployment configuration with JWT authentication
- Fixed Express.User type definitions for proper TypeScript inference
- Updated payment schema usage to use `date` field consistently

## New Features

### Charges Management
- **Database**: `charges` table tracks scheduled charges with notification status
- **API Endpoints**: 
  - `GET /api/charges` - List charges for landlord/tenant
  - `POST /api/charges` - Create new charge
  - `PATCH /api/charges/:id` - Update charge status
  - `DELETE /api/charges/:id` - Delete charge
  - `POST /api/charges/:id/send-notification` - Send email notification (invoice/reminder/receipt)
- **Email Integration**: Uses Resend for transactional emails (requires RESEND_API_KEY environment variable)

### Property Syndication
- **Database**: `property_syndication` table tracks listings on external platforms
- **Supported Platforms**: Zillow, Apartments.com, Trulia, HotPads, Realtor.com, Facebook Marketplace
- **API Endpoints**:
  - `GET /api/syndication` - List syndication status for properties
  - `POST /api/syndication` - Toggle platform syndication
  - `PATCH /api/syndication/:id/sync` - Mark listing as synced

### Environment Variables for Email
- `RESEND_API_KEY` - API key from Resend for sending emails
- `RESEND_FROM_EMAIL` - Sender email address (defaults to noreply@rentexpress.io)