-- SUPER DIRECT RLS FIX

-- Step 1: Explicitly disable and re-enable RLS
ALTER TABLE public.routes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop all existing policies to ensure we start clean
DROP POLICY IF EXISTS "Users can view their own routes" ON public.routes;
DROP POLICY IF EXISTS "Users can insert their own routes" ON public.routes;
DROP POLICY IF EXISTS "Users can update their own routes" ON public.routes;
DROP POLICY IF EXISTS "Users can delete their own routes" ON public.routes;

-- Step 3: Create the exact policies needed, using user_id column
CREATE POLICY "Users can view their own routes" 
ON public.routes FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own routes" 
ON public.routes FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own routes" 
ON public.routes FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own routes" 
ON public.routes FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Optional Check: This returns the current policies on the table so you can verify they exist
SELECT * FROM pg_policies WHERE tablename = 'routes';
