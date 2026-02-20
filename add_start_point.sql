-- Migration script to add start_point to existing routes table
ALTER TABLE public.routes ADD COLUMN start_point TEXT;
