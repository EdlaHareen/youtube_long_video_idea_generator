# How to Add Environment Variables in Vercel

This guide will walk you through adding your Supabase credentials to your Vercel deployment.

## Step-by-Step Instructions

### Step 1: Access Vercel Dashboard

1. Go to [https://vercel.com](https://vercel.com)
2. Sign in with your GitHub account (the same one you used to deploy)
3. You should see your dashboard with your projects

### Step 2: Open Your Project

1. Find and click on your project: **`youtube-long-video-idea-generator`**
2. This will open your project overview page

### Step 3: Navigate to Settings

1. Click on the **"Settings"** tab at the top of the page
   - It's located in the navigation bar, next to "Deployments", "Analytics", etc.

### Step 4: Go to Environment Variables

1. In the left sidebar under "Settings", click on **"Environment Variables"**
   - You'll see a list of current environment variables (likely empty if this is your first time)

### Step 5: Add Your Supabase Credentials

You need to add **TWO** environment variables:

#### Variable 1: VITE_SUPABASE_URL

1. Click the **"Add New"** button (or "Add" button)
2. In the **"Key"** field, enter exactly:
   ```
   VITE_SUPABASE_URL
   ```
3. In the **"Value"** field, enter your Supabase project URL
   - This looks like: `https://xxxxxxxxxxxxx.supabase.co`
   - You can find this in your Supabase dashboard → Settings → API → Project URL
4. Select the environments where this should be available:
   - ✅ **Production** (checked)
   - ✅ **Preview** (checked - for testing)
   - ✅ **Development** (optional, if you want to use it locally)
5. Click **"Save"**

#### Variable 2: VITE_SUPABASE_ANON_KEY

1. Click **"Add New"** again
2. In the **"Key"** field, enter exactly:
   ```
   VITE_SUPABASE_ANON_KEY
   ```
3. In the **"Value"** field, enter your Supabase anon/public key
   - This is a long string that looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - You can find this in your Supabase dashboard → Settings → API → Project API keys → `anon` `public`
4. Select the environments:
   - ✅ **Production** (checked)
   - ✅ **Preview** (checked)
   - ✅ **Development** (optional)
5. Click **"Save"**

### Step 6: Verify Your Variables

After adding both variables, you should see:

```
VITE_SUPABASE_URL          [Production, Preview, Development]
VITE_SUPABASE_ANON_KEY     [Production, Preview, Development]
```

### Step 7: Redeploy (Automatic)

- **Good news**: Vercel will automatically trigger a new deployment when you save environment variables!
- You'll see a notification or can check the "Deployments" tab
- Wait 1-2 minutes for the deployment to complete

### Step 8: Verify It Works

1. Once deployment completes, visit: https://youtube-long-video-idea-generator.vercel.app/
2. Open browser DevTools (Press F12 or Right-click → Inspect)
3. Go to the **Console** tab
4. You should **NOT** see the warning: "Supabase URL or Anon Key not configured"
5. Try signing up or signing in to test authentication

## Where to Find Your Supabase Credentials

If you don't have your Supabase credentials yet:

### Getting Your Supabase Project URL:

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project (or create one if you haven't)
4. Click on **"Settings"** (gear icon in the left sidebar)
5. Click on **"API"** in the settings menu
6. Under **"Project URL"**, you'll see your URL
   - Copy this entire URL (e.g., `https://abcdefghijklmnop.supabase.co`)

### Getting Your Supabase Anon Key:

1. In the same **Settings → API** page
2. Scroll down to **"Project API keys"**
3. Find the **`anon` `public`** key
4. Click the **eye icon** or **"Reveal"** button to show the key
5. Click the **copy icon** to copy the entire key
   - It's a long JWT token starting with `eyJ...`

## Visual Guide (What You'll See)

```
Vercel Dashboard
├── Projects
│   └── youtube-long-video-idea-generator
│       ├── Deployments
│       ├── Analytics
│       └── Settings ← Click here
│           ├── General
│           ├── Environment Variables ← Click here
│           │   └── [Add New button]
│           ├── Domains
│           └── ...
```

## Troubleshooting

### "I can't find the Settings tab"
- Make sure you're logged into Vercel
- Make sure you're viewing the correct project
- The Settings tab is always visible in the top navigation

### "The variables aren't working after deployment"
- Wait 2-3 minutes for the deployment to fully complete
- Check that you spelled the variable names exactly:
  - `VITE_SUPABASE_URL` (not `SUPABASE_URL`)
  - `VITE_SUPABASE_ANON_KEY` (not `SUPABASE_ANON_KEY`)
- Make sure both variables are enabled for "Production" environment
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)

### "I don't have a Supabase project yet"
- Follow the instructions in `SUPABASE_SETUP.md` in your project
- Or go to [supabase.com](https://supabase.com) and create a new project
- Run the SQL schema from `supabase-schema.sql` in your Supabase SQL Editor

### "The deployment failed"
- Check the deployment logs in Vercel dashboard → Deployments
- Look for error messages
- Common issues:
  - Build command failing (check `package.json` scripts)
  - Missing dependencies (should be auto-installed)
  - Environment variable syntax errors

## Security Notes

✅ **Safe to expose**: The `anon` key is designed to be public and is restricted by Row Level Security (RLS) policies in Supabase.

✅ **Never expose**: The `service_role` key - this should NEVER be in your frontend code or environment variables.

✅ **Best practice**: Only enable environment variables for the environments you need (Production, Preview, Development).

## Quick Checklist

- [ ] Logged into Vercel dashboard
- [ ] Opened the correct project
- [ ] Navigated to Settings → Environment Variables
- [ ] Added `VITE_SUPABASE_URL` with correct value
- [ ] Added `VITE_SUPABASE_ANON_KEY` with correct value
- [ ] Selected "Production" environment for both
- [ ] Saved both variables
- [ ] Waited for automatic redeployment
- [ ] Tested the deployed site
- [ ] Verified no console errors

## Need Help?

If you encounter any issues:
1. Check the Vercel deployment logs
2. Check browser console for specific error messages
3. Verify your Supabase project is active and not paused
4. Review the `POST_DEPLOYMENT_CHECKLIST.md` for more troubleshooting tips

---

**Once you've added the environment variables and the redeployment completes, your app should be fully functional! 🚀**



