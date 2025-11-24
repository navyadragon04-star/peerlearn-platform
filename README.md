# 🎓 PeerLearn - Peer-to-Peer Learning Platform

A comprehensive learning platform connecting students for collaborative education, real-time study sessions, and resource sharing.

## ✨ Features

### 👤 User Management
- **Dual Authentication**: Sign up with Email or Phone Number
- **Detailed Profiles**: College, University, Course, Year
- **Student Search**: Find and connect with peers
- **Verification System**: Verified profiles with ratings
- **Skill Dashboard**: Teach and earn rewards

### 📚 Learning Features
- **Study Rooms**: Scheduled group learning sessions
- **Real-time Chat**: Connect with students instantly
- **1-on-1 Video Calls**: Personal guidance
- **AI Peer Matching**: Subject and interest-based connections

### 📝 Content Management
- **Notes Upload/Download**: Share study materials
- **Document Support**: PDF, DOC, PPT, Images
- **Paid & Free Content**: Monetization options
- **Personal Notes**: Built-in note-taking

### 🎯 Assessment & Gamification
- **Platform Quizzes**: Built-in assessments
- **Personal Quiz Creator**: Create custom quizzes
- **Challenges & Leaderboards**: Competitive learning
- **Study Streaks**: Track consistency
- **Progress Analytics**: Detailed insights

### 🛠️ Productivity Tools
- 📅 Study Calendar with scheduling
- 🔔 Smart notifications & reminders
- 📊 Progress tracker
- 🔍 Global search
- ⭐ Bookmarks
- 🌙 Dark mode
- 🎯 AI Recommendations

## 🏗️ Tech Stack

### Frontend
- **Framework**: React.js / Next.js
- **Mobile**: React Native (optional)
- **Styling**: Tailwind CSS
- **State**: Redux Toolkit
- **Real-time**: Socket.io Client

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email + Phone)
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime
- **API**: Supabase Edge Functions

### Infrastructure
- **Hosting**: Vercel / Netlify
- **Video Calls**: Agora / Daily.co
- **Search**: Supabase Full-Text Search
- **CDN**: Cloudflare

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm/yarn
- Supabase account

### Installation

```bash
# Clone repository
git clone https://github.com/navyadragon04-star/peerlearn-platform.git
cd peerlearn-platform

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Add your Supabase credentials

# Run development server
npm run dev
```

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL migrations in `/supabase/migrations`
3. Enable Authentication providers (Email, Phone)
4. Configure Storage buckets
5. Set up Row Level Security policies

## 📁 Project Structure

```
peerlearn-platform/
├── src/
│   ├── components/       # React components
│   ├── pages/           # Next.js pages
│   ├── lib/             # Utilities & helpers
│   ├── hooks/           # Custom React hooks
│   ├── store/           # Redux store
│   └── styles/          # CSS/Tailwind styles
├── supabase/
│   ├── migrations/      # Database migrations
│   ├── functions/       # Edge functions
│   └── config.sql       # Initial setup
├── public/              # Static assets
└── docs/               # Documentation

```

## 🗄️ Database Schema

### Core Tables
- `users` - User profiles with academic details
- `study_rooms` - Scheduled learning sessions
- `messages` - Real-time chat
- `materials` - Notes and documents
- `quizzes` - Assessments
- `connections` - Student network
- `bookmarks` - Saved content
- `progress` - Learning analytics
- `notifications` - User alerts

## 🔐 Authentication Flow

1. **Sign Up**: Email or Phone with OTP
2. **Profile Setup**: Academic details collection
3. **Verification**: Document upload (optional)
4. **Onboarding**: Interest selection & matching

## 🎨 Key Features Implementation

### Real-time Chat
- Supabase Realtime subscriptions
- Message history with pagination
- File sharing support
- Read receipts

### Study Rooms
- Scheduled sessions with reminders
- Live participant tracking
- Video integration
- Chat within rooms

### Student Search
- Full-text search by name, college, course
- Filter by year, subjects, interests
- Connection requests
- Profile recommendations

### Document Management
- Secure file upload to Supabase Storage
- Download tracking
- Paid content with payment integration
- Preview generation

## 📱 Mobile App (Optional)

React Native app with:
- Shared codebase with web
- Native notifications
- Offline support
- Camera integration for document scanning

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file

## 👥 Team

Created by PRATEEK CHAUDHARY

## 🔗 Links

- [Documentation](./docs)
- [API Reference](./docs/api.md)
- [Supabase Setup Guide](./docs/supabase-setup.md)

---

**Built with ❤️ for students, by students**
