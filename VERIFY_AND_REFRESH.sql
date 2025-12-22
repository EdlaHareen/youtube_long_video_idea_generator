-- ============================================
-- VERIFY: Check if data actually exists
-- ============================================
-- This will show you exactly what's in the table
SELECT 
    id,
    email,
    name,
    created_at,
    updated_at
FROM public.users
ORDER BY created_at DESC;

-- ============================================
-- COUNT: Get exact count
-- ============================================
SELECT COUNT(*) as total_users FROM public.users;

-- ============================================
-- CHECK: Verify the table structure
-- ============================================
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- ============================================
-- FORCE REFRESH: If data exists but not showing
-- ============================================
-- Sometimes Supabase Table Editor needs a refresh
-- Try clicking the refresh button in Table Editor
-- Or close and reopen the Table Editor tab

-- ============================================
-- ALTERNATIVE: Check if there's a view or filter
-- ============================================
-- Check if there are any views on the users table
SELECT 
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public' 
AND table_name LIKE '%user%';

