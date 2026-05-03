# Hargeisa Events Pro

### THE PREMIER EVENT MANAGEMENT ECOSYSTEM FOR SOMALILAND

---

## Executive Summary
**Hargeisa Events Pro** is a hardened, production-grade event management platform designed to modernize the event planning industry in Somaliland. Built with a "Security-First" and "Aesthetic-Rich" approach, the platform facilitates a seamless connection between venues, vendors, and customers through real-time communication and robust business logic.

### Key Innovations
- **Intelligent Availability Engine**: Prevents double-bookings with live conflict detection.
- **High-Fidelity UI/UX**: A curated black-and-white professional design system built on React 19.
- **Financial Integrity**: Integrated digital ledger with jsPDF-powered invoice generation.
- **Role-Based Workflows**: Tailored experiences for Admins, Venue Managers, Vendors, and Customers.
- **Real-Time Synergy**: Socket-driven notifications for status updates and booking approvals.

---

## Technology Stack

### Frontend Architecture
- **Framework**: Next.js 16 (App Router / Turbopack)
- **Library**: React 19 (Advanced Hooks & Concurrent Rendering)
- **State Management**: React Hook Form + Zod Schema Validation
- **Auth**: NextAuth.js (JWT-based persistent sessions)
- **Styling**: Tailwind CSS 4 + Shadcn UI (Custom Dark/Light Tokens)
- **Documentation**: jsPDF + autoTable (Client-side PDF generation)

### Backend Architecture
- **Framework**: Express 5 (Next-Gen RESTful API)
- **Language**: TypeScript (Type-safe business logic)
- **Database**: MongoDB Atlas + Mongoose 9 (Optimized Schemas)
- **Security**: JWT Authentication, BcryptJS Hashing, Helmet.js Protection
- **Communication**: Socket.io (Real-time Event Emitters)
- **Mail Engine**: Nodemailer (Professional Email Simulation)

---

## Functional Ecosystem

| Feature | Description | Status |
| :--- | :--- | :--- |
| **Venue Discovery** | Multi-image galleries with high-resolution visual showcases. | ✅ Complete |
| **Booking Engine** | Date-picker logic that blocks occupied dates in real-time. | ✅ Complete |
| **Customer Portal** | Self-service management for cancellations, tracking, and reviews. | ✅ Complete |
| **Manager Dashboard** | Comprehensive control over bookings, status updates, and venue assets. | ✅ Complete |
| **Financial Ledger** | Automated payment tracking and PDF receipt generation. | ✅ Complete |
| **Notifications** | Live in-app alerts for all system activities. | ✅ Complete |

---

## Installation & Deployment

### 1. Repository Setup
```bash
git clone https://github.com/sirrryasir/hargeisa-events-pro.git
cd hargeisa-events-pro
```

### 2. Dependency Installation
```bash
# Server Setup
cd server && npm install

# Client Setup
cd ../client && npm install
```

### 3. Environment Configuration
Ensure `.env` files are created in both `/server` and `/client` directories with your MongoDB URI and JWT secrets.

### 4. Running the Ecosystem
```bash
# Terminal 1 (Server)
cd server && npm run dev

# Terminal 2 (Client)
cd client && npm run dev
```

---

## Demo & Testing
The system includes a **Rich Seeder** to populate the platform with data for your defense.

```bash
cd server
npm run data:import
```

### Graduation Defense Accounts
All accounts use the password: `password123`

| Category | Name | Email | Role |
| :--- | :--- | :--- | :--- |
| **System** | Admin User | `admin@example.com` | Administrator |
| **Team (Students)** | Huda Ali Muhumed | `huda@example.com` | Customer |
| **Team (Students)** | Muna Siciid aw Nuur | `muna@example.com` | Customer |
| **Team (Students)** | Habi Ali Muhumed | `habi@example.com` | Customer |
| **Managers** | Ambassador Manager | `manager@example.com` | Venue Manager |
| **Managers** | Mansoor Manager | `mansoor@example.com` | Venue Manager |
| **Managers** | Royal Palace Manager | `royal@example.com` | Venue Manager |
| **Managers** | Guryasamo Manager | `guryasamo@example.com` | Venue Manager |
| **Managers** | Maedah Manager | `maedah@example.com` | Venue Manager |
| **Vendors** | Golden Decor | `golden@example.com` | Vendor |
| **Vendors** | Elite Catering | `elite@example.com` | Vendor |
| **Vendors** | Hargeisa Sounds | `sounds@example.com` | Vendor |
| **Vendors** | Somaliland Lens | `lens@example.com` | Vendor |
| **Vendors** | Shield Security | `shield@example.com` | Vendor |

---

## Graduation Defense Note
This platform has been engineered to meet the highest technical standards of a **University Graduation Project**. It demonstrates proficiency in full-stack architecture, asynchronous state management, secure authentication, and complex relational data modeling. It is intentionally designed to be "Bug-Free" and "Hydration-Stable" for a flawless live demonstration.
