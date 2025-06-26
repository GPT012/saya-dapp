-- Function to increment play count
CREATE OR REPLACE FUNCTION increment_play_count(track_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE tracks 
  SET play_count = play_count + 1,
      updated_at = NOW()
  WHERE id = track_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment like count
CREATE OR REPLACE FUNCTION increment_like_count(track_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE tracks 
  SET like_count = like_count + 1,
      updated_at = NOW()
  WHERE id = track_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement like count
CREATE OR REPLACE FUNCTION decrement_like_count(track_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE tracks 
  SET like_count = GREATEST(like_count - 1, 0),
      updated_at = NOW()
  WHERE id = track_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get user follower count
CREATE OR REPLACE FUNCTION get_follower_count(user_id UUID)
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::integer
    FROM follows
    WHERE following_id = user_id
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get user track count
CREATE OR REPLACE FUNCTION get_track_count(user_id UUID)
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::integer
    FROM tracks
    WHERE user_id = user_id
  );
END;
$$ LANGUAGE plpgsql;
