
# Beyondtee - Next-Gen 3D Custom Apparel Platform

Beyondtee is a full-stack e-commerce solution enabling real-time 3D customization of casual wear. Built with Next.js, NestJS, and Three.js.

## 🚀 Key Features

### 🛍️ Shopping & Customization
- **Real-Time 3D Editor**: Rotate, zoom, and decorate 3D models (T-Shirts, Hoodies).
- **Unlimited Layers**: Add Decals, Text, and colors with an intuitive layering system.
- **Smart Filtering**: Browse by Gender, Fit, and Collection via a premium sidebar UI.
- **Cart & Tracking**: Full quantity management and public order tracking.

### 🏢 Admin & Operations
- **Dashboard**: Real-time analytics for Revenue, Orders, and Stock.
- **Marketing**: Create percentage or fixed-amount coupons.
- **Order Management**: View design configurations and customer details.

### 🎨 Tech Stack
- **Frontend**: Next.js 14, TailwindCSS, Framer Motion, Three.js (R3F).
- **Backend**: NestJS, Prisma (SQLite/Postgres), JWT Auth.
- **Database**: SQLite (Dev) / PostgreSQL (Prod).

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### 1. Backend Setup
```bash
cd backend
npm install
npx prisma migrate dev  # Initialize Database
npm run start:dev       # Start API on http://localhost:3001
```

### 2. Frontend Setup
```bash
cd web
npm install
npm run dev             # Start Shop on http://localhost:3000
```

### 3. Usage
- **Admin**: Go to `/auth/signin`. Default Admin credentials managed in `auth.service`.
- **Shop**: Visit `/shop` to browse and customize.

## 📦 Production Build
```bash
# Backend
cd backend && npm run build
npm run start:prod

# Frontend
cd web && npm run build
npm start
```
