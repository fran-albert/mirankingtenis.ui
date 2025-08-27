# Deployment Setup

## Automated CI/CD Pipeline

This repository is configured with automated deployment from `develop` → `main` → Vercel.

### How it works:
1. When code is pushed to `develop` branch, GitHub Actions runs tests and linting
2. If tests pass, the workflow automatically merges `develop` to `main`
3. The merge to `main` triggers automatic deployment to Vercel

## Required GitHub Secrets

To enable automated deployment, add these secrets in GitHub repository settings (`Settings > Secrets and variables > Actions`):

### Vercel Integration Secrets:
- `VERCEL_TOKEN`: Your Vercel API token
  - Get it from: https://vercel.com/account/tokens
- `VERCEL_ORG_ID`: Your Vercel organization ID
  - Found in: Vercel Dashboard > Settings > General
- `VERCEL_PROJECT_ID`: Your project ID
  - Found in: Project Settings > General

### How to get Vercel credentials:

1. **VERCEL_TOKEN**:
   - Go to https://vercel.com/account/tokens
   - Create a new token
   - Copy the token value

2. **VERCEL_ORG_ID**:
   - Go to your Vercel dashboard
   - Click on your profile/organization settings
   - Copy the "Organization ID" value

3. **VERCEL_PROJECT_ID**:
   - Go to your project in Vercel
   - Go to Settings > General
   - Copy the "Project ID" value

## Vercel Project Configuration

Make sure your Vercel project is configured with:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Install Command**: `npm ci`
- **Node.js Version**: 20.x
- **Deploy from**: `main` branch only (develop branch deploys are disabled)

## Manual Deployment

If you need to deploy manually:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

## Branch Protection (Recommended)

Consider setting up branch protection for `main` branch:
1. Go to repository Settings > Branches
2. Add rule for `main` branch
3. Enable "Require status checks to pass before merging"
4. Select the "test" check from the workflow