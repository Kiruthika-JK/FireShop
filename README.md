# FireShop 🛒

E-commerce platform built with Next.js, Firebase, and TypeScript.

## 🚀 Quick Start for Developers

### Prerequisites
- Node.js 20+ and npm
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd FireShop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment is ready!**
   - `.env` is already committed with production Firebase config
   - No manual setup needed - just run the app

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

### Optional: Local Environment Overrides

If you need to override settings locally:
```bash
cp .env.example .env.local
# Edit .env.local with your personal settings
```

## 📁 Environment Configuration

```
.env            ✅ Committed - Production config (team-shared)
.env.staging    ✅ Committed - Staging config (future)
.env.example    ✅ Committed - Template
.env.local      ❌ Gitignored - Local overrides & secrets
```

**Why is `.env` committed?**
- Firebase client keys are **public by design** (secured via Firebase Security Rules)
- Enables zero-setup for new team members
- Private repo = safe to share configuration

📖 **Full details:** See [docs/environment-setup.md](docs/environment-setup.md)

## 🛠️ Available Scripts

```bash
npm run dev              # Start development server
npm run dev:staging      # Start with staging config
npm run build            # Build for production
npm run build:staging    # Build with staging config
npm run start            # Start production server
npm run lint             # Run ESLint
```

## 🏗️ Project Structure

```
app/                    # Next.js App Router pages
components/             # Reusable React components
lib/                    # Utilities, config, features
  ├── config.ts         # Centralized configuration
  ├── firebase.ts       # Firebase initialization
  └── features/         # Feature-based architecture
      ├── cart/         # Cart management (Zustand)
      └── product/      # Product domain logic
docs/                   # Documentation
public/                 # Static assets
```

## 🔐 Security

- **Client-side keys**: Exposed to browser (normal for Firebase)
- **Security enforced by**: Firebase Security Rules & App Check
- **Server secrets**: Store in `.env.local` (gitignored) without `NEXT_PUBLIC_` prefix

## 📚 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Firebase (Auth, Firestore)
- **State Management**: Zustand
- **UI Components**: Radix UI + shadcn/ui

## 🌍 Deployment

### Vercel (Recommended)
1. Import project to Vercel
2. Environment variables auto-detected from `.env`
3. Deploy!

### Other Platforms
Set environment variables from `.env` in your platform's dashboard.

## 📖 Documentation

- [Environment Setup Guide](docs/environment-setup.md)
- [Android vs Next.js Comparison](docs/android_vs_nexjs.md)
- [Tech Stack Decisions](docs/ecommerce_tech_stack.md)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test locally with `npm run dev`
4. Submit a PR

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
