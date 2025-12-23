-- Admin Schema Updates for IdeaPilot
-- Run this SQL in your Supabase SQL Editor AFTER running supabase-schema.sql

-- Add is_admin column to users table (if it doesn't exist)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create index on is_admin for faster admin checks
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON public.users(is_admin) WHERE is_admin = TRUE;

-- Set edlahareen02@gmail.com as admin
UPDATE public.users 
SET is_admin = TRUE 
WHERE email = 'edlahareen02@gmail.com';

-- If the user doesn't exist yet, this will set them as admin when they sign up
-- You may need to run this after the user signs up:
-- UPDATE public.users SET is_admin = TRUE WHERE email = 'edlahareen02@gmail.com';

-- Admin RLS Policies for users table
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
CREATE POLICY "Admins can update all users"
  ON public.users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

DROP POLICY IF EXISTS "Admins can delete all users" ON public.users;
CREATE POLICY "Admins can delete all users"
  ON public.users FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Admin RLS Policies for user_preferences
DROP POLICY IF EXISTS "Admins can view all preferences" ON public.user_preferences;
CREATE POLICY "Admins can view all preferences"
  ON public.user_preferences FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Admin RLS Policies for search_history
DROP POLICY IF EXISTS "Admins can view all search history" ON public.search_history;
CREATE POLICY "Admins can view all search history"
  ON public.search_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

DROP POLICY IF EXISTS "Admins can delete all search history" ON public.search_history;
CREATE POLICY "Admins can delete all search history"
  ON public.search_history FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Admin RLS Policies for favorites
DROP POLICY IF EXISTS "Admins can view all favorites" ON public.favorites;
CREATE POLICY "Admins can view all favorites"
  ON public.favorites FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

DROP POLICY IF EXISTS "Admins can delete all favorites" ON public.favorites;
CREATE POLICY "Admins can delete all favorites"
  ON public.favorites FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

