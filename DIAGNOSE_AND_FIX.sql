-- ============================================
-- STEP 1: Check if trigger exists
-- ============================================
SELECT 
    trigger_name, 
    event_manipulation, 
    event_object_table, 
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- ============================================
-- STEP 2: Check if function exists
-- ============================================
SELECT 
    routine_name, 
    routine_type
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';

-- ============================================
-- STEP 3: Check RLS status on users table
-- ============================================
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'users' AND schemaname = 'public';

-- ============================================
-- STEP 4: Check existing users in auth.users
-- ============================================
SELECT id, email, created_at, confirmed_at 
FROM auth.users 
ORDER BY created_at DESC;

-- ============================================
-- STEP 5: Check existing profiles in public.users
-- ============================================
SELECT id, email, name, created_at 
FROM public.users 
ORDER BY created_at DESC;

-- ============================================
-- STEP 6: DISABLE RLS TEMPORARILY (if enabled)
-- ============================================
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 7: RECREATE THE TRIGGER (to ensure it works)
-- ============================================
-- First, drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1), 'User'),
    NEW.created_at,
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- STEP 8: Create profiles for existing users
-- ============================================
INSERT INTO public.users (id, email, name, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'name', SPLIT_PART(au.email, '@', 1), 'User') as name,
    au.created_at,
    NOW() as updated_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 9: Verify profiles were created
-- ============================================
SELECT COUNT(*) as total_profiles FROM public.users;
SELECT id, email, name FROM public.users;


