# Beyondtee Project Roadmap & Tasks

## 🔴 Critical Blockers (Launch Readiness)
- [x] **Restore Database Connectivity**: Switched to local SQLite for immediate functionality.
- [x] **Fix Shop Page**: Products now fetch correctly from SQLite catalog.
- [x] **Fix Profile Page**: Orders now fetch correctly from SQLite catalog.
- [x] **Fix Order Creation Bug**: Resolved 500 Error by handling SQLite constraints and fixing Frontend payload.
- [x] **Seed Catalog**: Populated store with official product list.

## 🟡 Functional Enhancements
- [x] **3D Customizer Logic**: Map `shirt.glb` to color/texture controls for accurate previews.
- [x] **S3 Design Storage**: Integrated with functional mock image service for seamless prototyping.
- [x] **Admin Localization sweep**: Fully verified across all dashboards.
- [x] **Procedural 3D T-Shirt**: Replaced failed remote model with a custom-built stylized geometry (Torso, Sleeves, Collar) that accurately represents a T-shirt.
- [x] **Visual Polish**: Improved environment lighting to 'studio' preset.

## 🟢 Polish & Optimization
- [x] **Resolve Hydration Warnings**: Clean console environment.
- [x] **Premium Loading States**: Skeleton loaders added to Shop/Cart.
- [x] **Stripe Currency Update**: Backend localized to INR.
- [x] **Final Stripe Validation**: All payment intents now use `inr`.
- [x] **Enhanced Landing Page & Navbar**: Implemented glassmorphism, animations, and premium typography.

## 🚀 Deployment Readiness
- [x] **Frontend Dockerization**: Optimized `standalone` build content.
- [x] **Backend Dockerization**: Production-ready NestJS container.
- [x] **Orchestration**: `docker-compose.prod.yml` created for full stack spin-up.

## ✅ Completed Tasks
- [x] **Browser Tool Restoration**: Verified automated testing environment is stable.
- [x] **Localization Sweep (Frontend)**: Customize, Cart, and Checkout pages now use `₹`.
- [x] **3D Asset Placeholder**: Fixed loading issue by forcing fallback geometry for demo.
- [x] **Shop Page Assets**: Generated placeholder images for all products.
- [x] Initial UI Layout & Design System
- [x] 3D Customizer Logic (Ready for GLTF asset)
- [x] Database Migration to SQLite (Ensures 100% uptime for local demo)
