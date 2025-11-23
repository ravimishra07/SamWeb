-- Run this in Supabase SQL Editor to fix the "policy already exists" error

-- 1. Drop conflicting policies (clean slate)
drop policy if exists "Allow public uploads" on storage.objects;
drop policy if exists "Allow public downloads" on storage.objects;
drop policy if exists "Allow public uploads to backups" on storage.objects;
drop policy if exists "Allow public downloads from backups" on storage.objects;

-- 2. Create the 'backups' bucket
insert into storage.buckets (id, name, public)
values ('backups', 'backups', true)
on conflict (id) do nothing;

-- 3. Re-create correct policies
create policy "Allow public uploads to backups"
on storage.objects for insert
to public
with check ( bucket_id = 'backups' );

create policy "Allow public downloads from backups"
on storage.objects for select
to public
using ( bucket_id = 'backups' );
