-- Run this in your Supabase SQL Editor

-- Create guests table
CREATE TABLE guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    personalized_message TEXT
);

-- Create responses table
CREATE TABLE responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('attending', 'declined')),
    guests_count INTEGER NOT NULL DEFAULT 1,
    food_preference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) but allow anonymous inserts for simplicity in this hobby project.
-- In a real app, you might want to secure this based on a JWT or session.
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read of guests
CREATE POLICY "Allow anonymous read of guests" ON guests
    FOR SELECT TO anon USING (true);

-- Allow anonymous inserts to responses
CREATE POLICY "Allow anonymous insert to responses" ON responses
    FOR INSERT TO anon WITH CHECK (true);

-- Insert a test guest:
-- INSERT INTO guests (slug, name, personalized_message) VALUES ('test-guest', 'John & Jane Doe', 'We would be honored to have you celebrate with us.');
