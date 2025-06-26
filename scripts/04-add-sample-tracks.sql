-- Add more sample tracks with realistic IPFS hashes for testing
INSERT INTO tracks (user_id, title, artist_name, description, genre, duration, ipfs_hash, metadata_hash, cover_image_hash, price_eth, play_count, like_count) VALUES

-- Electronic tracks
((SELECT id FROM users WHERE username = 'ali_music'), 'Midnight Pulse', 'علی محمدی', 'ترک الکترونیک با ریتم قوی برای شب‌های شهری', 'Electronic', 195, 'QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51', 'QmMetadata1', 'QmCover1', 0.3, 2847, 156),

((SELECT id FROM users WHERE username = 'ali_music'), 'Cyber Dreams', 'علی محمدی', 'سفری در دنیای سایبری با صداهای فوتوریستیک', 'Electronic', 267, 'QmPChd6rxD3u2HoiQd9hs25TqJjvSTuPRxXp4Vkn5Vyche', 'QmMetadata2', 'QmCover2', 0.45, 1923, 98),

-- Pop tracks
((SELECT id FROM users WHERE username = 'sara_beats'), 'Summer Vibes', 'سارا احمدی', 'آهنگ شاد تابستانی با ملودی گیرا', 'Pop', 178, 'QmYHUwmBgBc7RqVzk4vNdTiEnwfnvMuBiLRXV5VHuDU9Af', 'QmMetadata3', 'QmCover3', 0.25, 3456, 234),

((SELECT id FROM users WHERE username = 'sara_beats'), 'Dancing Stars', 'سارا احمدی', 'برای رقص زیر ستاره‌ها ساخته شده', 'Pop', 203, 'QmQy9dDqZjQFfhSuBrxqdBnGXe4zVV2VeUi4Dh5anTcUML', 'QmMetadata4', 'QmCover4', 0.35, 2789, 187),

-- Ambient/Chill tracks
((SELECT id FROM users WHERE username = 'reza_sound'), 'Ocean Waves', 'رضا کریمی', 'آرامش اقیانوس در قالب موسیقی', 'Ambient', 312, 'QmWATWQ7fVPP2EFGu71UkfnqhYXDYH6zg8K6UVVY3raaLb', 'QmMetadata5', 'QmCover5', 0.6, 1567, 89),

((SELECT id FROM users WHERE username = 'reza_sound'), 'Forest Meditation', 'رضا کریمی', 'مدیتیشن در قلب جنگل', 'Ambient', 445, 'QmNfF8LjGnVvnRkQHh89NVZmBHLuVaUEZh2Rh2veqUPQoM', 'QmMetadata6', 'QmCover6', 0.8, 987, 67),

-- Rock tracks
((SELECT id FROM users WHERE username = 'mina_music'), 'Electric Storm', 'مینا رضایی', 'طوفان الکتریک با گیتار قدرتمند', 'Rock', 234, 'QmPpnEF6vvzvdzeqZqziZKLKqxpww3WcFtakwUWQcNyaea', 'QmMetadata7', 'QmCover7', 0.4, 2134, 145),

((SELECT id FROM users WHERE username = 'mina_music'), 'Rebel Heart', 'مینا رضایی', 'قلب یاغی که نمی‌شکند', 'Rock', 198, 'QmUNHjBdGgrhpHdcUhhGoOH4hXMSqBSoJ5hpNm2WPpw5x7', 'QmMetadata8', 'QmCover8', 0.35, 1876, 123),

-- Hip-Hop tracks
((SELECT id FROM users WHERE username = 'ahmad_rap'), 'City Lights', 'احمد حسینی', 'داستان شهر در شب‌های پرنور', 'Hip-Hop', 189, 'QmYjV5HpLqPQN9vPrswCWKe4GKAXgKFmChJgm8NZeaWxMJ', 'QmMetadata9', 'QmCover9', 0.3, 3245, 198),

((SELECT id FROM users WHERE username = 'ahmad_rap'), 'Underground Flow', 'احمد حسینی', 'فلوی زیرزمینی با کلمات قوی', 'Hip-Hop', 167, 'QmTrEPIR5ZtVwEBpqMjhPsfNuMiLiVy9eoHytbwxAqEGUj', 'QmMetadata10', 'QmCover10', 0.28, 2567, 156);

-- Update play counts and likes for existing tracks to make them more realistic
UPDATE tracks SET 
  play_count = play_count + FLOOR(RANDOM() * 1000) + 500,
  like_count = like_count + FLOOR(RANDOM() * 100) + 20
WHERE id IN (
  SELECT id FROM tracks LIMIT 5
);
