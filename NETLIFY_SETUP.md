# Netlify Deployment Guide

This guide provides step-by-step instructions for deploying your Next.js application with Supabase to Netlify.

## Manual Deployment

### Step 1: Create a Netlify Account
If you haven't already, sign up for a Netlify account at [netlify.com](https://www.netlify.com/).

### Step 2: Prepare Your Repository
1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2. Make sure your repository includes:
   - netlify.toml
   - next.config.js
   - package.json with @netlify/plugin-nextjs

### Step 3: Connect to Netlify
1. Log in to your Netlify account.
2. Click "Add new site" > "Import an existing project".
3. Connect to your Git provider and select your repository.

### Step 4: Configure Build Settings
Netlify should automatically detect your Next.js project, but verify these settings:
- Build command: `npm run build`
- Publish directory: `.next`

### Step 5: Configure Environment Variables
Add the following environment variables in Netlify's site settings:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

### Step 6: Deploy
Click "Deploy site" and wait for the build to complete.

### Step 7: Configure Custom Domain (Optional)
1. Go to "Domain settings" in your site dashboard.
2. Click "Add custom domain" and follow the instructions.

## Automatic Deployments with GitHub Actions

If you've set up the GitHub workflow file (.github/workflows/netlify.yml), you'll need to:

1. Create a Netlify personal access token:
   - Go to User Settings > Applications > Personal access tokens
   - Generate a new token with appropriate permissions

2. Add the following secrets to your GitHub repository:
   - NETLIFY_AUTH_TOKEN: Your Netlify personal access token
   - NETLIFY_SITE_ID: Your Netlify site ID (found in Site settings > General > Site details)
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY

3. Push to your main branch to trigger automatic deployment.

## Troubleshooting

### Images Not Loading
Check your next.config.js to ensure remotePatterns are correctly configured for Supabase storage.

### API Routes Not Working
Make sure your Netlify Functions are correctly set up and your API calls are using the correct paths.

### Database Connection Issues
Verify your Supabase security policies allow connections from your Netlify domain.

### Build Failures
Check the build logs in Netlify for specific error messages. 