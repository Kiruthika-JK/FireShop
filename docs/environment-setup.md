# Environment Configuration Guide

## 📁 File Structure

```
.env                # ✅ COMMITTED - Production config (shared with team)
.env.staging        # ✅ COMMITTED - Staging config (for future use)
.env.example        # ✅ COMMITTED - Template for new developers
.env.local          # ❌ GITIGNORED - Local overrides & server secrets
```

## 🔄 Environment Priority (Next.js)

Next.js loads environment variables in this order (later overrides earlier):
1. `.env` - Default (all environments)
2. `.env.local` - Local overrides (gitignored)
3. `.env.production` / `.env.development` - Environment-specific

## 🚀 Setup for New Developers

1. **Clone the repo** - `.env` is already there!
2. **(Optional)** Create `.env.local` for personal overrides:
   ```bash
   cp .env.example .env.local
   ```
3. **Run the app**:
   ```bash
   npm install
   npm run dev
   ```

## 🔐 Security Model

### ✅ Safe to Commit (Public Keys)
- `NEXT_PUBLIC_*` variables (embedded in client-side bundle)
- Firebase client SDK keys (secured via Firebase Security Rules)
- Public API endpoints

### ❌ Never Commit (Secrets)
- Firebase Admin SDK private keys
- Payment processor secrets (Stripe, PayPal)
- Database credentials
- OAuth client secrets
- API keys with write permissions

## 📝 Adding New Variables

### Client-Side Variables (Public)
```bash
# .env
NEXT_PUBLIC_FEATURE_FLAG=enabled
```

### Server-Only Secrets (Private)
```bash
# .env.local (gitignored)
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
STRIPE_SECRET_KEY=sk_live_xxxxx
```

## 🌍 Deployment Environments

### Production (Current)
- **File**: `.env`
- **Vercel**: Environment variables synced from `.env`
- **Build**: `npm run build`

### Staging (Future)
1. Create new Firebase project
2. Update `.env.staging` with staging credentials
3. Deploy with staging config:
   ```bash
   # Vercel
   vercel --env staging
   
   # Or load staging env
   cp .env.staging .env.local
   npm run build
   ```

## 🧪 Testing Locally

```bash
# Use production config (default)
npm run dev

# Test with staging config
cp .env.staging .env.local
npm run dev

# Override specific variables
echo "NEXT_PUBLIC_APP_ENV=development" >> .env.local
npm run dev
```

## 🔍 Validation

The app validates required variables at startup:
- See `lib/config.ts` for validation logic
- Missing variables will throw an error with clear message

## 📚 References

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Firebase Security Best Practices](https://firebase.google.com/docs/rules)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
