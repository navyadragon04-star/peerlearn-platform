import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Client-side Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Client component Supabase client
export const createClient = () => {
  return createClientComponentClient();
};

// Server component Supabase client
export const createServerClient = () => {
  return createServerComponentClient({ cookies });
};

// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string | null;
          phone: string | null;
          auth_id: string;
          full_name: string;
          username: string | null;
          profile_picture: string | null;
          bio: string | null;
          date_of_birth: string | null;
          institution_type: 'school' | 'college' | 'university';
          institution_name: string;
          course: string;
          year: number;
          subjects: string[];
          interests: string[];
          is_verified: boolean;
          verification_documents: string[];
          rating: number;
          total_reviews: number;
          points: number;
          study_streak: number;
          last_study_date: string | null;
          badges: string[];
          level: number;
          dark_mode: boolean;
          notification_preferences: any;
          privacy_settings: any;
          created_at: string;
          updated_at: string;
          last_active: string;
          is_active: boolean;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      study_rooms: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          subject: string;
          tags: string[];
          host_id: string;
          scheduled_time: string;
          duration: number;
          is_recurring: boolean;
          recurrence_pattern: string | null;
          timezone: string;
          room_type: 'public' | 'private' | 'paid';
          max_participants: number;
          current_participants: number;
          price: number;
          password: string | null;
          status: 'scheduled' | 'live' | 'ended' | 'cancelled';
          room_link: string | null;
          meeting_id: string | null;
          recording_url: string | null;
          participants: string[];
          moderators: string[];
          banned_users: string[];
          created_at: string;
          updated_at: string;
          started_at: string | null;
          ended_at: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string | null;
          room_id: string | null;
          message_type: 'text' | 'file' | 'image' | 'video' | 'audio';
          content: string | null;
          file_url: string | null;
          file_name: string | null;
          file_size: number | null;
          thumbnail_url: string | null;
          is_read: boolean;
          is_edited: boolean;
          is_deleted: boolean;
          reactions: any;
          reply_to: string | null;
          sent_at: string;
          edited_at: string | null;
          read_at: string | null;
        };
      };
      materials: {
        Row: {
          id: string;
          uploader_id: string;
          title: string;
          description: string | null;
          subject: string;
          tags: string[];
          file_type: 'pdf' | 'doc' | 'docx' | 'ppt' | 'pptx' | 'image' | 'video' | 'audio';
          file_url: string;
          file_size: number;
          thumbnail_url: string | null;
          page_count: number | null;
          is_paid: boolean;
          price: number;
          is_public: boolean;
          downloads: number;
          views: number;
          rating: number;
          total_ratings: number;
          created_at: string;
          updated_at: string;
          is_active: boolean;
        };
      };
      quizzes: {
        Row: {
          id: string;
          creator_id: string;
          title: string;
          description: string | null;
          subject: string;
          tags: string[];
          quiz_type: string;
          difficulty: 'easy' | 'medium' | 'hard';
          time_limit: number | null;
          passing_score: number;
          questions: any;
          total_questions: number;
          total_points: number;
          is_public: boolean;
          is_paid: boolean;
          price: number;
          attempts: number;
          average_score: number;
          created_at: string;
          updated_at: string;
          is_active: boolean;
        };
      };
      connections: {
        Row: {
          id: string;
          user_id: string;
          connected_user_id: string;
          connection_type: 'peer' | 'mentor' | 'mentee';
          status: 'pending' | 'accepted' | 'rejected' | 'blocked';
          message: string | null;
          requested_at: string;
          responded_at: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: 'study_room' | 'message' | 'connection' | 'reminder' | 'achievement' | 'system';
          title: string;
          message: string;
          action_url: string | null;
          action_data: any;
          is_read: boolean;
          read_at: string | null;
          created_at: string;
          expires_at: string | null;
        };
      };
    };
  };
};
