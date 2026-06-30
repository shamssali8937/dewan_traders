# 🌍 Dewan Traders — Management System

> **Sargodha, Punjab, Pakistan** | Import & Export | Fruits · Vegetables · Surgical Items · Sports Items

A production-ready full-stack website and management system for Dewan Traders.

---

## ✨ Features

### Public Website
- 🏠 **Home** — Hero, category showcase, featured products, export reach, testimonials
- 🏢 **About** — Company timeline, mission, values, leadership team
- 📦 **Catalog** — Browse all products with search, category filter, pagination
- ⚙️ **Services** — Sourcing, documentation, logistics, QA, market intelligence
- 🏭 **Industries** — Retail, healthcare, sports, government, HORECA
- 📰 **Journal** — Blog/news with article detail pages
- 📩 **Contact** — Inquiry form with validation

### Admin Panel (`/admin`)
- 📊 Dashboard with live statistics
- 📦 Products management (CRUD, search, filter)
- 🛒 Orders management (inline status update)
- 📩 Inquiries management (master-detail, status, admin notes)
- 📰 Journal/Blog management
- 🎨 CMS for all public pages (Home, About, Services, Industries)
- ⭐ Testimonials management
- 📞 Contact info management

### User Module
- 👤 Individual & Company registration
- 📋 Place orders from the catalog
- 📦 Track order history & status

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| UI Components | Radix UI primitives, custom glassmorphism |
| State | Zustand (client), TanStack Query (server) |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion |
| HTTP | Axios with interceptors + token refresh |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL (Supabase) + Prisma ORM |
| Auth | JWT (access + refresh tokens), bcrypt |
| Security | Helmet, CORS, Rate Limiting, express-validator |
| Logging | Winston + Morgan |

---

## 📁 Project Structure

```
dewan-traders/
├── frontend/           # Next.js 15 App Router
│   └── src/
│       ├── app/
│       │   ├── (public)/   # Home, About, Catalog, Services, Industries, Journal, Contact
│       │   ├── admin/      # Admin panel
│       │   ├── auth/       # Login, Register
│       │   └── user/       # User orders
│       ├── components/
│       │   └── layout/     # Navbar, Footer
│       ├── hooks/          # React Query hooks
│       ├── lib/            # Axios, QueryProvider, utils
│       ├── services/       # API endpoints
│       └── store/          # Zustand stores
│
└── backend/            # Express.js API
    └── src/
        ├── config/         # DB, env config
        ├── controllers/    # HTTP handlers
        ├── middlewares/    # Auth, error handling
        ├── prisma/         # Schema, seed
        ├── routes/         # API routes
        ├── services/       # Business logic
        └── utils/          # ApiResponse, ApiError, asyncHandler
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (`npm install -g pnpm`)
- PostgreSQL database (Supabase recommended)

### 1. Clone & Setup

```bash
git clone <repo-url>
cd dewan-traders
```

### 2. Backend Setup

```bash
cd backend

# Copy env template
cp .env.example .env

# Edit .env with your Supabase credentials:
# DATABASE_URL="postgresql://..."
# DIRECT_URL="postgresql://..."
```

```bash
# Install dependencies (already done if following along)
npm install

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database (admin + sample products)
npm run prisma:seed

# Start dev server
npm run dev
# → http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install

# Start dev server
pnpm dev
# → http://localhost:3000
```

---

## 🔑 Environment Variables

### Backend (`.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `DATABASE_URL` | Supabase PostgreSQL connection string (pooled) |
| `DIRECT_URL` | Supabase direct connection string |
| `JWT_SECRET` | JWT access token secret |
| `JWT_EXPIRES` | Access token expiry (e.g. `15m`) |
| `REFRESH_SECRET` | Refresh token secret |
| `REFRESH_EXPIRES` | Refresh token expiry (e.g. `7d`) |
| `FRONTEND_URL` | CORS allowed origin |

### Frontend (`.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API URL |
| `NEXT_PUBLIC_SITE_NAME` | Site name for SEO |

---

## 📡 API Reference

### Base URL
```
http://localhost:5000/api
```

### Health Check
```
GET /api/health
```

### Authentication
| Method | Endpoint | Access |
|---|---|---|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| POST | `/auth/logout` | Protected |
| POST | `/auth/refresh` | Public |
| GET | `/auth/me` | Protected |

### Products
| Method | Endpoint | Access |
|---|---|---|
| GET | `/products?page=1&limit=12&category=fruits&search=kinnow` | Public |
| GET | `/products/featured` | Public |
| GET | `/products/:slug` | Public |
| POST | `/products` | Admin/Manager |
| PUT | `/products/:id` | Admin/Manager |
| DELETE | `/products/:id` | Admin |

### Orders
| Method | Endpoint | Access |
|---|---|---|
| POST | `/orders` | User |
| GET | `/orders/my-orders` | User |
| GET | `/orders/:id` | User/Admin |
| GET | `/orders` | Admin |
| PATCH | `/orders/:id/status` | Admin |

### Inquiries
| Method | Endpoint | Access |
|---|---|---|
| POST | `/inquiries` | Public |
| GET | `/inquiries` | Admin |
| PATCH | `/inquiries/:id/status` | Admin |
| DELETE | `/inquiries/:id` | Admin |

### API Response Format

**Success:**
```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": []
}
```

---

## 👤 Default Admin Account

After running `npm run prisma:seed`:

```
Email:    admin@dewantraders.com
Password: Admin@123
```

**⚠️ Change this password immediately in production!**

---

## 🚢 Deployment

### Frontend → Vercel
```bash
pnpm build
# Deploy to Vercel
```
Set `NEXT_PUBLIC_API_URL` to your production backend URL.

### Backend → Render / Railway
```bash
npm run build
# Start: node dist/server.js
```
Set all environment variables in your host's dashboard.

### Database → Supabase
1. Create project at [supabase.com](https://supabase.com)
2. Go to Settings → Database → Connection string
3. Copy `Transaction` mode for `DATABASE_URL`
4. Copy `Session` mode for `DIRECT_URL`
5. Run `npm run prisma:migrate`

---

## 📦 Product Categories

| Category | Examples |
|---|---|
| 🍊 Fruits | Kinnow Mandarin, Mango Chaunsa, Blood Orange, Guava |
| 🥦 Vegetables | Onion, Potato, Tomato, Garlic |
| 🔬 Surgical | Scissors Set, Forceps, Surgical Knives |
| 🏏 Sports | Cricket Bat, Football, Hockey Stick |

---

## 📞 Contact

**Dewan Traders**
Satellite Town, Sargodha, Punjab, Pakistan
📞 +92-48-3700000
📧 info@dewantraders.com

---

*Built with ❤️ for Dewan Traders — Exporting Pakistan's Best to the World*
