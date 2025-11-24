# PeerLearn Setup Guide

Complete guide to set up PeerLearn platform locally and deploy to production.

## Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account (free tier works)
- Git

## 1. Supabase Setup

### Create a New Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details:
   - **Name**: peerlearn
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your users
4. Wait for project to be created (~2 minutes)

### Get API Credentials

1. Go to Project Settings → API
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...`
   - **service_role key**: `eyJhbGc...` (keep secret!)

### Run Database Migrations

1. In Supabase Dashboard, go to SQL Editor
2. Run each migration file in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_functions_triggers.sql`
   - `supabase/migrations/004_storage_setup.sql`
   - `supabase/migrations/005_seed_data.sql`

3. Click "Run" for each file

### Configure Authentication

1. Go to Authentication → Providers
2. Enable **Email** provider:
   - Enable email confirmations (optional)
   - Set confirmation URL: `http://localhost:3000/auth/callback`
3. Enable **Phone** provider:
   - Choose SMS provider (Twilio recommended)
   - Add Twilio credentials
   - Enable phone confirmations

### Configure Storage

Storage buckets are created automatically by migration `004_storage_setup.sql`.

Verify buckets exist:
1. Go to Storage
2. You should see:
   - `avatars` (public)
   - `materials` (private)
   - `thumbnails` (public)
   - `room-recordings` (private)
   - `chat-files` (private)
   - `verification-docs` (private)

## 2. Local Development Setup

### Clone Repository

```bash
git clone https://github.com/navyadragon04-star/peerlearn-platform.git
cd peerlearn-platform
```

### Install Dependencies

```bash
npm install
# or
yarn install
```

### Environment Variables

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. (Optional) Add video call credentials:

For Agora:
```env
AGORA_APP_ID=your_app_id
AGORA_APP_CERTIFICATE=your_certificate
```

Or for Daily.co:
```env
DAILY_API_KEY=your_api_key
```

### Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 3. Testing Authentication

### Test Email Sign Up

1. Go to `/auth/signup`
2. Fill in the form with email
3. Check email for confirmation (if enabled)
4. Complete profile setup

### Test Phone Sign Up

1. Go to `/auth/signup`
2. Switch to phone tab
3. Enter phone number
4. Verify OTP
5. Complete profile setup

## 4. Feature Testing Checklist

### User Management
- [ ] Sign up with email
- [ ] Sign up with phone
- [ ] Sign in with email
- [ ] Sign in with phone
- [ ] Profile creation with academic details
- [ ] Profile editing
- [ ] Avatar upload

### Study Rooms
- [ ] Create study room
- [ ] Schedule study room
- [ ] Join study room
- [ ] Real-time chat in room
- [ ] Leave study room
- [ ] View room participants

### Real-time Chat
- [ ] Send direct message
- [ ] Receive direct message
- [ ] Send file in chat
- [ ] Message read receipts
- [ ] Real-time updates

### Materials
- [ ] Upload document
- [ ] Download document
- [ ] View materials
- [ ] Search materials
- [ ] Paid materials (if payment configured)

### Student Search
- [ ] Search students by name
- [ ] Filter by institution
- [ ] Filter by course
- [ ] Filter by year
- [ ] Send connection request
- [ ] Accept connection
- [ ] View connections

### Quizzes
- [ ] Create quiz
- [ ] Take quiz
- [ ] View results
- [ ] Personal quiz creator
- [ ] Quiz leaderboard

### Gamification
- [ ] Study streak tracking
- [ ] Points system
- [ ] Achievements
- [ ] Leaderboard
- [ ] Badges

### Productivity
- [ ] Study calendar
- [ ] Notifications
- [ ] Bookmarks
- [ ] Progress tracker
- [ ] Dark mode

## 5. Production Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - All variables from `.env.local`
   - Update `NEXT_PUBLIC_SITE_URL` to your domain
5. Deploy

### Update Supabase Settings

1. Go to Authentication → URL Configuration
2. Add your production URL to:
   - Site URL
   - Redirect URLs

### Configure Custom Domain (Optional)

1. In Vercel, go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_SITE_URL` in Vercel environment variables

## 6. Video Call Integration

### Option A: Agora

1. Sign up at [Agora.io](https://www.agora.io)
2. Create a project
3. Get App ID and Certificate
4. Add to environment variables
5. Implement video call UI using Agora SDK

### Option B: Daily.co

1. Sign up at [Daily.co](https://www.daily.co)
2. Get API key
3. Add to environment variables
4. Use Daily's prebuilt UI or custom implementation

## 7. Payment Integration (Optional)

### Stripe

1. Sign up at [Stripe](https://stripe.com)
2. Get API keys (test and live)
3. Add to environment variables
4. Implement payment flow for paid content

### Razorpay (India)

1. Sign up at [Razorpay](https://razorpay.com)
2. Get API keys
3. Add to environment variables
4. Implement payment flow

## 8. Monitoring & Analytics

### Supabase Analytics

- Go to Supabase Dashboard → Database → Logs
- Monitor API usage, errors, and performance

### Vercel Analytics

- Enable Vercel Analytics in project settings
- Monitor page views, performance, and user behavior

## 9. Troubleshooting

### Common Issues

**Issue**: "Invalid API key"
- **Solution**: Check that environment variables are correctly set
- Restart dev server after changing `.env.local`

**Issue**: "Row Level Security policy violation"
- **Solution**: Ensure RLS policies are correctly applied
- Check user is authenticated before accessing protected resources

**Issue**: "Storage bucket not found"
- **Solution**: Run storage setup migration again
- Verify buckets exist in Supabase Dashboard

**Issue**: "Real-time not working"
- **Solution**: Check Supabase Realtime is enabled
- Verify channel subscriptions are correct
- Check browser console for errors

**Issue**: "Phone authentication not working"
- **Solution**: Verify Twilio credentials
- Check phone number format (+1234567890)
- Ensure SMS provider is configured in Supabase

## 10. Next Steps

1. Customize UI/UX to match your brand
2. Add more features based on user feedback
3. Implement analytics and monitoring
4. Set up CI/CD pipeline
5. Add automated testing
6. Optimize performance
7. Scale infrastructure as needed

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/navyadragon04-star/peerlearn-platform/issues)
- Documentation: Check `/docs` folder
- Supabase Docs: [supabase.com/docs](https://supabase.com/docs)

---

**Happy Learning! 🎓**
