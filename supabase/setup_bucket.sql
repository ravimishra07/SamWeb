-- Run this in your Supabase Dashboard -> SQL Editor

-- 1. Create the 'backups' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('backups', 'backups', true)
on conflict (id) do nothing;

-- 2. Allow anonymous uploads (so the migration script works)
create policy "Allow public uploads to backups"
on storage.objects for insert
to public
with check ( bucket_id = 'backups' );

-- 3. Allow anonymous downloads (so you can restore later)
create policy "Allow public downloads from backups"
on storage.objects for select
to public
using ( bucket_id = 'backups' );

-- 4. Allow updates (optional, for overwriting backups)
create policy "Allow public updates to backups"
on storage.objects for update
to public
using ( bucket_id = 'backups' );
