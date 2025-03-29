# Floating Bubbles

A Next.js application with Supabase backend.

## Deployment to Netlify

### Prerequisites

- Netlify account
- Supabase project (already set up)
- GitHub repository with your code

### Setup Steps

1. Push your code to a GitHub repository:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-github-repo-url
git push -u origin main
```

2. Log in to Netlify and click "Add new site" > "Import an existing project"

3. Connect to your GitHub repository

4. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

5. Add environment variables in Netlify:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY

6. Deploy the site

7. Set up a custom domain if needed

### Troubleshooting

- If images aren't loading, check the remotePatterns in next.config.js
- For API routes issues, check Netlify Functions and serverless configuration
- For database connectivity issues, ensure your Supabase security policies allow access from your Netlify domain

## Local Development

```bash
npm install
npm run dev
```

Visit http://localhost:3000 to view the application. 