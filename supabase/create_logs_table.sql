-- Create the logs table
create table if not exists logs (
  id uuid primary key,
  date date not null,
  timestamp timestamptz not null,
  summary text,
  status jsonb,
  insights jsonb,
  goals text[],
  tags text[],
  trigger_events text[],
  symptom_checklist text[],
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table logs enable row level security;

-- Create a policy to allow all operations for now (since we are using Anon key for a personal app)
-- WARNING: In a production multi-user app, you would restrict this to authenticated users.
create policy "Allow public access"
on logs
for all
using (true)
with check (true);
