# 🚀 PeerLearn Quick Start Guide

Get PeerLearn up and running in 10 minutes!

## ⚡ Quick Setup

### 1. Clone & Install (2 minutes)

```bash
git clone https://github.com/navyadragon04-star/peerlearn-platform.git
cd peerlearn-platform
npm install
```

### 2. Supabase Setup (5 minutes)

1. **Create Project**: Go to [supabase.com](https://supabase.com) → New Project
2. **Run Migrations**: 
   - Open SQL Editor in Supabase Dashboard
   - Copy & run each file from `supabase/migrations/` in order (001 → 005)
3. **Enable Auth**:
   - Go to Authentication → Providers
   - Enable Email & Phone providers
4. **Get Credentials**:
   - Settings → API
   - Copy Project URL and anon key

### 3. Configure Environment (1 minute)

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run Development Server (1 minute)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 📋 What You Get

### ✅ Complete Database Schema
- 15+ tables with relationships
- Row Level Security policies
- Real-time subscriptions
- Full-text search indexes
- Automated triggers & functions

### ✅ Authentication System
- Email sign up/sign in
- Phone OTP authentication
- Password reset
- Session management
- Profile creation with academic details

### ✅ Core Features Ready
- **Study Rooms**: Create, schedule, join rooms
- **Real-time Chat**: DMs and room chat
- **Materials**: Upload/download documents
- **Quizzes**: Create and take quizzes
- **Student Search**: Find and connect with peers
- **Notifications**: Real-time alerts
- **Progress Tracking**: Analytics and insights
- **Gamification**: Points, streaks, achievements

### ✅ Storage Buckets
- Avatars (public)
- Materials (private with access control)
- Thumbnails (public)
- Room recordings (private)
- Chat files (private)
- Verification docs (private)

### ✅ Utilities & Helpers
- Supabase client configuration
- Authentication functions
- Real-time subscriptions
- TypeScript types
- API utilities

## 🎯 Next Steps

### Immediate
1. **Test Authentication**: Sign up with email/phone
2. **Create Profile**: Add academic details
3. **Explore Features**: Try creating a study room
4. **Test Chat**: Send messages in real-time

### Development
1. **Build UI Components**: Create React components
2. **Add Pages**: Build Next.js pages
3. **Implement Features**: Connect UI to backend
4. **Test Thoroughly**: Test all features

### Deployment
1. **Push to GitHub**: Commit your changes
2. **Deploy to Vercel**: Connect repository
3. **Update Supabase**: Add production URLs
4. **Go Live**: Share with users

## 📚 Documentation

- **[Setup Guide](./docs/SETUP.md)**: Detailed setup instructions
- **[API Docs](./docs/API.md)**: Complete API reference
- **[Features](./docs/FEATURES.md)**: All features explained
- **[README](./README.md)**: Project overview

## 🆘 Troubleshooting

### "Invalid API key"
→ Check `.env.local` has correct Supabase credentials

### "Row Level Security policy violation"
→ Ensure migrations ran successfully, especially `002_rls_policies.sql`

### "Storage bucket not found"
→ Run `004_storage_setup.sql` migration

### Real-time not working
→ Check Supabase Realtime is enabled in project settings

## 💡 Pro Tips

1. **Use TypeScript**: Full type safety included
2. **Test with Multiple Users**: Open incognito windows
3. **Check Supabase Logs**: Monitor API calls and errors
4. **Use React DevTools**: Debug component state
5. **Enable Dark Mode**: Test both themes

## 🎨 Customization

### Change Theme Colors
Edit `tailwind.config.js` → `theme.extend.colors`

### Add New Features
1. Create database table/function
2. Add TypeScript types
3. Create API functions
4. Build UI components

### Modify Existing Features
Check `src/lib/` for utility functions to modify

## 🚀 Production Checklist

- [ ] All migrations run successfully
- [ ] Environment variables set
- [ ] Authentication providers configured
- [ ] Storage buckets created
- [ ] RLS policies enabled
- [ ] Test all features
- [ ] Set up monitoring
- [ ] Configure custom domain
- [ ] Enable SSL
- [ ] Set up backups

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/navyadragon04-star/peerlearn-platform/issues)
- **Docs**: Check `/docs` folder
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)

---

**Ready to build the future of peer learning! 🎓✨**

Repository: https://github.com/navyadragon04-star/peerlearn-platform
