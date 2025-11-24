-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search

-- Create custom types
CREATE TYPE institution_type AS ENUM ('school', 'college', 'university');
CREATE TYPE room_type AS ENUM ('public', 'private', 'paid');
CREATE TYPE room_status AS ENUM ('scheduled', 'live', 'ended', 'cancelled');
CREATE TYPE message_type AS ENUM ('text', 'file', 'image', 'video', 'audio');
CREATE TYPE file_type AS ENUM ('pdf', 'doc', 'docx', 'ppt', 'pptx', 'image', 'video', 'audio');
CREATE TYPE connection_type AS ENUM ('peer', 'mentor', 'mentee');
CREATE TYPE connection_status AS ENUM ('pending', 'accepted', 'rejected', 'blocked');
CREATE TYPE notification_type AS ENUM ('study_room', 'message', 'connection', 'reminder', 'achievement', 'system');
CREATE TYPE quiz_difficulty AS ENUM ('easy', 'medium', 'hard');

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Authentication
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic Info
    full_name TEXT NOT NULL,
    username TEXT UNIQUE,
    profile_picture TEXT,
    bio TEXT,
    date_of_birth DATE,
    
    -- Academic Details
    institution_type institution_type NOT NULL,
    institution_name TEXT NOT NULL,
    course TEXT NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1 AND year <= 10),
    subjects TEXT[] DEFAULT '{}',
    interests TEXT[] DEFAULT '{}',
    
    -- Verification & Trust
    is_verified BOOLEAN DEFAULT FALSE,
    verification_documents TEXT[] DEFAULT '{}',
    rating DECIMAL(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    total_reviews INTEGER DEFAULT 0,
    
    -- Gamification
    points INTEGER DEFAULT 0,
    study_streak INTEGER DEFAULT 0,
    last_study_date DATE,
    badges TEXT[] DEFAULT '{}',
    level INTEGER DEFAULT 1,
    
    -- Settings
    dark_mode BOOLEAN DEFAULT FALSE,
    notification_preferences JSONB DEFAULT '{"email": true, "push": true, "study_reminders": true}'::jsonb,
    privacy_settings JSONB DEFAULT '{"profile_visible": true, "show_email": false, "show_phone": false}'::jsonb,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_active TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    
    CONSTRAINT email_or_phone_required CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- =====================================================
-- STUDY ROOMS TABLE
-- =====================================================
CREATE TABLE study_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic Info
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Scheduling
    scheduled_time TIMESTAMPTZ NOT NULL,
    duration INTEGER NOT NULL CHECK (duration > 0), -- in minutes
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern TEXT, -- cron-like pattern
    timezone TEXT DEFAULT 'UTC',
    
    -- Access Control
    room_type room_type DEFAULT 'public',
    max_participants INTEGER DEFAULT 50,
    current_participants INTEGER DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0.0,
    password TEXT, -- for private rooms
    
    -- Room Details
    status room_status DEFAULT 'scheduled',
    room_link TEXT,
    meeting_id TEXT,
    recording_url TEXT,
    
    -- Participants
    participants UUID[] DEFAULT '{}',
    moderators UUID[] DEFAULT '{}',
    banned_users UUID[] DEFAULT '{}',
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ
);

-- =====================================================
-- MESSAGES TABLE (Real-time Chat)
-- =====================================================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Participants
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL for room messages
    room_id UUID REFERENCES study_rooms(id) ON DELETE CASCADE, -- NULL for direct messages
    
    -- Message Content
    message_type message_type DEFAULT 'text',
    content TEXT,
    file_url TEXT,
    file_name TEXT,
    file_size INTEGER,
    thumbnail_url TEXT,
    
    -- Message Status
    is_read BOOLEAN DEFAULT FALSE,
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    -- Reactions & Replies
    reactions JSONB DEFAULT '{}'::jsonb, -- {emoji: [user_ids]}
    reply_to UUID REFERENCES messages(id) ON DELETE SET NULL,
    
    -- Metadata
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    edited_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    
    CONSTRAINT message_destination CHECK (
        (receiver_id IS NOT NULL AND room_id IS NULL) OR 
        (receiver_id IS NULL AND room_id IS NOT NULL)
    )
);

