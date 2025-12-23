# Supabase Setup Guide

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - Name: `ideapilot` (or your preferred name)
   - Database Password: (save this securely)
   - Region: Choose closest to you
5. Wait for the project to be created (takes ~2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

## Step 3: Set Environment Variables

1. Create a `.env` file in the root of your project
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

3. Replace `your_project_url_here` and `your_anon_key_here` with the values from Step 2

## Step 4: Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click "Run" to execute the SQL
5. You should see "Success. No rows returned" - this is expected

## Step 5: Verify Tables Created

1. Go to **Table Editor** in your Supabase dashboard
2. You should see these tables:
   - `user_preferences`
   - `search_history`
   - `favorites`

## Step 6: Test Authentication

1. Start your development server: `npm run dev`
2. Click "Sign In" in the navigation
3. Create a test account
4. Check your email for verification (if email confirmation is enabled)
5. Sign in and test the features

## Features Enabled

Once set up, users can:
- ✅ Sign up / Sign in with email and password
- ✅ Save favorites to their account (synced across devices)
- ✅ View search history
- ✅ Save preferences (default filters, sort options)
- ✅ All data is private to each user (Row Level Security enabled)

## Troubleshooting

### "Supabase URL not configured" warning
- Make sure your `.env` file exists in the project root
- Check that variable names start with `VITE_`
- Restart your dev server after adding/changing `.env` file

### Authentication not working
- Verify your Supabase URL and anon key are correct
- Check Supabase dashboard → Authentication → Settings
- Ensure email confirmation is set up correctly

### Database errors
- Make sure you ran the SQL schema file
- Check Table Editor to verify tables exist
- Check Row Level Security policies are enabled

### RLS (Row Level Security) errors
- Verify all policies were created successfully
- Check that users can only access their own data
- Review the SQL schema file for policy definitions







