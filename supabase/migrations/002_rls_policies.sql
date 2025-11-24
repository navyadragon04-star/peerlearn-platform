-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USERS TABLE POLICIES
-- =====================================================

-- Users can view all active profiles
CREATE POLICY "Users can view active profiles"
ON users FOR SELECT
USING (is_active = TRUE);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = auth_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
ON users FOR INSERT
WITH CHECK (auth.uid() = auth_id);

-- =====================================================
-- STUDY ROOMS POLICIES
-- =====================================================

-- Anyone can view public study rooms
CREATE POLICY "Anyone can view public study rooms"
ON study_rooms FOR SELECT
USING (room_type = 'public' OR host_id = auth.uid() OR auth.uid() = ANY(participants));

-- Users can create study rooms
CREATE POLICY "Users can create study rooms"
ON study_rooms FOR INSERT
WITH CHECK (auth.uid() = (SELECT auth_id FROM users WHERE id = host_id));

-- Hosts can update their own rooms
CREATE POLICY "Hosts can update own rooms"
ON study_rooms FOR UPDATE
USING (host_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Hosts can delete their own rooms
CREATE POLICY "Hosts can delete own rooms"
ON study_rooms FOR DELETE
USING (host_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- =====================================================
-- MESSAGES POLICIES
-- =====================================================

-- Users can view messages they sent or received
CREATE POLICY "Users can view their messages"
ON messages FOR SELECT
USING (
    sender_id = (SELECT id FROM users WHERE auth_id = auth.uid()) OR
    receiver_id = (SELECT id FROM users WHERE auth_id = auth.uid()) OR
    room_id IN (SELECT id FROM study_rooms WHERE auth.uid() = ANY(participants) OR host_id = (SELECT id FROM users WHERE auth_id = auth.uid()))
);

-- Users can send messages
CREATE POLICY "Users can send messages"
ON messages FOR INSERT
WITH CHECK (sender_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Users can update their own messages
CREATE POLICY "Users can update own messages"
ON messages FOR UPDATE
USING (sender_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Users can delete their own messages
CREATE POLICY "Users can delete own messages"
ON messages FOR DELETE
USING (sender_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- =====================================================
-- MATERIALS POLICIES
-- =====================================================

-- Users can view public materials or their own
CREATE POLICY "Users can view accessible materials"
ON materials FOR SELECT
USING (
    is_public = TRUE OR 
    uploader_id = (SELECT id FROM users WHERE auth_id = auth.uid()) OR
    id IN (SELECT item_id FROM payments WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid()) AND item_type = 'material' AND status = 'completed')
);

-- Users can upload materials
CREATE POLICY "Users can upload materials"
ON materials FOR INSERT
WITH CHECK (uploader_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Users can update their own materials
CREATE POLICY "Users can update own materials"
ON materials FOR UPDATE
USING (uploader_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Users can delete their own materials
CREATE POLICY "Users can delete own materials"
ON materials FOR DELETE
USING (uploader_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- =====================================================
-- QUIZZES POLICIES
-- =====================================================

-- Users can view public quizzes or their own
CREATE POLICY "Users can view accessible quizzes"
ON quizzes FOR SELECT
USING (
    is_public = TRUE OR 
    creator_id = (SELECT id FROM users WHERE auth_id = auth.uid()) OR
    id IN (SELECT item_id FROM payments WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid()) AND item_type = 'quiz' AND status = 'completed')
);

-- Users can create quizzes
CREATE POLICY "Users can create quizzes"
ON quizzes FOR INSERT
WITH CHECK (creator_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Users can update their own quizzes
CREATE POLICY "Users can update own quizzes"
ON quizzes FOR UPDATE
USING (creator_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Users can delete their own quizzes
CREATE POLICY "Users can delete own quizzes"
ON quizzes FOR DELETE
USING (creator_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- =====================================================
-- QUIZ ATTEMPTS POLICIES
-- =====================================================

-- Users can view their own quiz attempts
CREATE POLICY "Users can view own quiz attempts"
ON quiz_attempts FOR SELECT
USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Users can create quiz attempts
CREATE POLICY "Users can create quiz attempts"
ON quiz_attempts FOR INSERT
WITH CHECK (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- =====================================================
-- CONNECTIONS POLICIES
-- =====================================================

-- Users can view their connections
CREATE POLICY "Users can view their connections"
ON connections FOR SELECT
USING (
    user_id = (SELECT id FROM users WHERE auth_id = auth.uid()) OR
    connected_user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
);

-- Users can create connection requests
CREATE POLICY "Users can create connections"
ON connections FOR INSERT
WITH CHECK (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Users can update connections they're part of
CREATE POLICY "Users can update their connections"
ON connections FOR UPDATE
USING (
    user_id = (SELECT id FROM users WHERE auth_id = auth.uid()) OR
    connected_user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
);

-- Users can delete their connections
CREATE POLICY "Users can delete their connections"
ON connections FOR DELETE
USING (
    user_id = (SELECT id FROM users WHERE auth_id = auth.uid()) OR
    connected_user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
);

-- =====================================================
-- BOOKMARKS POLICIES
-- =====================================================

-- Users can view their own bookmarks
CREATE POLICY "Users can view own bookmarks"
ON bookmarks FOR SELECT
USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Users can create bookmarks
CREATE POLICY "Users can create bookmarks"
ON bookmarks FOR INSERT
WITH CHECK (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Users can update their own bookmarks
CREATE POLICY "Users can update own bookmarks"
ON bookmarks FOR UPDATE
USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
ON bookmarks FOR DELETE
USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- =====================================================
-- PROGRESS POLICIES
-- =====================================================

-- Users can view their own progress
CREATE POLICY "Users can view own progress"
ON progress FOR SELECT
USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Users can insert their own progress
CREATE POLICY "Users can insert own progress"
ON progress FOR INSERT
WITH CHECK (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Users can update their own progress
CREATE POLICY "Users can update own progress"
ON progress FOR UPDATE
USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- =====================================================
-- NOTIFICATIONS POLICIES
-- =====================================================

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
ON notifications FOR SELECT
USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- System can create notifications (handled by triggers/functions)
CREATE POLICY "System can create notifications"
ON notifications FOR INSERT
WITH CHECK (TRUE);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
ON notifications FOR UPDATE
USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
ON notifications FOR DELETE
USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- =====================================================
-- STUDY CALENDAR POLICIES
-- =====================================================

-- Users can view their own calendar
CREATE POLICY "Users can view own calendar"
ON study_calendar FOR SELECT
USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Users can create calendar events
CREATE POLICY "Users can create calendar events"
ON study_calendar FOR INSERT
WITH CHECK (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Users can update their own calendar events
CREATE POLICY "Users can update own calendar events"
ON study_calendar FOR UPDATE
USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Users can delete their own calendar events
CREATE POLICY "Users can delete own calendar events"
ON study_calendar FOR DELETE
USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- =====================================================
-- PERSONAL NOTES POLICIES
-- =====================================================

-- Users can view their own notes or shared notes
CREATE POLICY "Users can view accessible notes"
ON personal_notes FOR SELECT
USING (
    user_id = (SELECT id FROM users WHERE auth_id = auth.uid()) OR
    (SELECT id FROM users WHERE auth_id = auth.uid()) = ANY(shared_with)
);

-- Users can create notes
CREATE POLICY "Users can create notes"
ON personal_notes FOR INSERT
WITH CHECK (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Users can update their own notes
CREATE POLICY "Users can update own notes"
ON personal_notes FOR UPDATE
USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Users can delete their own notes
CREATE POLICY "Users can delete own notes"
ON personal_notes FOR DELETE
USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- =====================================================
-- ACHIEVEMENTS POLICIES
-- =====================================================

-- Everyone can view achievements
CREATE POLICY "Everyone can view achievements"
ON achievements FOR SELECT
USING (TRUE);

-- =====================================================
-- USER ACHIEVEMENTS POLICIES
-- =====================================================

-- Users can view all user achievements
CREATE POLICY "Users can view user achievements"
ON user_achievements FOR SELECT
USING (TRUE);

-- System can create user achievements (handled by triggers)
CREATE POLICY "System can create user achievements"
ON user_achievements FOR INSERT
WITH CHECK (TRUE);

-- =====================================================
-- PAYMENTS POLICIES
-- =====================================================

-- Users can view their own payments
CREATE POLICY "Users can view own payments"
ON payments FOR SELECT
USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Users can create payments
CREATE POLICY "Users can create payments"
ON payments FOR INSERT
WITH CHECK (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- System can update payment status
CREATE POLICY "System can update payments"
ON payments FOR UPDATE
USING (TRUE);
