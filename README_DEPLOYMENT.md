# 🚀 SANUSHA Deployment Guide (Render & Vercel)

This repository is pre-configured and cleaned for seamless deployment:
- **Backend**: Render Web Service
- **Frontend**: Vercel (Next.js)
- **Admin Panel**: Vercel (Next.js)

---

## 1. ⚙️ Step 1: Deploy Backend to Render (https://render.com)

1. Create a **New Web Service** on Render and connect your GitHub repository.
2. Configure settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
3. Add Environment Variables in Render Dashboard:
   - `PORT`: `5000` (or Render default)
   - `JWT_SECRET`: `your_secure_random_jwt_secret_key`
   - `DATABASE_URL`: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/sanusha_db?retryWrites=true&w=majority` (MongoDB Atlas Persistent URL)
4. Once deployed, copy your Render Live Backend URL (e.g., `https://sanusha-backend.onrender.com`).

---

## 2. 🛍️ Step 2: Deploy Frontend to Vercel (https://vercel.com)

1. Click **Add New Project** on Vercel and import your GitHub repository.
2. Select the `frontend` folder:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `frontend`
3. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: `https://sanusha-backend.onrender.com/api` (Replace with your actual Render URL)
4. Click **Deploy**. Vercel will build and launch your live storefront!

---

## 3. 👑 Step 3: Deploy Admin Panel to Vercel (https://vercel.com)

1. Click **Add New Project** again on Vercel and import the same GitHub repository.
2. Select the `admin` folder:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `admin`
3. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: `https://sanusha-backend.onrender.com/api` (Replace with your actual Render URL)
4. Click **Deploy**. Vercel will build and launch your live admin operations hub!

---

## 📁 Repository Structure & `.gitignore` Coverage
- `/` — Root with global `.gitignore`
- `/backend` — Express API + Prisma (`.gitignore` excludes `dist/`, `node_modules/`, `.env`)
- `/frontend` — Storefront Next.js App (`.gitignore` excludes `.next/`, `node_modules/`, `.env.local`)
- `/admin` — Admin Dashboard Next.js App (`.gitignore` excludes `.next/`, `node_modules/`, `.env.local`)
