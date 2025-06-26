-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_comments_track_id ON comments(track_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- Add some sample comments
INSERT INTO comments (user_id, track_id, content, created_at)
SELECT
  (SELECT id FROM users ORDER BY RANDOM() LIMIT 1),
  (SELECT id FROM tracks ORDER BY RANDOM() LIMIT 1),
  CASE floor(random() * 5)
    WHEN 0 THEN 'عالی بود! خیلی لذت بردم.'
    WHEN 1 THEN 'ریتم فوق‌العاده‌ای داره، دمت گرم.'
    WHEN 2 THEN 'این ترک رو خیلی دوست دارم، کار بعدیت کی منتشر میشه؟'
    WHEN 3 THEN 'صدای خیلی خوبی داری، منتظر کارهای بعدیت هستم.'
    ELSE 'یکی از بهترین ترک‌هایی که تا حالا شنیدم!'
  END,
  NOW() - (random() * interval '30 days')
FROM generate_series(1, 20);
