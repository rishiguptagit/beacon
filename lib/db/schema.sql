CREATE TABLE users (
  email VARCHAR(255) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
);
