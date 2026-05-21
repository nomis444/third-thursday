-- Seed data for Third Thursday
-- Update the event_date to match the current/next Third Thursday before running

-- Upcoming events
INSERT INTO events (event_date, venue_name, venue_address) VALUES
  ('2026-06-19', 'Santora''s Pizza Pub & Grill', 'Transit Rd, Williamsville'),
  ('2026-07-17', 'Brite Smith Brewery', 'Main St, Williamsville'),
  ('2026-08-21', 'Brite Smith Brewery', 'Main St, Williamsville');

-- No dummy attendees — production data only
