# Deployment Guide

This guide covers deploying the Web3 DApp Starter Kit to various platforms.

## 🚀 Quick Deploy

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/web3-dapp-starter)

1. Click the button above or visit [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables (see below)
4. Deploy

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/web3-dapp-starter)

1. Click the button above
2. Connect your GitHub account
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add environment variables
5. Deploy

## 🔐 Environment Variables

### Required Variables

```bash
# WalletConnect Project ID (Required)
# Get yours at: https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### Optional Variables

```bash
# Alchemy API Key (Recommended for production)
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key

# Infura API Key (Backup RPC provider)
NEXT_PUBLIC_INFURA_API_KEY=your_infura_key

# Application URL
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Setting Environment Variables

#### Vercel
1. Go to Project Settings → Environment Variables
2. Add each variable with its value
3. Select which environments (Production, Preview, Development)
4. Click "Save"

#### Netlify
1. Go to Site Settings → Build & deploy → Environment
2. Click "Edit variables"
3. Add each variable
4. Save and redeploy

## 📦 Build Configuration

### Next.js Config

The project uses Next.js 14 with App Router. No additional configuration needed for basic deployment.

### Build Commands

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

## 🌐 Custom Domain

### Vercel

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS according to Vercel's instructions
4. Wait for SSL certificate provisioning

### Netlify

1. Go to Site Settings → Domain management
2. Add custom domain
3. Configure DNS records
4. Enable HTTPS

## 🔧 Advanced Configuration

### CDN and Caching

Both Vercel and Netlify provide automatic CDN caching. For additional optimization:

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
```

### Performance Monitoring

Consider adding monitoring tools:

- **Vercel Analytics**: Built-in for Vercel deployments
- **Google Analytics**: For user behavior tracking
- **Sentry**: For error tracking

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=${NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID}
      - NEXT_PUBLIC_ALCHEMY_API_KEY=${NEXT_PUBLIC_ALCHEMY_API_KEY}
    restart: unless-stopped
```

### Build and Run

```bash
# Build image
docker build -t web3-dapp .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_id \
  web3-dapp

# Or use docker-compose
docker-compose up -d
```

## ☁️ Cloud Platforms

### AWS

#### Using AWS Amplify

1. Connect your repository
2. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
3. Add environment variables
4. Deploy

#### Using ECS/Fargate

1. Build Docker image
2. Push to ECR
3. Create ECS task definition
4. Deploy to Fargate

### Google Cloud Platform

#### Using Cloud Run

```bash
# Build and deploy
gcloud run deploy web3-dapp \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 📊 Monitoring & Analytics

### Setup Monitoring

```typescript
// lib/analytics.ts
export const trackEvent = (eventName: string, properties?: object) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties)
  }
}

// Usage in components
trackEvent('wallet_connected', {
  connector: connector.name,
  chainId: chain.id
})
```

### Error Tracking with Sentry

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})
```

## 🔒 Security Checklist

Before deploying to production:

- [ ] All environment variables set correctly
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] No API keys committed to repository
- [ ] Dependencies updated and audited
- [ ] Rate limiting implemented (if using backend)
- [ ] CORS properly configured
- [ ] Contract addresses verified

## 🚨 Troubleshooting

### Build Failures

**Issue**: Build fails with TypeScript errors
```bash
# Run type check locally
npm run type-check

# Fix errors before deploying
```

**Issue**: Out of memory during build
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max_old_space_size=4096" npm run build
```

### Runtime Issues

**Issue**: Environment variables not working
- Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access
- Rebuild and redeploy after adding new variables

**Issue**: Wallet connection fails
- Verify WalletConnect Project ID is correct
- Check if domain is added to WalletConnect allowed domains

## 📈 Performance Optimization

### Enable Next.js Optimizations

```javascript
// next.config.js
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,
  
  // Optimize images
  images: {
    domains: ['your-image-domain.com'],
  },
  
  // Enable SWC minification
  swcMinify: true,
}
```

### Enable Compression

Vercel and Netlify handle this automatically. For custom deployments:

```bash
npm install compression
```

## 🎯 Post-Deployment

### Verify Deployment

1. **Test wallet connection** on all supported browsers
2. **Test transactions** on testnets first
3. **Verify chain switching** works correctly
4. **Check mobile responsiveness**
5. **Test all features** thoroughly

### Monitor Performance

- Set up Vercel/Netlify analytics
- Monitor error rates
- Track user engagement
- Monitor API usage

---

**Need help? Check [Troubleshooting](./TROUBLESHOOTING.md) or open an issue.**
