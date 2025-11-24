-- =====================================================
-- STORAGE BUCKETS SETUP
-- =====================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
('avatars', 'avatars', true),
('materials', 'materials', false),
('thumbnails', 'thumbnails', true),
('room-recordings', 'room-recordings', false),
('chat-files', 'chat-files', false),
('verification-docs', 'verification-docs', false);

-- =====================================================
-- STORAGE POLICIES
-- =====================================================

-- Avatars bucket policies
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Materials bucket policies
CREATE POLICY "Users can view materials they have access to"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'materials' AND (
        -- Material is public
        EXISTS (
            SELECT 1 FROM materials m
            WHERE m.file_url = storage.objects.name
            AND m.is_public = TRUE
        )
        OR
        -- User is the uploader
        EXISTS (
            SELECT 1 FROM materials m
            JOIN users u ON m.uploader_id = u.id
            WHERE m.file_url = storage.objects.name
            AND u.auth_id = auth.uid()
        )
        OR
        -- User has purchased the material
        EXISTS (
            SELECT 1 FROM materials m
            JOIN payments p ON p.item_id = m.id
            JOIN users u ON p.user_id = u.id
            WHERE m.file_url = storage.objects.name
            AND p.item_type = 'material'
            AND p.status = 'completed'
            AND u.auth_id = auth.uid()
        )
    )
);

CREATE POLICY "Users can upload materials"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'materials' AND
    auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update their own materials"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'materials' AND
    EXISTS (
        SELECT 1 FROM materials m
        JOIN users u ON m.uploader_id = u.id
        WHERE m.file_url = storage.objects.name
        AND u.auth_id = auth.uid()
    )
);

CREATE POLICY "Users can delete their own materials"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'materials' AND
    EXISTS (
        SELECT 1 FROM materials m
        JOIN users u ON m.uploader_id = u.id
        WHERE m.file_url = storage.objects.name
        AND u.auth_id = auth.uid()
    )
);

-- Thumbnails bucket policies (public)
CREATE POLICY "Anyone can view thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'thumbnails');

CREATE POLICY "Users can upload thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'thumbnails' AND auth.uid() IS NOT NULL);

-- Room recordings policies
CREATE POLICY "Participants can view room recordings"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'room-recordings' AND
    EXISTS (
        SELECT 1 FROM study_rooms sr
        JOIN users u ON u.id = ANY(sr.participants) OR u.id = sr.host_id
        WHERE sr.recording_url = storage.objects.name
        AND u.auth_id = auth.uid()
    )
);

CREATE POLICY "Hosts can upload room recordings"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'room-recordings' AND auth.uid() IS NOT NULL);

-- Chat files policies
CREATE POLICY "Users can view chat files they have access to"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'chat-files' AND
    EXISTS (
        SELECT 1 FROM messages m
        JOIN users u ON u.id = m.sender_id OR u.id = m.receiver_id
        WHERE m.file_url = storage.objects.name
        AND u.auth_id = auth.uid()
    )
);

CREATE POLICY "Users can upload chat files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'chat-files' AND auth.uid() IS NOT NULL);

-- Verification documents policies
CREATE POLICY "Users can view their own verification docs"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'verification-docs' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload their own verification docs"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'verification-docs' AND
    auth.uid()::text = (storage.foldername(name))[1]
);
