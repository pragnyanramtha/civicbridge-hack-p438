CREATE TABLE IF NOT EXISTS civic_sessions (
  id uuid PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS civic_grievances (
  id text PRIMARY KEY,
  owner_id uuid NOT NULL REFERENCES civic_sessions(id),
  tracking_hash text NOT NULL,
  subject text NOT NULL CHECK (char_length(subject) BETWEEN 5 AND 120),
  description text NOT NULL CHECK (char_length(description) BETWEEN 15 AND 2000),
  category text NOT NULL CHECK (category IN ('Sanitation','Roads & transport','Water & drainage','Electricity','Public spaces','Civic services')),
  area text NOT NULL CHECK (char_length(area) BETWEEN 3 AND 160),
  status text NOT NULL DEFAULT 'Submitted' CHECK (status IN ('Submitted','Acknowledged','In progress','Awaiting information','Resolved')),
  is_sample boolean NOT NULL DEFAULT false,
  attachment_data bytea,
  attachment_type text,
  attachment_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS civic_grievance_owner_idx ON civic_grievances(owner_id,created_at DESC);
CREATE INDEX IF NOT EXISTS civic_grievance_status_idx ON civic_grievances(status,updated_at DESC);
CREATE TABLE IF NOT EXISTS civic_events (
  id bigserial PRIMARY KEY,
  grievance_id text NOT NULL REFERENCES civic_grievances(id),
  status text NOT NULL,
  note text NOT NULL,
  actor text NOT NULL CHECK (actor IN ('Citizen','Staff','Demo')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS civic_events_case_idx ON civic_events(grievance_id,created_at);
CREATE TABLE IF NOT EXISTS civic_rate_limits (
  key text PRIMARY KEY,
  hits int NOT NULL DEFAULT 1,
  expires_at timestamptz NOT NULL
);
CREATE TABLE IF NOT EXISTS civic_feedback (
  id bigserial PRIMARY KEY,
  owner_id uuid NOT NULL REFERENCES civic_sessions(id),
  question varchar(1000) NOT NULL,
  helpful boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
