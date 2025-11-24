# PeerLearn API Documentation

Complete API reference for PeerLearn platform using Supabase.

## Authentication

All API calls require authentication unless specified otherwise.

### Sign Up with Email

```typescript
import { signUpWithEmail } from '@/lib/auth';

const data = await signUpWithEmail({
  email: 'student@example.com',
  password: 'securePassword123',
  fullName: 'John Doe',
  institutionType: 'college',
  institutionName: 'MIT',
  course: 'Computer Science',
  year: 2,
  subjects: ['Data Structures', 'Algorithms'],
  interests: ['Web Development', 'AI'],
});
```

### Sign Up with Phone

```typescript
import { signUpWithPhone } from '@/lib/auth';

const data = await signUpWithPhone({
  phone: '+1234567890',
  password: 'securePassword123',
  fullName: 'John Doe',
  institutionType: 'college',
  institutionName: 'MIT',
  course: 'Computer Science',
  year: 2,
});
```

### Sign In

```typescript
import { signInWithEmail, signInWithPhone } from '@/lib/auth';

// Email
const session = await signInWithEmail('student@example.com', 'password');

// Phone
const session = await signInWithPhone('+1234567890', 'password');
```

## Users

### Get Current User Profile

```typescript
import { getCurrentUserProfile } from '@/lib/auth';

const profile = await getCurrentUserProfile();
```

### Update Profile

```typescript
import { updateUserProfile } from '@/lib/auth';

const updated = await updateUserProfile(userId, {
  bio: 'Passionate about learning',
  subjects: ['Machine Learning', 'Data Science'],
  interests: ['AI', 'Robotics'],
});
```

### Search Students

```typescript
import { supabase } from '@/lib/supabase';

const { data, error } = await supabase.rpc('search_students', {
  search_query: 'John',
  filter_institution: 'MIT',
  filter_course: 'Computer Science',
  filter_year: 2,
  limit_count: 20,
});
```

### Get Recommended Peers

```typescript
const { data, error } = await supabase.rpc('get_recommended_peers', {
  p_user_id: currentUserId,
  limit_count: 10,
});
```

## Study Rooms

### Create Study Room

```typescript
const { data, error } = await supabase
  .from('study_rooms')
  .insert({
    title: 'Data Structures Study Session',
    description: 'Let\'s solve tree problems together',
    subject: 'Data Structures',
    host_id: userId,
    scheduled_time: '2024-12-01T15:00:00Z',
    duration: 60, // minutes
    room_type: 'public',
    max_participants: 20,
  })
  .select()
  .single();
```

### Get Upcoming Rooms

```typescript
const { data, error } = await supabase
  .from('study_rooms')
  .select('*, users!host_id(*)')
  .eq('status', 'scheduled')
  .gte('scheduled_time', new Date().toISOString())
  .order('scheduled_time', { ascending: true })
  .limit(10);
```

### Join Study Room

```typescript
import { joinStudyRoom } from '@/lib/realtime';

const room = await joinStudyRoom(roomId, userId);
```

### Leave Study Room

```typescript
import { leaveStudyRoom } from '@/lib/realtime';

await leaveStudyRoom(roomId, userId);
```

## Real-time Chat

### Subscribe to Room Messages

```typescript
import { subscribeToRoomMessages } from '@/lib/realtime';

const channel = subscribeToRoomMessages(roomId, (message) => {
  console.log('New message:', message);
  // Update UI with new message
});

// Cleanup
await unsubscribe(channel);
```

### Send Room Message

```typescript
import { sendRoomMessage } from '@/lib/realtime';

const message = await sendRoomMessage(
  roomId,
  senderId,
  'Hello everyone!',
  'text'
);
```

### Subscribe to Direct Messages

```typescript
import { subscribeToDirectMessages } from '@/lib/realtime';

const channel = subscribeToDirectMessages(userId, otherUserId, (message) => {
  console.log('New DM:', message);
});
```

### Send Direct Message

```typescript
import { sendDirectMessage } from '@/lib/realtime';

const message = await sendDirectMessage(
  senderId,
  receiverId,
  'Hey, want to study together?',
  'text'
);
```

## Materials

### Upload Material

```typescript
// 1. Upload file to storage
const file = event.target.files[0];
const filePath = `${userId}/${Date.now()}_${file.name}`;

const { data: uploadData, error: uploadError } = await supabase.storage
  .from('materials')
  .upload(filePath, file);

// 2. Create material record
const { data, error } = await supabase
  .from('materials')
  .insert({
    uploader_id: userId,
    title: 'Data Structures Notes',
    description: 'Comprehensive notes on trees and graphs',
    subject: 'Data Structures',
    file_type: 'pdf',
    file_url: filePath,
    file_size: file.size,
    is_paid: false,
    is_public: true,
  })
  .select()
  .single();
```

### Download Material

```typescript
// 1. Get signed URL
const { data: urlData } = await supabase.storage
  .from('materials')
  .createSignedUrl(material.file_url, 3600); // 1 hour expiry

// 2. Increment download count
await supabase.rpc('increment_material_downloads', {
  p_material_id: materialId,
});

// 3. Download file
window.open(urlData.signedUrl, '_blank');
```

### Search Materials

```typescript
const { data, error } = await supabase
  .from('materials')
  .select('*, users!uploader_id(*)')
  .eq('is_public', true)
  .eq('is_active', true)
  .ilike('title', `%${searchQuery}%`)
  .order('downloads', { ascending: false })
  .limit(20);
```

