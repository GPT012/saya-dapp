-- Insert sample users
INSERT INTO users (wallet_address, username, display_name, bio, verified) VALUES
('0x1234567890123456789012345678901234567890', 'ali_music', 'علی محمدی', 'تولیدکننده موزیک الکترونیک', true),
('0x2345678901234567890123456789012345678901', 'sara_beats', 'سارا احمدی', 'خواننده پاپ', false),
('0x3456789012345678901234567890123456789012', 'reza_sound', 'رضا کریمی', 'آهنگساز و تنظیم‌کننده', true),
('0x4567890123456789012345678901234567890123', 'mina_music', 'مینا رضایی', 'خواننده راک', false),
('0x5678901234567890123456789012345678901234', 'ahmad_rap', 'احمد حسینی', 'رپر', false);

-- Insert sample tracks
INSERT INTO tracks (user_id, title, artist_name, description, genre, duration, ipfs_hash, metadata_hash, cover_image_hash, price_eth, play_count, like_count) VALUES
((SELECT id FROM users WHERE username = 'ali_music'), 'Digital Dreams', 'علی محمدی', 'ترک الکترونیک با الهام از آینده', 'Electronic', 240, 'QmX1Y2Z3...', 'QmA1B2C3...', 'QmD1E2F3...', 0.5, 1234, 89),
((SELECT id FROM users WHERE username = 'sara_beats'), 'Neon Nights', 'سارا احمدی', 'آهنگ پاپ شاد و انرژی‌بخش', 'Pop', 180, 'QmY2Z3A4...', 'QmB2C3D4...', 'QmE2F3G4...', 0.3, 987, 67),
((SELECT id FROM users WHERE username = 'reza_sound'), 'Cosmic Journey', 'رضا کریمی', 'سفری در اعماق کهکشان', 'Ambient', 320, 'QmZ3A4B5...', 'QmC3D4E5...', 'QmF3G4H5...', 0.8, 2156, 145),
((SELECT id FROM users WHERE username = 'mina_music'), 'Urban Pulse', 'مینا رضایی', 'ریتم شهری با صدای قدرتمند', 'Rock', 200, 'QmA4B5C6...', 'QmD4E5F6...', 'QmG4H5I6...', 0.4, 876, 54),
((SELECT id FROM users WHERE username = 'ahmad_rap'), 'Street Stories', 'احمد حسینی', 'داستان‌های خیابان', 'Hip-Hop', 195, 'QmB5C6D7...', 'QmE5F6G7...', 'QmH5I6J7...', 0.25, 1543, 92);

-- Insert sample likes
INSERT INTO likes (user_id, track_id) VALUES
((SELECT id FROM users WHERE username = 'sara_beats'), (SELECT id FROM tracks WHERE title = 'Digital Dreams')),
((SELECT id FROM users WHERE username = 'reza_sound'), (SELECT id FROM tracks WHERE title = 'Digital Dreams')),
((SELECT id FROM users WHERE username = 'ali_music'), (SELECT id FROM tracks WHERE title = 'Neon Nights')),
((SELECT id FROM users WHERE username = 'mina_music'), (SELECT id FROM tracks WHERE title = 'Cosmic Journey')),
((SELECT id FROM users WHERE username = 'ahmad_rap'), (SELECT id FROM tracks WHERE title = 'Urban Pulse'));

-- Insert sample plays (recent plays for realistic data)
INSERT INTO plays (user_id, track_id, ip_address) 
SELECT 
  (SELECT id FROM users ORDER BY RANDOM() LIMIT 1),
  (SELECT id FROM tracks ORDER BY RANDOM() LIMIT 1),
  ('192.168.1.' || (RANDOM() * 255)::INT)::INET
FROM generate_series(1, 100);

-- Insert sample follows
INSERT INTO follows (follower_id, following_id) VALUES
((SELECT id FROM users WHERE username = 'sara_beats'), (SELECT id FROM users WHERE username = 'ali_music')),
((SELECT id FROM users WHERE username = 'reza_sound'), (SELECT id FROM users WHERE username = 'ali_music')),
((SELECT id FROM users WHERE username = 'mina_music'), (SELECT id FROM users WHERE username = 'sara_beats')),
((SELECT id FROM users WHERE username = 'ahmad_rap'), (SELECT id FROM users WHERE username = 'reza_sound'));
