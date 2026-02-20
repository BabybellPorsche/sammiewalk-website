-- Add Extra Photos Gallery to routes table
ALTER TABLE public.routes ADD COLUMN gallery_urls JSONB;
