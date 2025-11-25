import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-indigo-600">PeerLearn</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with peers, join study rooms, share knowledge, and grow together
            through collaborative learning.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Get Started
            </Link>
            <Link
              href="/auth/signin"
              className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon="🎓"
            title="Study Rooms"
            description="Join scheduled group learning sessions with peers studying the same subjects"
          />
          <FeatureCard
            icon="💬"
            title="Real-time Chat"
            description="Connect instantly with students through direct messages and group chats"
          />
          <FeatureCard
            icon="📚"
            title="Share Materials"
            description="Upload and download study materials, notes, and resources"
          />
          <FeatureCard
            icon="📝"
            title="Quizzes"
            description="Create and take quizzes to test your knowledge and track progress"
          />
          <FeatureCard
            icon="🤝"
            title="Find Peers"
            description="Search and connect with students from your institution and course"
          />
          <FeatureCard
            icon="🏆"
            title="Gamification"
            description="Earn points, maintain streaks, unlock achievements, and climb leaderboards"
          />
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <StatCard number="10,000+" label="Students" />
            <StatCard number="5,000+" label="Study Rooms" />
            <StatCard number="50,000+" label="Materials Shared" />
            <StatCard number="100+" label="Institutions" />
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-indigo-600 rounded-2xl shadow-xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students already learning together on PeerLearn
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Create Free Account
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-600">
          <div className="flex justify-center gap-6 mb-4">
            <Link href="/about" className="hover:text-indigo-600">About</Link>
            <Link href="/privacy" className="hover:text-indigo-600">Privacy</Link>
            <Link href="/terms" className="hover:text-indigo-600">Terms</Link>
            <Link href="/contact" className="hover:text-indigo-600">Contact</Link>
          </div>
          <p className="text-sm">
            © 2024 PeerLearn. Built with ❤️ for students, by students.
          </p>
        </footer>
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-4xl font-bold text-indigo-600 mb-2">{number}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}
