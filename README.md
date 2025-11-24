# 🎓 PeerLearn - Peer-to-Peer Learning Platform

A comprehensive learning platform connecting students for collaborative education, real-time study sessions, and resource sharing.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Code of Conduct](https://img.shields.io/badge/Code%20of-Conduct-blue.svg)](CODE_OF_CONDUCT.md)

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

**For detailed setup instructions, see [QUICKSTART.md](QUICKSTART.md)**

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
├── docs/               # Documentation
└── .github/            # GitHub templates
```

## 📚 Documentation

- **[Quick Start Guide](QUICKSTART.md)** - Get started in 10 minutes
- **[Setup Guide](docs/SETUP.md)** - Detailed setup instructions
- **[API Documentation](docs/API.md)** - Complete API reference
- **[Features Guide](docs/FEATURES.md)** - All features explained
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute
- **[Code of Conduct](CODE_OF_CONDUCT.md)** - Community guidelines
- **[Security Policy](SECURITY.md)** - Security and vulnerability reporting
- **[Privacy Policy](PRIVACY.md)** - How we handle your data
- **[Terms of Service](TERMS_OF_SERVICE.md)** - Platform usage terms

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

## 🔐 Security & Privacy

- ✅ **Encryption**: Data encrypted in transit and at rest
- ✅ **Authentication**: Secure JWT-based sessions
- ✅ **Authorization**: Row Level Security (RLS) policies
- ✅ **Privacy Controls**: Granular privacy settings
- ✅ **GDPR Compliant**: Full data protection compliance
- ✅ **SOC 2 Certified**: Via Supabase infrastructure

**For security concerns, see [SECURITY.md](SECURITY.md)**

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### How to Contribute

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

## 📱 Mobile Support

- ✅ Responsive design for all devices
- ✅ Mobile-first approach
- ✅ Touch-optimized interface
- ✅ PWA support (installable)
- ✅ Offline capabilities

## 🌍 Internationalization

- 🇺🇸 English (default)
- 🇮🇳 Hindi (coming soon)
- 🇪🇸 Spanish (coming soon)
- 🇫🇷 French (coming soon)

## 🎯 Roadmap

- [x] Core platform features
- [x] Real-time chat and study rooms
- [x] Quiz system
- [x] Gamification
- [ ] Mobile apps (iOS/Android)
- [ ] AI study assistant
- [ ] Live streaming
- [ ] Voice notes
- [ ] Flashcards
- [ ] Mind maps
- [ ] Study groups
- [ ] Advanced analytics

## 📊 Project Status

- **Version**: 1.0.0
- **Status**: Active Development
- **License**: MIT
- **Maintained**: Yes

## 🐛 Bug Reports & Feature Requests

- **Bug Reports**: [Create a bug report](.github/ISSUE_TEMPLATE/bug_report.md)
- **Feature Requests**: [Request a feature](.github/ISSUE_TEMPLATE/feature_request.md)
- **Security Issues**: See [SECURITY.md](SECURITY.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**Created by**: PRATEEK CHAUDHARY

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) - Backend infrastructure
- [Vercel](https://vercel.com) - Hosting platform
- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - Styling
- All contributors and supporters

## 📞 Contact & Support

- **Email**: navyadragon04@gmail.com
- **GitHub Issues**: [Report an issue](https://github.com/navyadragon04-star/peerlearn-platform/issues)
- **Discussions**: [Join discussions](https://github.com/navyadragon04-star/peerlearn-platform/discussions)

## 🔗 Links

- **Repository**: https://github.com/navyadragon04-star/peerlearn-platform
- **Documentation**: [/docs](docs/)
- **Website**: Coming soon
- **Blog**: Coming soon

## ⭐ Show Your Support

If you find this project helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting features
- 🤝 Contributing code
- 📢 Sharing with others

## 📈 Stats

![GitHub stars](https://img.shields.io/github/stars/navyadragon04-star/peerlearn-platform?style=social)
![GitHub forks](https://img.shields.io/github/forks/navyadragon04-star/peerlearn-platform?style=social)
![GitHub issues](https://img.shields.io/github/issues/navyadragon04-star/peerlearn-platform)
![GitHub pull requests](https://img.shields.io/github/issues-pr/navyadragon04-star/peerlearn-platform)

---

**Built with ❤️ for students, by students**

**PeerLearn - Empowering Students Through Peer Learning** 🎓✨
