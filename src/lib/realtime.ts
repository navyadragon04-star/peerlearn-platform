import { supabase } from './supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Subscribe to real-time messages in a study room
 */
export function subscribeToRoomMessages(
  roomId: string,
  callback: (message: any) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`room:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return channel;
}

/**
 * Subscribe to direct messages between two users
 */
export function subscribeToDirectMessages(
  userId: string,
  otherUserId: string,
  callback: (message: any) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`dm:${userId}:${otherUserId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `sender_id=eq.${otherUserId},receiver_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `sender_id=eq.${userId},receiver_id=eq.${otherUserId}`,
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return channel;
}

/**
 * Subscribe to study room participant updates
 */
export function subscribeToRoomParticipants(
  roomId: string,
  callback: (room: any) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`room-participants:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'study_rooms',
        filter: `id=eq.${roomId}`,
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return channel;
}

/**
 * Subscribe to user notifications
 */
export function subscribeToNotifications(
  userId: string,
  callback: (notification: any) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return channel;
}

/**
 * Subscribe to connection requests
 */
export function subscribeToConnectionRequests(
  userId: string,
  callback: (connection: any) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`connections:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'connections',
        filter: `connected_user_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'connections',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return channel;
}

/**
 * Subscribe to user presence in a study room
 */
export function subscribeToRoomPresence(
  roomId: string,
  userId: string,
  userName: string,
  onJoin: (users: any[]) => void,
  onLeave: (users: any[]) => void
): RealtimeChannel {
  const channel = supabase.channel(`presence:${roomId}`, {
    config: {
      presence: {
        key: userId,
      },
    },
  });

  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const users = Object.values(state).flat();
      onJoin(users);
    })
    .on('presence', { event: 'join' }, ({ newPresences }) => {
      onJoin(newPresences);
    })
    .on('presence', { event: 'leave' }, ({ leftPresences }) => {
      onLeave(leftPresences);
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user_id: userId,
          user_name: userName,
          online_at: new Date().toISOString(),
        });
      }
    });

  return channel;
}

/**
 * Unsubscribe from a channel
 */
export async function unsubscribe(channel: RealtimeChannel) {
  await supabase.removeChannel(channel);
}

/**
 * Send a message to a study room
 */
export async function sendRoomMessage(
  roomId: string,
  senderId: string,
  content: string,
  messageType: 'text' | 'file' | 'image' | 'video' | 'audio' = 'text',
  fileUrl?: string,
  fileName?: string,
  fileSize?: number
) {
  const { data, error } = await supabase.from('messages').insert({
    room_id: roomId,
    sender_id: senderId,
    content,
    message_type: messageType,
    file_url: fileUrl,
    file_name: fileName,
    file_size: fileSize,
  }).select().single();

  if (error) throw error;
  return data;
}

/**
 * Send a direct message
 */
export async function sendDirectMessage(
  senderId: string,
  receiverId: string,
  content: string,
  messageType: 'text' | 'file' | 'image' | 'video' | 'audio' = 'text',
  fileUrl?: string,
  fileName?: string,
  fileSize?: number
) {
  const { data, error } = await supabase.from('messages').insert({
    sender_id: senderId,
    receiver_id: receiverId,
    content,
    message_type: messageType,
    file_url: fileUrl,
    file_name: fileName,
    file_size: fileSize,
  }).select().single();

  if (error) throw error;
  return data;
}

/**
 * Mark message as read
 */
export async function markMessageAsRead(messageId: string) {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', messageId);

  if (error) throw error;
}

/**
 * Join a study room
 */
export async function joinStudyRoom(roomId: string, userId: string) {
  // Get current participants
  const { data: room, error: fetchError } = await supabase
    .from('study_rooms')
    .select('participants, max_participants')
    .eq('id', roomId)
    .single();

  if (fetchError) throw fetchError;

  // Check if room is full
  if (room.participants.length >= room.max_participants) {
    throw new Error('Room is full');
  }

  // Check if user is already in the room
  if (room.participants.includes(userId)) {
    return room;
  }

  // Add user to participants
  const { data, error } = await supabase
    .from('study_rooms')
    .update({
      participants: [...room.participants, userId],
    })
    .eq('id', roomId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Leave a study room
 */
export async function leaveStudyRoom(roomId: string, userId: string) {
  // Get current participants
  const { data: room, error: fetchError } = await supabase
    .from('study_rooms')
    .select('participants')
    .eq('id', roomId)
    .single();

  if (fetchError) throw fetchError;

  // Remove user from participants
  const { data, error } = await supabase
    .from('study_rooms')
    .update({
      participants: room.participants.filter((id: string) => id !== userId),
    })
    .eq('id', roomId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
