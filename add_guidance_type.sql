ALTER TABLE public.routes 
ADD COLUMN guidance_type TEXT DEFAULT 'Nodes',
ADD COLUMN guidance_text TEXT;
