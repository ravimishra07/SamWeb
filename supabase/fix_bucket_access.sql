-- Run this in Supabase SQL Editor
-- This fixes the "Bucket not found" error by allowing the app to "see" the bucket exists.

-- Allow public to read bucket metadata
create policy "Allow public to list buckets"
on storage.buckets for select
to public
using ( true );

-- Ensure the backups bucket is definitely public
update storage.buckets
set public = true
where id = 'backups';
