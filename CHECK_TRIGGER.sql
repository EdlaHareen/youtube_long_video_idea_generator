-- Check if the trigger exists
SELECT 
    trigger_name, 
    event_manipulation, 
    event_object_table, 
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Check if the function exists
SELECT 
    routine_name, 
    routine_type
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';

-- Check if users table has any data
SELECT COUNT(*) as user_count FROM users;

-- Check auth.users to see if any users exist
SELECT COUNT(*) as auth_user_count FROM auth.users;

