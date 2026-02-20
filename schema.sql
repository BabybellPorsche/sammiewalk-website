-- schema.sql
-- Create Enum for Difficulty
CREATE TYPE route_difficulty AS ENUM ('Easy', 'Moderate', 'Hard', 'Expert');
-- Create Enum for Route Type
CREATE TYPE route_type AS ENUM ('GPX', 'Nodes', 'Both');

-- Create Routes Table
CREATE TABLE public.routes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    distance_km NUMERIC(5,2) NOT NULL,
    route_type route_type DEFAULT 'GPX',
    gpx_file_url TEXT,
    nodes JSONB,
    start_point TEXT,
    difficulty route_difficulty DEFAULT 'Moderate',
    notes TEXT,
    cover_photo_url TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- Users can read only their own routes
CREATE POLICY "Users can view their own routes" 
ON public.routes FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own routes
CREATE POLICY "Users can insert their own routes" 
ON public.routes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own routes
CREATE POLICY "Users can update their own routes" 
ON public.routes FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own routes
CREATE POLICY "Users can delete their own routes" 
ON public.routes FOR DELETE 
USING (auth.uid() = user_id);

-- Set up Storage Buckets
-- Note: Run these via the Supabase Dashboard SQL editor or UI:
-- insert into storage.buckets (id, name, public) values ('gpx_files', 'gpx_files', true);
-- insert into storage.buckets (id, name, public) values ('cover_photos', 'cover_photos', true);
