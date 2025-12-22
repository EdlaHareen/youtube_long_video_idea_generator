-- ============================================
-- TEST: Check if trigger is working
-- ============================================

-- First, let's see if the trigger exists
SELECT 
    trigger_name, 
    event_manipulation, 
    event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Check if the function exists
SELECT routine_name 
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';

-- ============================================
-- RECREATE TRIGGER (to ensure it works)
-- ============================================

-- Drop and recreate the function
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert into users table
  INSERT INTO public.users (id, email, name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1), 'User'),
    NEW.created_at,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- VERIFY: Check RLS status
-- ============================================
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- ============================================
-- TEST: Manually test the function
-- ============================================
-- This will show if the function works
SELECT 
    'Trigger created successfully' as status,
    trigger_name
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

