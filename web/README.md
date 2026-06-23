# BEYONDTEE Apparel Platform

A Next-generation, premium e-commerce website with a real-time **3D Customization Engine**.

## 🌟 Key Features

*   **3D Engine**: Built with Three.js/React-Three-Fiber. Support for Rotation, Zoom, and Custom Decals (`.glb` support enabled).
*   **Customization**: Real-time decal layering system with custom `shirt.glb` support.
*   **E-commerce**: Product Grid, Persistent Cart, Checkout with Payment Intent API.
*   **Admin Panel**: Secure workspace (`/admin`) for order management.
*   **Tech Stack**: Next.js 14, MongoDB, Tailwind (via utility classes), Zustand (State), NextAuth.js.

## 🚀 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create `.env.local` in the root:
    ```env
    MONGODB_URI=mongodb://localhost:27017/beyondtee
    NEXTAUTH_SECRET=your_super_secret_key
    NEXTAUTH_URL=http://localhost:3000
    ADMIN_USER=admin
    ADMIN_PASS=admin123
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## 🐳 Docker Deployment

To self-host on a custom domain (VPS/DigitalOcean):

1.  **Build & Run**:
    ```bash
    docker-compose up --build -d
    ```

2.  **Ports**:
    - App: `3000`
    - DB: `27017`

## 📁 Project Structure

*   `src/components/canvas`: 3D Scene, Models, Lighting.
*   `src/lib/store`: Zustand stores (`customizationStore`, `cartStore`).
*   `src/app/api`: Backend API routes (`products`, `orders`, `auth`).

---
Built by Antigravity Agent.
