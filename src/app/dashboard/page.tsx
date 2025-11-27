'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    studyStreak: 0,
    totalNotes: 0,
    totalQuizzes: 0,
    upcomingSessions: 0
  })

  useEffect(() => {
    loadUserData()
  }, [])

  async function loadUserData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      // Load user stats
      const { data: profile } = await supabase
        .from('profiles')
        .select('study_streak')
        .eq('id', user.id)
        .single()
      
      if (profile) {
        setStats(prev => ({ ...prev, studyStreak: profile.study_streak }))
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              PeerLearn Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <Link href="/notifications" className="relative">
                <span className="text-2xl">🔔</span>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </Link>
              <Link href="/profile">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.email?.[0].toUpperCase()}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Study Streak</p>
                <p className="text-3xl font-bold text-orange-500">🔥 {stats.studyStreak}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">My Notes</p>
              <p className="text-3xl font-bold text-blue-500">📝 {stats.totalNotes}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Quizzes Taken</p>
              <p className="text-3xl font-bold text-green-500">✅ {stats.totalQuizzes}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Upcoming Sessions</p>
              <p className="text-3xl font-bold text-purple-500">📅 {stats.upcomingSessions}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/study-rooms" className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg hover:shadow-xl transition text-white">
            <h3 className="text-xl font-bold mb-2">🏫 Study Rooms</h3>
            <p className="text-blue-100">Join or create group study sessions</p>
          </Link>
          
          <Link href="/notes" className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-lg hover:shadow-xl transition text-white">
            <h3 className="text-xl font-bold mb-2">📚 Notes Library</h3>
            <p className="text-green-100">Browse and share study materials</p>
          </Link>
          
          <Link href="/lectures" className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg hover:shadow-xl transition text-white">
            <h3 className="text-xl font-bold mb-2">🎥 Lectures</h3>
            <p className="text-purple-100">Watch recorded lectures</p>
          </Link>
        </div>

        {/* More Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/quiz" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition text-center">
            <div className="text-3xl mb-2">🎯</div>
            <p className="font-semibold">Quizzes</p>
          </Link>
          
          <Link href="/calendar" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition text-center">
            <div className="text-3xl mb-2">📅</div>
            <p className="font-semibold">Calendar</p>
          </Link>
          
          <Link href="/bookmarks" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition text-center">
            <div className="text-3xl mb-2">⭐</div>
            <p className="font-semibold">Bookmarks</p>
          </Link>
          
          <Link href="/progress" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition text-center">
            <div className="text-3xl mb-2">📊</div>
            <p className="font-semibold">Progress</p>
          </Link>
          
          <Link href="/chat" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition text-center">
            <div className="text-3xl mb-2">💬</div>
            <p className="font-semibold">1-on-1 Chat</p>
          </Link>
          
          <Link href="/leaderboard" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition text-center">
            <div className="text-3xl mb-2">🏆</div>
            <p className="font-semibold">Leaderboard</p>
          </Link>
          
          <Link href="/search" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition text-center">
            <div className="text-3xl mb-2">🔍</div>
            <p className="font-semibold">Search</p>
          </Link>
          
          <Link href="/settings" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition text-center">
            <div className="text-3xl mb-2">⚙️</div>
            <p className="font-semibold">Settings</p>
          </Link>
        </div>
      </main>
    </div>
  )
}
