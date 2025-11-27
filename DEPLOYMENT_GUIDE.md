# PeerLearn Deployment Guide

Complete guide to deploy PeerLearn on **Vercel** with **Supabase** backend.

## 🚀 Quick Deploy

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- Supabase account (free tier works)

---

## Step 1: Set Up Supabase

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Project Name**: `peerlearn`
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your users
4. Click "Create new project"

### 1.2 Run Database Migrations
1. In Supabase Dashboard, go to **SQL Editor**
2. Run each migration file in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_functions_triggers.sql`
   - `supabase/migrations/004_storage_setup.sql`
   - `supabase/migrations/005_seed_data.sql`

### 1.3 Get API Keys
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key

---

## Step 2: Deploy to Vercel

### 2.1 Connect GitHub Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository: `peerlearn-platform`
4. Click "Import"

### 2.2 Configure Environment Variables
In Vercel project settings, add these environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2.3 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. Your app will be live at `https://your-project.vercel.app`

---

## Step 3: Configure Authentication

### 3.1 Set Up Auth Providers
1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure redirect URLs:
   - Add your Vercel domain: `https://your-project.vercel.app/auth/callback`

### 3.2 Email Templates (Optional)
1. Go to **Authentication** → **Email Templates**
2. Customize confirmation and reset password emails

---

## Step 4: Set Up Storage

### 4.1 Create Storage Buckets
In Supabase Dashboard, go to **Storage**:

1. Create bucket: `notes` (public)
2. Create bucket: `lectures` (public)
3. Create bucket: `avatars` (public)
4. Create bucket: `thumbnails` (public)

### 4.2 Configure Bucket Policies
For each bucket, set policies:
- **Public access**: Allow authenticated users to upload
- **File size limit**: 50MB for notes/lectures, 5MB for avatars

---

## 🎉 You're Done!

Your PeerLearn platform is now live! 

**Need help?** Check the main README.md for more information.
