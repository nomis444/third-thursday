-- Third Thursday Attendee Directory
-- Run this in your Supabase SQL Editor

create table attendees (
  id uuid default gen_random_uuid() primary key,
  first_name text not null,
  last_name text not null,
  company text not null,
  title text default '',
  email text not null,
  phone text default '',
  website text default '',
  linkedin text default '',
  bio text default '',
  event_date date not null,
  created_at timestamptz default now()
);

-- One registration per email per event
create unique index attendees_email_event_unique on attendees (email, event_date);

-- Index for fast lookups by event date
create index attendees_event_date_idx on attendees (event_date);

-- Enable Row Level Security
alter table attendees enable row level security;

-- Anyone can insert (registration is public via QR code)
create policy "Anyone can register" on attendees
  for insert with check (true);

-- Anyone can read attendees for the current event
create policy "Anyone can view attendees" on attendees
  for select using (true);

-- Upcoming events with venue info
create table events (
  id uuid default gen_random_uuid() primary key,
  event_date date not null unique,
  venue_name text not null,
  venue_address text default '',
  created_at timestamptz default now()
);

create index events_date_idx on events (event_date);

alter table events enable row level security;

create policy "Anyone can view events" on events
  for select using (true);

-- Enable realtime for live directory updates
alter publication supabase_realtime add table attendees;
