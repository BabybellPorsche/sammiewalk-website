-- Enable Public Read Access for Routes Table
CREATE POLICY "Enable read access for all users" ON "public"."routes"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- Enable Public Read Access for gpx_files Bucket
CREATE POLICY "Public read access to GPX" ON "storage"."objects"
AS PERMISSIVE FOR SELECT
TO public
USING (bucket_id = 'gpx_files');

-- Enable Public Read Access for cover_photos Bucket
CREATE POLICY "Public read access to covers" ON "storage"."objects"
AS PERMISSIVE FOR SELECT
TO public
USING (bucket_id = 'cover_photos');
