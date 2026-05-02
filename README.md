# Hargeisa Events Pro

Technical documentation for the current Hargeisa Events Pro MVP.

This repository implements a MERN-style event booking platform with:

- a Next.js frontend in `client/`
- an Express + MongoDB API in `server/`

The current deployment topology is:

- frontend on Vercel
- backend API on Render
- database on MongoDB

## Table of Contents

- [Project Summary](#project-summary)
- [System Topology](#system-topology)
- [Repository Layout](#repository-layout)
- [Technology Stack](#technology-stack)
- [Functional Scope](#functional-scope)
- [Architecture](#architecture)
- [Authentication and Authorization](#authentication-and-authorization)
- [Data Model](#data-model)
- [API Reference](#api-reference)
- [Local Development Setup](#local-development-setup)
- [Seed Data](#seed-data)
- [Deployment Notes](#deployment-notes)
- [Current Limitations and Risks](#current-limitations-and-risks)
- [Recommended Next Steps](#recommended-next-steps)

## Project Summary

Hargeisa Events Pro is an MVP for managing:

- venues
- booking requests
- vendor listings
- payment records
- role-based dashboard access

The application supports three user roles:

- `admin`
- `manager`
- `customer`

Core workflow:

1. A user authenticates through the frontend.
2. NextAuth delegates credential verification to the backend REST API.
3. The backend issues a JWT.
4. The frontend stores that JWT inside the NextAuth session.
5. Authenticated requests to the API send the JWT as a Bearer token.
6. The backend enforces resource access by role and, for customer bookings, by record ownership.

## System Topology

```text
+---------------------+        HTTPS         +------------------------+
|  Next.js Frontend   |  ----------------->  |  Express REST API      |
|  client/            |                      |  server/               |
|  NextAuth session   |  <-----------------  |  JWT auth              |
+---------------------+                      +-----------+------------+
                                                        |
                                                        | Mongoose
                                                        v
                                              +------------------------+
                                              |  MongoDB               |
                                              |  Users / Venues /      |
                                              |  Vendors / Bookings /  |
                                              |  Payments              |
                                              +------------------------+
```

## Repository Layout

```text
.
├── client/
│   ├── src/app/                  # Next.js App Router pages and layouts
│   ├── src/app/api/auth/         # NextAuth route handler
│   ├── src/components/           # Feature components and local UI system
│   ├── src/components/ui/        # shadcn-style UI primitives
│   ├── src/lib/                  # API client, auth config, shared types/utilities
│   └── src/middleware.ts         # NextAuth route protection for /dashboard/*
└── server/
    ├── index.ts                  # Express app bootstrap
    ├── src/config/               # Database connection
    ├── src/controllers/          # REST handlers
    ├── src/lib/                  # API response/error helpers
    ├── src/middlewares/          # Auth and error middleware
    ├── src/models/               # Mongoose schemas
    ├── src/routes/               # Express routers
    └── seeder.ts                 # Seed/import and destroy script
```

## Technology Stack

### Frontend

- Next.js `16.2.4`
- React `19`
- TypeScript
- NextAuth `4`
- Axios
- Tailwind CSS `4`
- `react-hook-form`
- `zod`
- `class-variance-authority`
- `tailwind-merge`
- `lucide-react`
- shadcn configuration with local components
- `@base-ui/react` primitives for several UI controls

### Backend

- Node.js
- Express `5`
- TypeScript
- MongoDB
- Mongoose `9`
- `jsonwebtoken`
- `bcryptjs`
- `dotenv`
- `morgan`
- `helmet`
- `compression`
- `express-rate-limit`

### Active Runtime Protections

The backend now enforces the following production-grade middlewares:

- `helmet`: Secure HTTP headers
- `compression`: Payload optimization
- `express-rate-limit`: Brute-force and DoS protection
- `ApiResponse` / `ApiError`: Standardized response shapes

## Functional Scope

### Implemented

- credential-based authentication with NextAuth + JWT
- JWT-backed session propagation from backend to frontend
- protected dashboard routes with middleware
- venue listing, creation, and detailed view
- booking creation (authenticated or anonymous)
- booking status updates with role-based permissions
- **payment automation** - auto-generates payment ledger entry when booking status changes to "confirmed"
- customer booking self-service view (scoped by user ID)
- booking feedback and rating submission
- vendor directory listing, creation, and detailed view
- vendor data persistence for `contactPerson` and `description`
- payment record listing and creation
- **standardized API responses** - Most controllers use `ApiResponse`/`ApiError` utilities (payment controller uses legacy format)
- simple calendar view derived from booking dates with real-time updates (15s polling)
- simple reporting view derived from bookings and payments
- CSV export for bookings, payments, calendar, and reports
- role-aware sidebar navigation (6 items for customers, 7 items for staff)
- Dialog-based booking form with success auto-close
- production-grade middlewares (helmet, compression, rate limiting)

### Not Implemented as a First-Class Workflow

- booking cancellation workflow for customers (status enum exists but no UI)
- vendor "Book Service" integration (UI placeholder only, no backend linkage)
- real payment gateway integration (ledger works with mocked transactions)
- per-venue ownership or manager assignment (Planned)
- pagination, filtering, or sorting on list endpoints
- Docker/containerization setup

## Architecture

### Frontend Architecture

The frontend uses the Next.js App Router with a public landing page and a protected dashboard section.

#### Public routes

- `/`
- `/login`

#### Protected routes

All routes under `/dashboard/*` are matched by NextAuth middleware in `client/src/middleware.ts`.

#### Session model

The frontend does not maintain its own user database or JWT issuer. Instead:

- NextAuth `CredentialsProvider` posts user credentials to the backend login endpoint
- the backend returns `{ user, token }`
- the token is stored in the NextAuth JWT callback as `accessToken`
- the session callback exposes `session.user.id`, `session.user.role`, and `session.accessToken`

#### API client

`client/src/lib/api.ts` creates a shared Axios instance with:

- `baseURL = NEXT_PUBLIC_API_URL`
- `Content-Type: application/json`
- a request interceptor that fetches the current NextAuth session and injects `Authorization: Bearer <accessToken>`

#### UI system

The local UI layer is organized under `client/src/components/ui/`.

Characteristics:

- shadcn-style component layout and aliases from `client/components.json`
- utility-first styling with Tailwind classes
- several primitives implemented with `@base-ui/react`
- form composition through `react-hook-form` wrappers
- visual tokens defined in `client/src/app/globals.css`

#### Role-aware UI behavior

Role-based navigation and page behavior are mostly client-driven:

- customers get a reduced sidebar
- customers are redirected away from staff-oriented pages such as bookings, vendors, and reports
- staff users can access create forms for venues and vendors

Important: page-level role restrictions in the frontend are largely implemented with client redirects, not server-rendered authorization boundaries.

### Backend Architecture

The backend is a single Express application mounted under `/api`.

Bootstrap pipeline:

1. load environment variables with `dotenv`
2. connect to MongoDB through Mongoose
3. register `cors()`
4. register `express.json()`
5. register `morgan("dev")`
6. mount feature routers
7. register the custom error handler

#### Route modules

- `auth.routes.ts`
- `venue.routes.ts`
- `booking.routes.ts`
- `vendor.routes.ts`
- `payment.routes.ts`

#### Controller design

Contollers are thin and operate directly on Mongoose models. There is no service layer, policy layer, or domain abstraction between routes and persistence.

Response shape is **mostly standardized** across the API:

- Most controllers use `ApiResponse` and `ApiError` utilities for consistent frontend consumption
- **Exception**: Payment controller uses legacy `{ success, data }` format instead of `ApiResponse` class (frontend handles both formats correctly)

### Data Access Pattern

The application uses direct model queries inside controllers:

- `find`
- `findById`
- `findByIdAndUpdate`
- `create`
- `insertMany`
- `populate`

Derived views such as reports and calendar are computed in the frontend after fetching raw resources from the API.

## Authentication and Authorization

### Authentication Flow

1. User submits email and password on `/login`.
2. NextAuth `CredentialsProvider` calls `POST ${NEXT_PUBLIC_API_URL}/auth/login`.
3. The backend verifies the email/password combination against MongoDB.
4. On success, the backend issues a JWT signed with `JWT_SECRET`.
5. NextAuth stores that token inside its own JWT/session state.
6. Axios reads `session.accessToken` and forwards it to the backend for authenticated API requests.

### Backend Authorization

The backend exposes three auth middlewares/patterns:

- `protect`
  - requires a valid Bearer token
  - verifies the JWT
  - loads the user document into `req.user`

- `optionalProtect`
  - tries to resolve `req.user` if a token exists
  - allows unauthenticated execution if no token exists

- `authorizeRoles(...roles)`
  - enforces role membership on already-authenticated users

### RBAC Matrix

| Capability                     | Admin | Manager | Customer                           | Anonymous   |
| ------------------------------ | ----- | ------- | ---------------------------------- | ----------- |
| Register account               | Yes   | Yes     | Yes (Forced)                       | Yes         |
| Login                          | Yes   | Yes     | Yes                                | Yes         |
| View venues                    | Yes   | Yes     | Yes                                | Yes         |
| Create venue                   | Yes   | Yes     | No                                 | No          |
| View bookings                  | All   | All     | Own only                           | No          |
| Create booking                 | Yes   | Yes     | Yes                                | Yes         |
| Update booking status          | Yes   | Yes     | No                                 | No          |
| Submit booking rating/feedback | Yes   | Yes     | Own only                           | No          |
| View vendors                   | Yes   | Yes     | Yes, but redirected away from page | Yes via API |
| Create vendor                  | Yes   | Yes     | No                                 | No          |
| View payments                  | All   | All     | Own only                           | No          |
| Create payment                 | Yes   | Yes     | No                                 | No          |
| View reports page              | Yes   | Yes     | No                                 | No          |

Notes:

- `manager` and `admin` currently behave the same in the API.
- customer access to staff pages is primarily prevented in the frontend through client redirects.
- anonymous booking creation is explicitly supported through `optionalProtect`.

## Data Model

### Entity Relationship Overview

```text
User 1 --- * Booking * --- 1 Venue
Booking 1 --- * Payment
Vendor (standalone)
```

### Collections

### User

Collection: `users`

Fields:

- `name: string`
- `email: string` unique, lowercased
- `password: string` excluded from default query selection
- `role: "admin" | "manager" | "customer"`
- timestamps

Behavior:

- password hashing via Mongoose pre-save hook
- password comparison via instance method using bcrypt

### Venue

Collection: `venues`

Fields:

- `name: string`
- `type: "hotel" | "hall"`
- `address: string`
- `capacity: number`
- `pricePerDay: number`
- `amenities: string[]`
- `imageUrl: string`
- `contactPhone: string`
- `description?: string`
- timestamps

Behavior:

- no ownership field
- no manager/user reference
- no dedicated availability table

### Vendor

Collection: `vendors`

Fields:

- `name: string`
- `type: string`
- `rating: number`
- `projects: number`
- `status: "available" | "busy"`
- `contactEmail: string`
- `contactPhone: string`
- `contactPerson: string`
- `description: string`
- timestamps

Behavior:

- standalone directory model
- no relation to `Booking`, `Venue`, or `User`

### Booking

Collection: `bookings`

Fields:

- `user?: ObjectId -> User`
- `venue: ObjectId -> Venue`
- `clientName: string`
- `clientPhone: string`
- `eventType: string`
- `eventDate: Date`
- `guestCount: number`
- `status: "confirmed" | "pending" | "cancelled" | "rejected"`
- `notes?: string`
- `rating?: number`
- `feedback?: string`
- timestamps

Behavior:

- can be anonymous or linked to an authenticated customer
- venue is populated for listing views
- customer reads are ownership-scoped
- customer updates are limited to rating/feedback
- staff updates can modify status, rating, and feedback

### Payment

Collection: `payments`

Fields:

- `transactionId: string` unique
- `bookingId: ObjectId -> Booking`
- `clientName: string`
- `venueName: string`
- `amount: number`
- `type: "Full Payment" | "Deposit (50%)"`
- `status: "paid" | "pending" | "failed"`
- `paymentDate: Date`
- timestamps

Behavior:

- denormalizes `clientName` and `venueName`
- customer visibility is filtered by `bookingId.user`

## API Reference

Base URL:

```text
http://localhost:5000/api
```

In production, `NEXT_PUBLIC_API_URL` should point to the deployed Render API with the `/api` suffix included.

## Auth

### `POST /auth/register`

Registers a new user and returns:

- user summary
- JWT

Request body:

```json
{
  "name": "Example User",
  "email": "user@example.com",
  "password": "password123",
  "role": "customer"
}
```

### `POST /auth/login`

Authenticates a user and returns:

- user summary
- JWT

## Venues

### `GET /venues`

Public. Returns all venues.

### `POST /venues`

Protected. Roles allowed:

- `admin`
- `manager`

### `GET /venues/:id`

Public. Returns a single venue.

## Bookings

### `GET /bookings`

Protected.

Behavior:

- `admin` and `manager` receive all bookings
- `customer` receives only bookings where `booking.user === req.user._id`

### `POST /bookings`

Public or authenticated.

Behavior:

- validates required fields
- if `req.user` exists, attaches `user`
- otherwise creates an anonymous booking

### `PATCH /bookings/:id`

Protected.

Behavior:

- `customer`
  - may update only own bookings
  - may not change `status`
  - may submit `rating` and `feedback`
- `admin` and `manager`
  - may change `status`
  - may also set `rating` and `feedback`
  - **automation**: When status changes from "pending" → "confirmed", a payment record is **auto-generated** with:
    - `transactionId`: `TXN-{timestamp}`
    - `type`: "Deposit (50%)"
    - `status`: "paid"
    - `amount`: 500 (mocked deposit)

## Vendors

### `GET /vendors`

Public.

### `POST /vendors`

Protected. Roles allowed:

- `admin`
- `manager`

## Payments

### `GET /payments`

Protected.

Behavior:

- `admin` and `manager` receive all payments
- `customer` receives only payments whose populated booking owner matches the current user

### `POST /payments`

Protected. Roles allowed:

- `admin`
- `manager`

## Local Development Setup

### Prerequisites

- Node.js 20+
- npm 10+
- MongoDB instance

This repository does not include a root `package.json`. The frontend and backend are installed and run independently.

### Cloning the repository

```bash
git clone https://github.com/sirrryasir/hargeisa-events-pro.git
cd hargeisa-events-pro
```

### 1. Install Dependencies

### Frontend

```bash
cd client
npm install
```

### Backend

```bash
cd server
npm install
```

### 2. Configure Environment Variables

### Backend: `server/.env`

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hargeisa-events-pro
JWT_SECRET=replace-with-a-secure-random-secret
NODE_ENV=development
```

### Frontend: `client/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXTAUTH_SECRET=replace-with-a-secure-random-secret
NEXTAUTH_URL=http://localhost:3000
```

Notes:

- `NEXT_PUBLIC_API_URL` must include `/api`
- `NEXTAUTH_URL` is required for reliable deployed NextAuth behavior
- the code contains fallback secrets for development, but production must always define explicit secrets

### 3. Start the Backend

```bash
cd server
npm run dev
```

Server default URL:

```text
http://localhost:5000
```

API base:

```text
http://localhost:5000/api
```

### 4. Start the Frontend

In a second terminal:

```bash
cd client
npm run dev
```

Frontend URL:

```text
http://localhost:3000
```

## Seed Data

The backend includes a seed script.

### Import sample data

```bash
cd server
npm run data:import
```

### Destroy seeded data

```bash
cd server
npm run data:destroy
```

## Seeded Accounts

| Role     | Email                  | Password      |
| -------- | ---------------------- | ------------- |
| Admin    | `admin@example.com`    | `password123` |
| Manager  | `manager@example.com`  | `password123` |
| Customer | `customer@example.com` | `password123` |

## Seeded Domain Records

The seeder currently creates:

- 3 users (admin, manager, customer)
- 4 venues (Ambassador Hotel, Mansoor Hotel, Oriental Hall, Rays Hotel)
- 4 vendors (Golden Decor, Elite Catering, Hargeisa Sounds, Somaliland Lens)
- 2 bookings (1 confirmed, 1 pending)
- 2 payments (1 Full Payment, 1 Deposit 50%)

## Deployment Notes

### Current Topology

- frontend: Vercel
- backend: Render
- database: MongoDB

### Required Production Environment Variables

### Vercel frontend

```env
NEXT_PUBLIC_API_URL=https://your-render-api.example.com/api
NEXTAUTH_SECRET=replace-with-a-secure-random-secret
NEXTAUTH_URL=https://your-vercel-app.example.com
```

### Render backend

```env
PORT=10000
MONGO_URI=your-production-mongodb-uri
JWT_SECRET=replace-with-a-secure-random-secret
NODE_ENV=production
```

### Operational Notes

- the repo contains no deployment manifests, Dockerfiles, or IaC
- CORS is currently open by default and should be restricted in production
- health checking currently relies on `GET /`
- the frontend `next/image` configuration accepts remote images from any host

## Current Limitations and Risks

The following items reflect the current codebase, not an idealized target state.

- fallback secrets are hardcoded in both frontend and backend auth configuration (acceptable for MVP demo)
- page-level staff restrictions in the frontend are mostly client redirects (server enforces via JWT)
- `next/image` remote patterns allow any `http` or `https` host (restrict in production)

- `Venue` has no `createdBy`, `owner`, or `managerId` (planned feature)
- `Vendor` is a standalone directory entry with no direct booking relationship
- `Payment` denormalizes `clientName` and `venueName` for simpler queries
- no dedicated availability model exists beyond interpreting booking dates

- backend request validation uses minimal inline checks (recommend migrating to `zod` for all endpoints)
- no pagination, filtering, or sorting on list endpoints (all data returned at once)
- no versioned API namespace beyond `/api`

- vendor "Book Service" button is a UI placeholder with `alert()` only (no backend integration)
- payment automation works (auto-creates on confirmation), but no real payment gateway (Stripe/PayPal) integration
- booking status enum includes `cancelled`, but the staff UI dropdown only exposes `pending`, `confirmed`, and `rejected`
- settings and support pages are mostly presentational (demo-ready static content)

## Recommended Next Steps

1. **Advanced Validation**: Implement server-side request validation with `zod` for all write endpoints to harden the application further.
2. **API Standardization**: Migrate payment controller to use `ApiResponse`/`ApiError` utilities for consistency with other controllers.
3. **Entity Ownership**: Add ownership metadata to venues (`ownerId`/`managerId`) and formal relationships for vendor service requests.
4. **Operational Completeness**: Add full CRUD completeness (Update/Delete) for venues, vendors, and payments.
5. **Performance**: Add pagination and query filters (search/sort) for all list endpoints.
6. **Workflow Automation**: Replace placeholder vendor "Book Service" UI with persisted service requests and linked payments.
7. **Financial Integration**: Transition from mocked payments to a sandbox environment for a real gateway (e.g., Stripe/PayPal).
8. **Containerization**: Add Docker/containerization setup for easier deployment and development.
9. **Production Observability**: Implement structured logging (Winston/Bunyan) and health check monitoring.
10. **Customer Self-Service**: Implement booking cancellation workflow for customers.

## Canonical Documentation Note

This root `README.md` is the canonical project document. The package-level READMEs inside `client/` and `server/` are intentionally minimal entry points that link back here.