-- =====================================================
-- MATERIALS TABLE (Notes & Documents)
-- =====================================================
CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Uploader Info
    uploader_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Material Details
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    
    -- File Details
    file_type file_type NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    thumbnail_url TEXT,
    page_count INTEGER, -- for documents
    
    -- Access Control
    is_paid BOOLEAN DEFAULT FALSE,
    price DECIMAL(10,2) DEFAULT 0.0,
    is_public BOOLEAN DEFAULT TRUE,
    
    -- Engagement Metrics
    downloads INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_ratings INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- =====================================================
-- QUIZZES TABLE
-- =====================================================
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Creator Info
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Quiz Details
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    
    -- Quiz Configuration
    quiz_type TEXT DEFAULT 'user_created', -- 'platform' or 'user_created'
    difficulty quiz_difficulty DEFAULT 'medium',
    time_limit INTEGER, -- in minutes, NULL for no limit
    passing_score INTEGER DEFAULT 60, -- percentage
    
    -- Questions (stored as JSONB)
    questions JSONB NOT NULL, -- [{question, options, correct_answer, explanation, points}]
    total_questions INTEGER NOT NULL,
    total_points INTEGER NOT NULL,
    
    -- Access Control
    is_public BOOLEAN DEFAULT TRUE,
    is_paid BOOLEAN DEFAULT FALSE,
    price DECIMAL(10,2) DEFAULT 0.0,
    
    -- Engagement
    attempts INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0.0,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- =====================================================
-- QUIZ ATTEMPTS TABLE
-- =====================================================
CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Attempt Details
    answers JSONB NOT NULL, -- [{question_id, selected_answer, is_correct, points_earned}]
    score DECIMAL(5,2) NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    time_taken INTEGER, -- in seconds
    
    -- Status
    is_passed BOOLEAN NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CONNECTIONS TABLE (Student Network)
-- =====================================================
CREATE TABLE connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    connected_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    connection_type connection_type DEFAULT 'peer',
    status connection_status DEFAULT 'pending',
    
    -- Request Details
    message TEXT, -- optional message with connection request
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    responded_at TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT no_self_connection CHECK (user_id != connected_user_id),
    CONSTRAINT unique_connection UNIQUE (user_id, connected_user_id)
);

-- =====================================================
-- BOOKMARKS TABLE
-- =====================================================
CREATE TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Polymorphic reference
    item_type TEXT NOT NULL, -- 'material', 'quiz', 'study_room', 'user'
    item_id UUID NOT NULL,
    
    -- Organization
    folder TEXT DEFAULT 'default',
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_bookmark UNIQUE (user_id, item_type, item_id)
);

