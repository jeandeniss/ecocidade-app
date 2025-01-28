/*
  # Initial Schema Setup

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text)
      - points (integer)
      - created_at (timestamp)
    - eco_actions
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - type (text)
      - points (integer)
      - description (text)
      - co2_saved (float)
      - waste_prevented (float)
      - created_at (timestamp)
    - rewards
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - points_cost (integer)
      - type (text)
      - value (float)
      - store_id (uuid, nullable)
      - created_at (timestamp)
    - claimed_rewards
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - reward_id (uuid, foreign key)
      - claimed_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  points integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Eco actions table
CREATE TABLE IF NOT EXISTS eco_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  points integer NOT NULL,
  description text NOT NULL,
  co2_saved float NOT NULL,
  waste_prevented float NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE eco_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own eco actions"
  ON eco_actions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own eco actions"
  ON eco_actions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  points_cost integer NOT NULL,
  type text NOT NULL,
  value float NOT NULL,
  store_id uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read rewards"
  ON rewards
  FOR SELECT
  TO authenticated
  USING (true);

-- Claimed rewards table
CREATE TABLE IF NOT EXISTS claimed_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  reward_id uuid REFERENCES rewards(id) ON DELETE CASCADE,
  claimed_at timestamptz DEFAULT now()
);

ALTER TABLE claimed_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own claimed rewards"
  ON claimed_rewards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can claim rewards"
  ON claimed_rewards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);