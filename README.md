# Lumi – Personalized Beauty, Skincare & Wellness Guidance

Lumi is a modern personalized beauty companion for skincare, haircare, and wellness rituals. It features custom routine curation, interactive habit & water tracking, expert clinical guides, community routines, and a full-featured admin management portal.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Node.js**: v18+ or higher
- **npm** (included with Node.js)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```
Production assets will be built and output to the `/dist` directory.

### 4. Preview the Production Build Locally
```bash
npm run preview
```
Serves the generated `/dist` directory locally to verify before publishing live.

---

## 🌐 How to Make This Site Live (Deploy)

This application is built with Vite and React as a high-performance Single Page Application (SPA). It can be deployed in minutes for free using any of the following platforms:

### Option A: Deploy to Vercel (Recommended)
1. Push this project folder to your GitHub/GitLab account or install the Vercel CLI:
   ```bash
   npm i -g vercel
   vercel
   ```
2. Or connect your repository directly in the [Vercel Dashboard](https://vercel.com):
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. SPA routing is already configured via [`vercel.json`](vercel.json).

### Option B: Deploy to Netlify
1. Log in to [Netlify](https://www.netlify.com).
2. Drag and drop the `dist/` folder directly into the Netlify "Sites" tab for an instant deploy!
3. Or connect your GitHub repository:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Client-side routing redirects are already configured via [`public/_redirects`](public/_redirects).

### Option C: Deploy to Cloudflare Pages
1. Go to **Workers & Pages** in your Cloudflare dashboard.
2. Connect your GitHub repository:
   - **Framework**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`

---

## 🔐 Admin Dashboard Access

Lumi includes an administrative management panel at `/admin` to add and edit products, clinical guides, affirmations, and site banners.

- **URL**: `http://localhost:3000/admin` (or `https://your-domain.com/admin`)
- **Username**: `admin`
- **Password**: `lumie2025`

---

## 🛠️ Tech Stack
- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 + Lucide React
- **Router**: React Router DOM v7 (Route Code Splitting with React.lazy)
- **Charts & Motion**: Recharts + Motion
- **Toasts**: Sonner
- **PWA / Offline**: Service Worker with Push Notification support
