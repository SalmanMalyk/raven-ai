-- Create agents table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  website VARCHAR(500),
  description TEXT NOT NULL,
  contact_person_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  signature TEXT,
  tone VARCHAR(50) DEFAULT 'professional',
  language VARCHAR(10) DEFAULT 'en',
  business_hours VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX idx_agents_user_id ON agents(user_id);

-- Enable Row Level Security
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own agents
CREATE POLICY "Users can view their own agents"
  ON agents FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can create their own agents
CREATE POLICY "Users can create their own agents"
  ON agents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own agents
CREATE POLICY "Users can update their own agents"
  ON agents FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own agents
CREATE POLICY "Users can delete their own agents"
  ON agents FOR DELETE
  USING (auth.uid() = user_id);