## Quizzes

### Create Quiz

```typescript
const { data, error } = await supabase
  .from('quizzes')
  .insert({
    creator_id: userId,
    title: 'Data Structures Quiz',
    description: 'Test your knowledge on trees',
    subject: 'Data Structures',
    difficulty: 'medium',
    time_limit: 30, // minutes
    passing_score: 70,
    questions: [
      {
        question: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'],
        correct_answer: 1,
        explanation: 'Binary search divides the search space in half each time',
        points: 10,
      },
      // More questions...
    ],
    total_questions: 10,
    total_points: 100,
    is_public: true,
  })
  .select()
  .single();
```

### Take Quiz

```typescript
// 1. Get quiz
const { data: quiz } = await supabase
  .from('quizzes')
  .select('*')
  .eq('id', quizId)
  .single();

// 2. Submit answers
const answers = [
  { question_id: 0, selected_answer: 1, is_correct: true, points_earned: 10 },
  // More answers...
];

const score = answers.reduce((sum, a) => sum + (a.is_correct ? a.points_earned : 0), 0);
const percentage = (score / quiz.total_points) * 100;

// 3. Save attempt
const { data, error } = await supabase
  .from('quiz_attempts')
  .insert({
    quiz_id: quizId,
    user_id: userId,
    answers,
    score,
    percentage,
    is_passed: percentage >= quiz.passing_score,
  })
  .select()
  .single();
```

## Connections

### Send Connection Request

```typescript
const { data, error } = await supabase
  .from('connections')
  .insert({
    user_id: currentUserId,
    connected_user_id: targetUserId,
    connection_type: 'peer',
    status: 'pending',
    message: 'Hi! Let\'s connect and study together',
  })
  .select()
  .single();
```

### Accept Connection

```typescript
const { data, error } = await supabase
  .from('connections')
  .update({
    status: 'accepted',
    responded_at: new Date().toISOString(),
  })
  .eq('id', connectionId)
  .select()
  .single();
```

### Get Connections

```typescript
const { data, error } = await supabase
  .from('connections')
  .select('*, users!connected_user_id(*)')
  .eq('user_id', userId)
  .eq('status', 'accepted')
  .order('created_at', { ascending: false });
```

## Notifications

### Subscribe to Notifications

```typescript
import { subscribeToNotifications } from '@/lib/realtime';

const channel = subscribeToNotifications(userId, (notification) => {
  console.log('New notification:', notification);
  // Show toast/notification
});
```

### Mark as Read

```typescript
const { error } = await supabase
  .from('notifications')
  .update({ is_read: true, read_at: new Date().toISOString() })
  .eq('id', notificationId);
```

### Get Unread Count

```typescript
const { count, error } = await supabase
  .from('notifications')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', userId)
  .eq('is_read', false);
```

## Progress Tracking

### Update Study Streak

```typescript
await supabase.rpc('update_study_streak', {
  p_user_id: userId,
});
```

### Get Progress

```typescript
const { data, error } = await supabase
  .from('progress')
  .select('*')
  .eq('user_id', userId);
```

### Update Progress

```typescript
const { data, error } = await supabase
  .from('progress')
  .upsert({
    user_id: userId,
    subject: 'Data Structures',
    quizzes_completed: 5,
    study_hours: 10.5,
    materials_studied: 15,
  })
  .select()
  .single();
```

## Bookmarks

### Add Bookmark

```typescript
const { data, error } = await supabase
  .from('bookmarks')
  .insert({
    user_id: userId,
    item_type: 'material', // or 'quiz', 'study_room', 'user'
    item_id: itemId,
    folder: 'Data Structures',
    notes: 'Important for exam',
  })
  .select()
  .single();
```

### Get Bookmarks

```typescript
const { data, error } = await supabase
  .from('bookmarks')
  .select('*')
  .eq('user_id', userId)
  .eq('item_type', 'material')
  .order('created_at', { ascending: false });
```

## Achievements

### Check Achievements

```typescript
await supabase.rpc('check_achievements', {
  p_user_id: userId,
});
```

### Get User Achievements

```typescript
const { data, error } = await supabase
  .from('user_achievements')
  .select('*, achievements(*)')
  .eq('user_id', userId)
  .order('earned_at', { ascending: false });
```

## Leaderboard

### Get Leaderboard

```typescript
const { data, error } = await supabase
  .from('leaderboard')
  .select('*')
  .limit(100);
```

## Storage

### Upload Avatar

```typescript
const file = event.target.files[0];
const filePath = `${userId}/avatar.jpg`;

const { data, error } = await supabase.storage
  .from('avatars')
  .upload(filePath, file, {
    upsert: true,
  });

// Update user profile
await supabase
  .from('users')
  .update({ profile_picture: filePath })
  .eq('id', userId);
```

### Get Public URL

```typescript
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl(filePath);

console.log(data.publicUrl);
```

---

## Error Handling

All API calls should include error handling:

```typescript
try {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  
  return data;
} catch (error) {
  console.error('Error:', error.message);
  // Handle error appropriately
}
```

## Rate Limiting

Supabase has built-in rate limiting. For production:
- Implement client-side debouncing for search
- Cache frequently accessed data
- Use pagination for large datasets
- Optimize queries with proper indexes

---

For more details, see [Supabase Documentation](https://supabase.com/docs)
