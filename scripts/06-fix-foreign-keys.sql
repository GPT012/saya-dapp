-- Drop existing foreign key if it exists with wrong name
ALTER TABLE tracks DROP CONSTRAINT IF EXISTS tracks_user_id_fkey;

-- Add the foreign key constraint with the correct name that Supabase expects
ALTER TABLE tracks 
ADD CONSTRAINT tracks_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Do the same for other tables to ensure consistency
ALTER TABLE likes DROP CONSTRAINT IF EXISTS likes_user_id_fkey;
ALTER TABLE likes DROP CONSTRAINT IF EXISTS likes_track_id_fkey;

ALTER TABLE likes 
ADD CONSTRAINT likes_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE likes 
ADD CONSTRAINT likes_track_id_fkey 
FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE;

-- Fix plays table
ALTER TABLE plays DROP CONSTRAINT IF EXISTS plays_user_id_fkey;
ALTER TABLE plays DROP CONSTRAINT IF EXISTS plays_track_id_fkey;

ALTER TABLE plays 
ADD CONSTRAINT plays_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE plays 
ADD CONSTRAINT plays_track_id_fkey 
FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE;

-- Fix follows table
ALTER TABLE follows DROP CONSTRAINT IF EXISTS follows_follower_id_fkey;
ALTER TABLE follows DROP CONSTRAINT IF EXISTS follows_following_id_fkey;

ALTER TABLE follows 
ADD CONSTRAINT follows_follower_id_fkey 
FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE follows 
ADD CONSTRAINT follows_following_id_fkey 
FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE;

-- Fix comments table if it exists
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_user_id_fkey;
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_track_id_fkey;

ALTER TABLE comments 
ADD CONSTRAINT comments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE comments 
ADD CONSTRAINT comments_track_id_fkey 
FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE;
