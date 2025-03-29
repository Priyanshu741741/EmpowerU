-- This requires superuser privileges, so it's commented out
-- ALTER DATABASE postgres SET "app.jwt_secret" = 'your-jwt-secret';

-- Create custom types only if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'writer');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'post_status') THEN
    CREATE TYPE post_status AS ENUM ('draft', 'pending', 'published', 'rejected');
  END IF;
END
$$;

-- Drop and recreate tables if they exist
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  role user_role DEFAULT 'writer',
  full_name TEXT,
  email TEXT UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create posts table
CREATE TABLE posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  slug TEXT UNIQUE,
  author_id UUID REFERENCES users(id) NOT NULL,
  status post_status DEFAULT 'draft',
  category TEXT,
  cover_image TEXT,
  featured BOOLEAN DEFAULT false,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create comments table
CREATE TABLE comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create storage buckets for images if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'story-images') THEN
    INSERT INTO storage.buckets (id, name, public) VALUES ('story-images', 'story-images', true);
  END IF;
END
$$;

-- Set up Row Level Security (RLS) policies

-- Users table policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "API can insert users" ON users;
DROP POLICY IF EXISTS "Public can view users" ON users;

-- Add policies for users table
CREATE POLICY "Public can view users"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Add policy to allow insertion into the users table from API
CREATE POLICY "API can insert users"
  ON users FOR INSERT
  WITH CHECK (true);

-- Posts table policies
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Writers can create posts" ON posts;
DROP POLICY IF EXISTS "Public can view published posts" ON posts;
DROP POLICY IF EXISTS "Writers can view their own posts" ON posts;
DROP POLICY IF EXISTS "Admins can view all posts" ON posts;
DROP POLICY IF EXISTS "Writers can update their own draft/pending posts" ON posts;
DROP POLICY IF EXISTS "Admins can update any post" ON posts;
DROP POLICY IF EXISTS "Public can view all posts" ON posts;

-- Add policies for posts table
CREATE POLICY "Writers can create posts"
  ON posts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can insert posts"
  ON posts FOR INSERT
  WITH CHECK (true);

-- Update post viewing policy for wider access
CREATE POLICY "Public can view all posts"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Writers can view their own posts"
  ON posts FOR SELECT
  USING (auth.uid() = author_id);

-- Add policy for updating posts
CREATE POLICY "Writers can update their own draft/pending posts"
  ON posts FOR UPDATE
  USING (auth.uid() = author_id AND (status = 'draft' OR status = 'pending'));

CREATE POLICY "Admins can update any post"
  ON posts FOR UPDATE
  USING (true);

-- Comments table policies
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view comments on published posts" ON comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON comments;

-- Add policies for comments table
CREATE POLICY "Anyone can view comments on published posts"
  ON comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = comments.post_id
      AND posts.status = 'published'
    )
  );

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Users can update their own comments
CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id);

-- Storage policies for story images
-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can read story images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload story images" ON storage.objects;

-- Add storage policies
CREATE POLICY "Public can read story images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'story-images');

-- Update storage policy to allow public uploads
CREATE POLICY "Anyone can upload story images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'story-images');

-- Create functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();