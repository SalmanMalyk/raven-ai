-- Add keywords and match_all_keywords columns to agents table
ALTER TABLE agents 
ADD COLUMN keywords TEXT[] DEFAULT '{}',
ADD COLUMN match_all_keywords BOOLEAN DEFAULT FALSE;
