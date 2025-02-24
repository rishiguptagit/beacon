CREATE TABLE users (
  email VARCHAR(255) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE official_incidents (
  id SERIAL PRIMARY KEY,
  source VARCHAR(50) NOT NULL, -- e.g., 'NHS', 'National Database'
  incident_type VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  coordinates POINT,
  description TEXT,
  severity VARCHAR(20) NOT NULL,
  reported_at TIMESTAMP NOT NULL,
  last_updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) NOT NULL,
  expected_resolution_time TIMESTAMP,
  official_guidance TEXT,
  affected_radius_meters INTEGER,
  external_reference_id VARCHAR(100) -- Reference ID from the source system
);

CREATE TABLE user_reported_incidents (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) REFERENCES users(email),
  incident_type VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  coordinates POINT,
  description TEXT,
  severity VARCHAR(20) NOT NULL,
  reported_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  verified_by_admin BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP,
  responder_notes TEXT,
  related_official_incident_id INTEGER REFERENCES official_incidents(id)
);

-- Index for geographical queries
CREATE INDEX idx_official_incidents_coordinates ON official_incidents USING GIST(coordinates);
CREATE INDEX idx_user_reported_coordinates ON user_reported_incidents USING GIST(coordinates);
