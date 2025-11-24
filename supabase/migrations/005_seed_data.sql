-- =====================================================
-- SEED DATA FOR DEVELOPMENT
-- =====================================================

-- Insert default achievements
INSERT INTO achievements (name, description, icon, category, requirement_type, requirement_value, points) VALUES
-- Streak Achievements
('Week Warrior', 'Maintain a 7-day study streak', '🔥', 'streak', 'streak', 7, 100),
('Month Master', 'Maintain a 30-day study streak', '🏆', 'streak', 'streak', 30, 500),
('Century Scholar', 'Maintain a 100-day study streak', '👑', 'streak', 'streak', 100, 2000),

-- Quiz Achievements
('Quiz Novice', 'Complete 10 quizzes', '📝', 'study', 'count', 10, 50),
('Quiz Expert', 'Complete 50 quizzes', '🎓', 'study', 'count', 50, 250),
('Quiz Master', 'Complete 100 quizzes', '🧠', 'study', 'count', 100, 1000),
('Perfect Score', 'Get 100% on any quiz', '💯', 'study', 'score', 100, 200),

-- Content Creation Achievements
('First Upload', 'Upload your first study material', '📤', 'content', 'count', 1, 25),
('Content Creator', 'Upload 5 study materials', '✍️', 'content', 'count', 5, 100),
('Knowledge Sharer', 'Upload 25 study materials', '📚', 'content', 'count', 25, 500),
('Content King', 'Upload 100 study materials', '👑', 'content', 'count', 100, 2000),

-- Social Achievements
('First Connection', 'Make your first connection', '🤝', 'social', 'count', 1, 25),
('Social Butterfly', 'Connect with 10 students', '🦋', 'social', 'count', 10, 100),
('Network Pro', 'Connect with 50 students', '🌐', 'social', 'count', 50, 500),
('Community Leader', 'Connect with 100 students', '⭐', 'social', 'count', 100, 1000),

-- Study Room Achievements
('Room Starter', 'Host your first study room', '🚀', 'study', 'count', 1, 50),
('Study Leader', 'Host 10 study rooms', '👨‍🏫', 'study', 'count', 10, 200),
('Room Regular', 'Attend 25 study rooms', '📅', 'study', 'count', 25, 300),

-- Learning Achievements
('Early Bird', 'Study before 6 AM', '🌅', 'study', 'count', 1, 50),
('Night Owl', 'Study after 10 PM', '🦉', 'study', 'count', 1, 50),
('Weekend Warrior', 'Study on weekends', '⚔️', 'study', 'count', 1, 50),

-- Engagement Achievements
('Helpful Peer', 'Receive 10 five-star ratings', '⭐', 'social', 'count', 10, 200),
('Top Contributor', 'Earn 1000 points', '🏅', 'study', 'count', 1000, 500),
('Legend', 'Earn 10000 points', '🌟', 'study', 'count', 10000, 2000);

-- Insert sample subjects (common across institutions)
-- This can be used for autocomplete/suggestions
CREATE TABLE IF NOT EXISTS subjects_catalog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO subjects_catalog (name, category, icon) VALUES
-- Computer Science
('Data Structures', 'Computer Science', '🗂️'),
('Algorithms', 'Computer Science', '🧮'),
('Database Management', 'Computer Science', '💾'),
('Operating Systems', 'Computer Science', '💻'),
('Computer Networks', 'Computer Science', '🌐'),
('Web Development', 'Computer Science', '🌍'),
('Mobile Development', 'Computer Science', '📱'),
('Machine Learning', 'Computer Science', '🤖'),
('Artificial Intelligence', 'Computer Science', '🧠'),
('Cybersecurity', 'Computer Science', '🔒'),

-- Mathematics
('Calculus', 'Mathematics', '📐'),
('Linear Algebra', 'Mathematics', '📊'),
('Discrete Mathematics', 'Mathematics', '🔢'),
('Statistics', 'Mathematics', '📈'),
('Probability', 'Mathematics', '🎲'),

-- Physics
('Classical Mechanics', 'Physics', '⚛️'),
('Electromagnetism', 'Physics', '⚡'),
('Quantum Physics', 'Physics', '🌌'),
('Thermodynamics', 'Physics', '🌡️'),

-- Chemistry
('Organic Chemistry', 'Chemistry', '🧪'),
('Inorganic Chemistry', 'Chemistry', '⚗️'),
('Physical Chemistry', 'Chemistry', '🔬'),

-- Business
('Marketing', 'Business', '📢'),
('Finance', 'Business', '💰'),
('Accounting', 'Business', '📊'),
('Management', 'Business', '👔'),
('Economics', 'Business', '💹'),

-- Engineering
('Electrical Engineering', 'Engineering', '⚡'),
('Mechanical Engineering', 'Engineering', '⚙️'),
('Civil Engineering', 'Engineering', '🏗️'),
('Chemical Engineering', 'Engineering', '🧪'),

-- Languages
('English', 'Languages', '🇬🇧'),
('Spanish', 'Languages', '🇪🇸'),
('French', 'Languages', '🇫🇷'),
('German', 'Languages', '🇩🇪'),
('Mandarin', 'Languages', '🇨🇳'),

-- Others
('Psychology', 'Social Sciences', '🧠'),
('Sociology', 'Social Sciences', '👥'),
('History', 'Humanities', '📜'),
('Philosophy', 'Humanities', '💭'),
('Biology', 'Life Sciences', '🧬'),
('Environmental Science', 'Life Sciences', '🌱');

-- Create a view for popular study materials
CREATE OR REPLACE VIEW popular_materials AS
SELECT 
    m.*,
    u.full_name as uploader_name,
    u.profile_picture as uploader_picture,
    u.rating as uploader_rating
FROM materials m
JOIN users u ON m.uploader_id = u.id
WHERE m.is_active = TRUE
ORDER BY m.downloads DESC, m.rating DESC, m.created_at DESC
LIMIT 50;

-- Create a view for upcoming study rooms
CREATE OR REPLACE VIEW upcoming_study_rooms AS
SELECT 
    sr.*,
    u.full_name as host_name,
    u.profile_picture as host_picture,
    u.rating as host_rating
FROM study_rooms sr
JOIN users u ON sr.host_id = u.id
WHERE sr.status = 'scheduled'
AND sr.scheduled_time > NOW()
ORDER BY sr.scheduled_time ASC;

-- Create a view for trending quizzes
CREATE OR REPLACE VIEW trending_quizzes AS
SELECT 
    q.*,
    u.full_name as creator_name,
    u.profile_picture as creator_picture
FROM quizzes q
JOIN users u ON q.creator_id = u.id
WHERE q.is_active = TRUE
ORDER BY q.attempts DESC, q.created_at DESC
LIMIT 50;

-- Create a view for user leaderboard
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
    u.id,
    u.full_name,
    u.username,
    u.profile_picture,
    u.institution_name,
    u.course,
    u.year,
    u.points,
    u.study_streak,
    u.rating,
    u.level,
    RANK() OVER (ORDER BY u.points DESC) as rank
FROM users u
WHERE u.is_active = TRUE
ORDER BY u.points DESC
LIMIT 100;

-- Create indexes on commonly queried fields
CREATE INDEX IF NOT EXISTS idx_materials_popular ON materials(downloads DESC, rating DESC) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_study_rooms_upcoming ON study_rooms(scheduled_time ASC) WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS idx_quizzes_trending ON quizzes(attempts DESC) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_users_leaderboard ON users(points DESC) WHERE is_active = TRUE;
