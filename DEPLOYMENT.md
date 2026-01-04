# Deployment Guide

This guide covers deploying the YouTube Long Video Idea Generator to various hosting platforms.

## Prerequisites

Before deploying, ensure you have:

1. ✅ **Supabase Project Setup**
   - Created a Supabase project at [supabase.com](https://supabase.com)
   - Applied the database schema from `supabase-schema.sql` in your Supabase SQL Editor
   - Obtained your Supabase credentials:
     - **Project URL** (from Settings → API → Project URL)
     - **Anon/Public Key** (from Settings → API → Project API keys)

2. ✅ **Local Build Test**
   - Run `npm run build` locally to verify the build works
   - Check that the `dist/` folder is generated successfully

3. ✅ **Environment Variables**
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key

## Deployment Options

### Option 1: Vercel (Recommended) ⭐

Vercel offers the easiest deployment experience with zero-config for Vite apps.

#### Steps:

1. **Install Vercel CLI** (optional, for CLI deployment):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via GitHub** (Recommended):
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Vite settings

3. **Set Environment Variables**:
   - In Vercel dashboard → Your Project → Settings → Environment Variables
   - Add:
     - `VITE_SUPABASE_URL` = your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
   - Click "Save"

4. **Deploy**:
   - Click "Deploy" (or push to main branch if auto-deploy is enabled)
   - Your app will be live at `your-project.vercel.app`

5. **Custom Domain** (Optional):
   - Go to Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

#### CLI Deployment Alternative:

```bash
vercel
```

Follow the prompts and set environment variables when asked.

---

### Option 2: Netlify

Netlify provides excellent CI/CD and a generous free tier.

#### Steps:

1. **Install Netlify CLI** (optional):
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy via GitHub** (Recommended):
   - Push your code to GitHub
   - Go to [netlify.com](https://netlify.com) and sign in with GitHub
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repository
   - Netlify will auto-detect settings from `netlify.toml`:
     - Build command: `npm run build`
     - Publish directory: `dist`

3. **Set Environment Variables**:
   - Go to Site settings → Environment variables
   - Add:
     - `VITE_SUPABASE_URL` = your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
   - Click "Save"

4. **Deploy**:
   - Click "Deploy site" (or it will auto-deploy on push to main)
   - Your app will be live at `your-site-name.netlify.app`

5. **Custom Domain** (Optional):
   - Go to Domain settings → Add custom domain
   - Follow DNS configuration instructions

#### CLI Deployment Alternative:

```bash
netlify deploy --prod
```

Set environment variables in Netlify dashboard or via CLI:
```bash
netlify env:set VITE_SUPABASE_URL "your-url"
netlify env:set VITE_SUPABASE_ANON_KEY "your-key"
```

---

### Option 3: GitHub Pages

GitHub Pages is free and perfect for static sites. Requires a GitHub repository.

#### Steps:

1. **Enable GitHub Pages**:
   - Go to your GitHub repository → Settings → Pages
   - Under "Source", select "GitHub Actions"

2. **Set Repository Secrets**:
   - Go to Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `VITE_SUPABASE_URL` = your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key

3. **Configure Base Path** (if needed):
   - If deploying to a project page (e.g., `username.github.io/repo-name`):
     - Update `vite.config.ts`:
     ```typescript
     export default defineConfig({
       base: '/your-repo-name/',
       // ... rest of config
     });
     ```
   - If deploying to a user/organization page (e.g., `username.github.io`):
     - Keep `base: '/'` or omit it (default)

4. **Deploy**:
   - Push your code to the `main` branch
   - The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:
     - Build your app
     - Deploy to GitHub Pages
   - Your app will be live at `username.github.io/repo-name` (or your custom domain)

5. **View Deployment**:
   - Go to Actions tab to see deployment progress
   - Once complete, your site will be live

#### Manual Deployment (Alternative):

If you prefer manual deployment:

```bash
npm run build
# Then push the dist folder to gh-pages branch
```

---

## Post-Deployment Checklist

After deploying, verify:

- [ ] Application loads correctly
- [ ] Supabase connection works (check browser console for errors)
- [ ] Authentication flow works (sign up/sign in)
- [ ] Database operations work (saving favorites, search history)
- [ ] All routes work (SPA routing should redirect to index.html)
- [ ] Environment variables are set correctly

## Troubleshooting

### Build Fails

- **Error: Environment variables not found**
  - Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in your deployment platform
  - Restart the build after adding environment variables

- **Error: Module not found**
  - Run `npm install` locally to ensure all dependencies are in `package.json`
  - Check that `node_modules` is in `.gitignore` (it should be)

### App Works Locally But Not Deployed

- **Supabase connection errors**
  - Verify environment variables are set correctly in deployment platform
  - Check Supabase dashboard → Settings → API → CORS settings
  - Ensure your Supabase project is active (not paused)

- **404 errors on routes**
  - Verify SPA redirects are configured:
    - Vercel: `vercel.json` with rewrites
    - Netlify: `netlify.toml` with redirects
    - GitHub Pages: Base path configured correctly

- **Assets not loading**
  - Check that build output directory is correct (`dist/`)
  - Verify asset paths in browser DevTools → Network tab

### Authentication Issues

- **Users can't sign up/sign in**
  - Check Supabase dashboard → Authentication → Settings
  - Verify email confirmation settings
  - Check Row Level Security (RLS) policies are enabled

- **Profile creation fails**
  - Verify `users` table exists in Supabase
  - Check RLS policies allow users to insert their own profiles
  - Review browser console for specific error messages

## Environment Variables Reference

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase public/anon key | Supabase Dashboard → Settings → API → Project API keys → anon/public |

**Note**: These are safe to expose in frontend code. The anon key is designed to be public and is restricted by Row Level Security policies.

## Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

---

## Quick Start Commands

### Local Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview  # Preview production build locally
```

### Deploy to Vercel
```bash
vercel
```

### Deploy to Netlify
```bash
netlify deploy --prod
```