-- =====================================================
-- PROGRESS TRACKER TABLE
-- =====================================================
CREATE TABLE progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    
    -- Activity Metrics
    quizzes_completed INTEGER DEFAULT 0,
    quizzes_passed INTEGER DEFAULT 0,
    study_hours DECIMAL(10,2) DEFAULT 0.0,
    materials_studied INTEGER DEFAULT 0,
    study_rooms_attended INTEGER DEFAULT 0,
    
    -- Goals
    weekly_goal INTEGER DEFAULT 10, -- hours
    monthly_goal INTEGER DEFAULT 40, -- hours
    
    -- Performance
    average_quiz_score DECIMAL(5,2) DEFAULT 0.0,
    improvement_rate DECIMAL(5,2) DEFAULT 0.0,
    
    -- Metadata
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_user_subject UNIQUE (user_id, subject)
);

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification Details
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    
    -- Action
    action_url TEXT,
    action_data JSONB,
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- =====================================================
-- STUDY CALENDAR TABLE
-- =====================================================
CREATE TABLE study_calendar (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Event Details
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT NOT NULL, -- 'study_session', 'exam', 'assignment', 'reminder'
    subject TEXT,
    
    -- Timing
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    is_all_day BOOLEAN DEFAULT FALSE,
    
    -- Recurrence
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule TEXT, -- iCal RRULE format
    
    -- Reminders
    reminders INTEGER[] DEFAULT '{15, 60}', -- minutes before event
    
    -- Related Items
    related_room_id UUID REFERENCES study_rooms(id) ON DELETE SET NULL,
    related_quiz_id UUID REFERENCES quizzes(id) ON DELETE SET NULL,
    
    -- Status
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- =====================================================
-- PERSONAL NOTES TABLE
-- =====================================================
CREATE TABLE personal_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Note Details
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    subject TEXT,
    tags TEXT[] DEFAULT '{}',
    
    -- Organization
    folder TEXT DEFAULT 'default',
    is_favorite BOOLEAN DEFAULT FALSE,
    
    -- Collaboration
    is_shared BOOLEAN DEFAULT FALSE,
    shared_with UUID[] DEFAULT '{}',
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_edited_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ACHIEVEMENTS TABLE
-- =====================================================
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Achievement Details
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    category TEXT NOT NULL, -- 'study', 'social', 'content', 'streak'
    
    -- Requirements
    requirement_type TEXT NOT NULL, -- 'count', 'streak', 'score'
    requirement_value INTEGER NOT NULL,
    
    -- Rewards
    points INTEGER DEFAULT 0,
    badge_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- USER ACHIEVEMENTS TABLE
-- =====================================================
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_user_achievement UNIQUE (user_id, achievement_id)
);

-- =====================================================
-- PAYMENTS TABLE (for paid content)
-- =====================================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Payment Details
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    payment_method TEXT NOT NULL, -- 'card', 'upi', 'wallet'
    transaction_id TEXT UNIQUE NOT NULL,
    
    -- Item Details
    item_type TEXT NOT NULL, -- 'material', 'quiz', 'study_room'
    item_id UUID NOT NULL,
    
    -- Status
    status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
    payment_gateway TEXT, -- 'stripe', 'razorpay', etc.
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_institution ON users(institution_name);
CREATE INDEX idx_users_course ON users(course);
CREATE INDEX idx_users_subjects ON users USING GIN(subjects);

CREATE INDEX idx_study_rooms_host ON study_rooms(host_id);
CREATE INDEX idx_study_rooms_scheduled_time ON study_rooms(scheduled_time);
CREATE INDEX idx_study_rooms_status ON study_rooms(status);
CREATE INDEX idx_study_rooms_subject ON study_rooms(subject);

CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_room ON messages(room_id);
CREATE INDEX idx_messages_sent_at ON messages(sent_at DESC);

CREATE INDEX idx_materials_uploader ON materials(uploader_id);
CREATE INDEX idx_materials_subject ON materials(subject);
CREATE INDEX idx_materials_tags ON materials USING GIN(tags);
CREATE INDEX idx_materials_created_at ON materials(created_at DESC);

CREATE INDEX idx_quizzes_creator ON quizzes(creator_id);
CREATE INDEX idx_quizzes_subject ON quizzes(subject);
CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);

CREATE INDEX idx_connections_user ON connections(user_id);
CREATE INDEX idx_connections_connected_user ON connections(connected_user_id);
CREATE INDEX idx_connections_status ON connections(status);

CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX idx_progress_user ON progress(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

CREATE INDEX idx_study_calendar_user ON study_calendar(user_id);
CREATE INDEX idx_study_calendar_start_time ON study_calendar(start_time);

CREATE INDEX idx_personal_notes_user ON personal_notes(user_id);
CREATE INDEX idx_payments_user ON payments(user_id);

-- Full-text search indexes
CREATE INDEX idx_users_search ON users USING GIN(to_tsvector('english', full_name || ' ' || COALESCE(username, '') || ' ' || institution_name || ' ' || course));
CREATE INDEX idx_materials_search ON materials USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || subject));
CREATE INDEX idx_quizzes_search ON quizzes USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || subject));
CREATE INDEX idx_study_rooms_search ON study_rooms USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || subject));
