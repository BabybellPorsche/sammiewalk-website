-- Fix for "violates row-level security policy"

-- 1. Drop the old table and types so we can recreate them cleanly
DROP TABLE IF EXISTS public.routes CASCADE;
DROP TYPE IF EXISTS route_difficulty CASCADE;
DROP TYPE IF EXISTS route_type CASCADE;

-- 2. Create Enum for Difficulty
CREATE TYPE route_difficulty AS ENUM ('Easy', 'Moderate', 'Hard', 'Expert');
-- Create Enum for Route Type
CREATE TYPE route_type AS ENUM ('GPX', 'Nodes', 'Both');

-- 3. Create Routes Table with user_id
CREATE TABLE public.routes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    distance_km NUMERIC(5,2) NOT NULL,
    route_type route_type DEFAULT 'GPX',
    gpx_file_url TEXT,
    nodes JSONB,
    difficulty route_difficulty DEFAULT 'Moderate',
    notes TEXT,
    cover_photo_url TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies
-- Users can read only their own routes
CREATE POLICY "Users can view their own routes" 
ON public.routes FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own routes
CREATE POLICY "Users can insert their own routes" 
ON public.routes FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own routes
CREATE POLICY "Users can update their own routes" 
ON public.routes FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Users can delete their own routes
CREATE POLICY "Users can delete their own routes" 
ON public.routes FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);
