-- Fix missing user profiles
-- This SQL will create profiles for all users in auth.users who don't have a profile in public.users

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

-- Check how many profiles were created
SELECT COUNT(*) as profiles_created FROM public.users;

-- View all users in auth.users
SELECT id, email, created_at FROM auth.users;

-- View all profiles in public.users
SELECT id, email, name, created_at FROM public.users;

