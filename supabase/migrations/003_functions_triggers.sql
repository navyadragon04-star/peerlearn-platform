-- =====================================================
-- DATABASE FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_rooms_updated_at BEFORE UPDATE ON study_rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON quizzes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_connections_updated_at BEFORE UPDATE ON connections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_calendar_updated_at BEFORE UPDATE ON study_calendar
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_personal_notes_updated_at BEFORE UPDATE ON personal_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTION: Update user's last_active timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_user_last_active()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users 
    SET last_active = NOW() 
    WHERE auth_id = auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Create notification
-- =====================================================
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_type notification_type,
    p_title TEXT,
    p_message TEXT,
    p_action_url TEXT DEFAULT NULL,
    p_action_data JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO notifications (user_id, type, title, message, action_url, action_data)
    VALUES (p_user_id, p_type, p_title, p_message, p_action_url, p_action_data)
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Handle new connection request
-- =====================================================
CREATE OR REPLACE FUNCTION handle_connection_request()
RETURNS TRIGGER AS $$
BEGIN
    -- Create notification for the connected user
    PERFORM create_notification(
        NEW.connected_user_id,
        'connection',
        'New Connection Request',
        (SELECT full_name FROM users WHERE id = NEW.user_id) || ' wants to connect with you',
        '/connections/requests',
        jsonb_build_object('connection_id', NEW.id, 'user_id', NEW.user_id)
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_connection_request AFTER INSERT ON connections
    FOR EACH ROW EXECUTE FUNCTION handle_connection_request();

-- =====================================================
-- FUNCTION: Handle connection acceptance
-- =====================================================
CREATE OR REPLACE FUNCTION handle_connection_accepted()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
        -- Notify the requester
        PERFORM create_notification(
            NEW.user_id,
            'connection',
            'Connection Accepted',
            (SELECT full_name FROM users WHERE id = NEW.connected_user_id) || ' accepted your connection request',
            '/profile/' || NEW.connected_user_id,
            jsonb_build_object('connection_id', NEW.id, 'user_id', NEW.connected_user_id)
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_connection_accepted AFTER UPDATE ON connections
    FOR EACH ROW EXECUTE FUNCTION handle_connection_accepted();

-- =====================================================
-- FUNCTION: Handle new message notification
-- =====================================================
CREATE OR REPLACE FUNCTION handle_new_message()
RETURNS TRIGGER AS $$
BEGIN
    -- For direct messages
    IF NEW.receiver_id IS NOT NULL THEN
        PERFORM create_notification(
            NEW.receiver_id,
            'message',
            'New Message',
            (SELECT full_name FROM users WHERE id = NEW.sender_id) || ' sent you a message',
            '/messages/' || NEW.sender_id,
            jsonb_build_object('message_id', NEW.id, 'sender_id', NEW.sender_id)
        );
    END IF;
    
    -- For room messages (notify all participants except sender)
    IF NEW.room_id IS NOT NULL THEN
        INSERT INTO notifications (user_id, type, title, message, action_url, action_data)
        SELECT 
            unnest(participants),
            'message',
            'New Room Message',
            (SELECT full_name FROM users WHERE id = NEW.sender_id) || ' sent a message in ' || (SELECT title FROM study_rooms WHERE id = NEW.room_id),
            '/rooms/' || NEW.room_id,
            jsonb_build_object('message_id', NEW.id, 'room_id', NEW.room_id, 'sender_id', NEW.sender_id)
        FROM study_rooms
        WHERE id = NEW.room_id
        AND unnest(participants) != NEW.sender_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_new_message AFTER INSERT ON messages
    FOR EACH ROW EXECUTE FUNCTION handle_new_message();

-- =====================================================
-- FUNCTION: Handle study room reminder
-- =====================================================
CREATE OR REPLACE FUNCTION send_study_room_reminders()
RETURNS void AS $$
BEGIN
    -- Send reminders for rooms starting in 15 minutes
    INSERT INTO notifications (user_id, type, title, message, action_url, action_data)
    SELECT 
        unnest(participants),
        'study_room',
        'Study Room Starting Soon',
        'Your study room "' || title || '" starts in 15 minutes',
        '/rooms/' || id,
        jsonb_build_object('room_id', id, 'scheduled_time', scheduled_time)
    FROM study_rooms
    WHERE status = 'scheduled'
    AND scheduled_time BETWEEN NOW() AND NOW() + INTERVAL '15 minutes'
    AND NOT EXISTS (
        SELECT 1 FROM notifications 
        WHERE action_data->>'room_id' = study_rooms.id::text 
        AND type = 'study_room'
        AND created_at > NOW() - INTERVAL '1 hour'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Update study streak
-- =====================================================
CREATE OR REPLACE FUNCTION update_study_streak(p_user_id UUID)
RETURNS void AS $$
DECLARE
    last_date DATE;
    current_streak INTEGER;
BEGIN
    SELECT last_study_date, study_streak INTO last_date, current_streak
    FROM users WHERE id = p_user_id;
    
    IF last_date = CURRENT_DATE THEN
        -- Already studied today, no change
        RETURN;
    ELSIF last_date = CURRENT_DATE - INTERVAL '1 day' THEN
        -- Studied yesterday, increment streak
        UPDATE users 
        SET study_streak = study_streak + 1,
            last_study_date = CURRENT_DATE
        WHERE id = p_user_id;
    ELSE
        -- Streak broken, reset to 1
        UPDATE users 
        SET study_streak = 1,
            last_study_date = CURRENT_DATE
        WHERE id = p_user_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Award achievement
-- =====================================================
CREATE OR REPLACE FUNCTION award_achievement(p_user_id UUID, p_achievement_name TEXT)
RETURNS void AS $$
DECLARE
    v_achievement_id UUID;
    v_points INTEGER;
BEGIN
    -- Get achievement details
    SELECT id, points INTO v_achievement_id, v_points
    FROM achievements WHERE name = p_achievement_name;
    
    -- Check if user already has this achievement
    IF NOT EXISTS (
        SELECT 1 FROM user_achievements 
        WHERE user_id = p_user_id AND achievement_id = v_achievement_id
    ) THEN
        -- Award achievement
        INSERT INTO user_achievements (user_id, achievement_id)
        VALUES (p_user_id, v_achievement_id);
        
        -- Add points to user
        UPDATE users 
        SET points = points + v_points,
            badges = array_append(badges, p_achievement_name)
        WHERE id = p_user_id;
        
        -- Notify user
        PERFORM create_notification(
            p_user_id,
            'achievement',
            'Achievement Unlocked!',
            'You earned the "' || p_achievement_name || '" achievement',
            '/profile/achievements',
            jsonb_build_object('achievement_id', v_achievement_id)
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Check and award achievements
-- =====================================================
CREATE OR REPLACE FUNCTION check_achievements(p_user_id UUID)
RETURNS void AS $$
DECLARE
    v_study_streak INTEGER;
    v_quizzes_completed INTEGER;
    v_materials_uploaded INTEGER;
    v_connections_count INTEGER;
BEGIN
    -- Get user stats
    SELECT study_streak INTO v_study_streak FROM users WHERE id = p_user_id;
    SELECT SUM(quizzes_completed) INTO v_quizzes_completed FROM progress WHERE user_id = p_user_id;
    SELECT COUNT(*) INTO v_materials_uploaded FROM materials WHERE uploader_id = p_user_id;
    SELECT COUNT(*) INTO v_connections_count FROM connections WHERE user_id = p_user_id AND status = 'accepted';
    
    -- Check streak achievements
    IF v_study_streak >= 7 THEN
        PERFORM award_achievement(p_user_id, 'Week Warrior');
    END IF;
    IF v_study_streak >= 30 THEN
        PERFORM award_achievement(p_user_id, 'Month Master');
    END IF;
    IF v_study_streak >= 100 THEN
        PERFORM award_achievement(p_user_id, 'Century Scholar');
    END IF;
    
    -- Check quiz achievements
    IF v_quizzes_completed >= 10 THEN
        PERFORM award_achievement(p_user_id, 'Quiz Novice');
    END IF;
    IF v_quizzes_completed >= 50 THEN
        PERFORM award_achievement(p_user_id, 'Quiz Expert');
    END IF;
    IF v_quizzes_completed >= 100 THEN
        PERFORM award_achievement(p_user_id, 'Quiz Master');
    END IF;
    
    -- Check content creator achievements
    IF v_materials_uploaded >= 5 THEN
        PERFORM award_achievement(p_user_id, 'Content Creator');
    END IF;
    IF v_materials_uploaded >= 25 THEN
        PERFORM award_achievement(p_user_id, 'Knowledge Sharer');
    END IF;
    
    -- Check social achievements
    IF v_connections_count >= 10 THEN
        PERFORM award_achievement(p_user_id, 'Social Butterfly');
    END IF;
    IF v_connections_count >= 50 THEN
        PERFORM award_achievement(p_user_id, 'Network Pro');
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Search students
-- =====================================================
CREATE OR REPLACE FUNCTION search_students(
    search_query TEXT,
    filter_institution TEXT DEFAULT NULL,
    filter_course TEXT DEFAULT NULL,
    filter_year INTEGER DEFAULT NULL,
    limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    full_name TEXT,
    username TEXT,
    profile_picture TEXT,
    institution_name TEXT,
    course TEXT,
    year INTEGER,
    rating DECIMAL,
    is_verified BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.full_name,
        u.username,
        u.profile_picture,
        u.institution_name,
        u.course,
        u.year,
        u.rating,
        u.is_verified
    FROM users u
    WHERE u.is_active = TRUE
    AND (
        search_query IS NULL OR
        search_query = '' OR
        to_tsvector('english', u.full_name || ' ' || COALESCE(u.username, '') || ' ' || u.institution_name || ' ' || u.course) 
        @@ plainto_tsquery('english', search_query)
    )
    AND (filter_institution IS NULL OR u.institution_name ILIKE '%' || filter_institution || '%')
    AND (filter_course IS NULL OR u.course ILIKE '%' || filter_course || '%')
    AND (filter_year IS NULL OR u.year = filter_year)
    ORDER BY u.rating DESC, u.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Get recommended peers
-- =====================================================
CREATE OR REPLACE FUNCTION get_recommended_peers(p_user_id UUID, limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    full_name TEXT,
    username TEXT,
    profile_picture TEXT,
    institution_name TEXT,
    course TEXT,
    year INTEGER,
    common_subjects INTEGER,
    common_interests INTEGER,
    rating DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    WITH user_data AS (
        SELECT subjects, interests, institution_name, course
        FROM users WHERE id = p_user_id
    )
    SELECT 
        u.id,
        u.full_name,
        u.username,
        u.profile_picture,
        u.institution_name,
        u.course,
        u.year,
        (SELECT COUNT(*) FROM unnest(u.subjects) s WHERE s = ANY((SELECT subjects FROM user_data)))::INTEGER as common_subjects,
        (SELECT COUNT(*) FROM unnest(u.interests) i WHERE i = ANY((SELECT interests FROM user_data)))::INTEGER as common_interests,
        u.rating
    FROM users u, user_data ud
    WHERE u.id != p_user_id
    AND u.is_active = TRUE
    AND u.institution_name = ud.institution_name
    AND u.course = ud.course
    AND NOT EXISTS (
        SELECT 1 FROM connections 
        WHERE (user_id = p_user_id AND connected_user_id = u.id)
        OR (user_id = u.id AND connected_user_id = p_user_id)
    )
    ORDER BY 
        (SELECT COUNT(*) FROM unnest(u.subjects) s WHERE s = ANY((SELECT subjects FROM user_data))) DESC,
        (SELECT COUNT(*) FROM unnest(u.interests) i WHERE i = ANY((SELECT interests FROM user_data))) DESC,
        u.rating DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Update material stats on download
-- =====================================================
CREATE OR REPLACE FUNCTION increment_material_downloads(p_material_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE materials 
    SET downloads = downloads + 1
    WHERE id = p_material_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Update room participant count
-- =====================================================
CREATE OR REPLACE FUNCTION update_room_participant_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE study_rooms
    SET current_participants = array_length(participants, 1)
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_room_participants_change AFTER UPDATE OF participants ON study_rooms
    FOR EACH ROW EXECUTE FUNCTION update_room_participant_count();
