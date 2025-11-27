'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface LeaderboardEntry {
  id: string
  full_name: string
  avatar_url: string | null
  rating: number
  study_streak: number
  total_points: number
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([])
  const [filter, setFilter] = useState<'points' | 'streak' | 'rating'>('points')

  useEffect(() => {
    loadLeaderboard()
  }, [filter])

  async function loadLeaderboard() {
    const orderBy = filter === 'points' ? 'total_points' : 
                    filter === 'streak' ? 'study_streak' : 'rating'

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, rating, study_streak')
      .order(orderBy, { ascending: false })
      .limit(50)

    if (data) {
      const withPoints = data.map(user => ({
        ...user,
        total_points: (user.rating * 100) + (user.study_streak * 10)
      }))
      setLeaders(withPoints)
    }
  }

  function getRankEmoji(rank: number) {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">🏆 Leaderboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Compete with peers and climb the ranks!</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setFilter('points')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              filter === 'points'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            🎯 Total Points
          </button>
          <button
            onClick={() => setFilter('streak')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              filter === 'streak'
                ? 'bg-orange-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            🔥 Study Streak
          </button>
          <button
            onClick={() => setFilter('rating')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              filter === 'rating'
                ? 'bg-yellow-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            ⭐ Rating
          </button>
        </div>

        {/* Top 3 Podium */}
        {leaders.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {/* 2nd Place */}
            <div className="flex flex-col items-center pt-8">
              <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-2xl font-bold mb-2">
                {leaders[1]?.full_name?.[0] || '2'}
              </div>
              <div className="text-3xl mb-2">🥈</div>
              <h3 className="font-bold text-gray-900 dark:text-white text-center">{leaders[1]?.full_name}</h3>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                {filter === 'points' ? leaders[1]?.total_points :
                 filter === 'streak' ? leaders[1]?.study_streak :
                 leaders[1]?.rating.toFixed(1)}
              </p>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-yellow-400 dark:bg-yellow-600 rounded-full flex items-center justify-center text-3xl font-bold mb-2 ring-4 ring-yellow-300">
                {leaders[0]?.full_name?.[0] || '1'}
              </div>
              <div className="text-4xl mb-2">🥇</div>
              <h3 className="font-bold text-gray-900 dark:text-white text-center text-lg">{leaders[0]?.full_name}</h3>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {filter === 'points' ? leaders[0]?.total_points :
                 filter === 'streak' ? leaders[0]?.study_streak :
                 leaders[0]?.rating.toFixed(1)}
              </p>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center pt-12">
              <div className="w-20 h-20 bg-orange-300 dark:bg-orange-600 rounded-full flex items-center justify-center text-2xl font-bold mb-2">
                {leaders[2]?.full_name?.[0] || '3'}
              </div>
              <div className="text-3xl mb-2">🥉</div>
              <h3 className="font-bold text-gray-900 dark:text-white text-center">{leaders[2]?.full_name}</h3>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                {filter === 'points' ? leaders[2]?.total_points :
                 filter === 'streak' ? leaders[2]?.study_streak :
                 leaders[2]?.rating.toFixed(1)}
              </p>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {leaders.map((user, index) => (
              <div
                key={user.id}
                className={`flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                  index < 3 ? 'bg-gradient-to-r from-yellow-50 to-transparent dark:from-yellow-900/20' : ''
                }`}
              >
                <div className="w-12 text-center font-bold text-lg">
                  {getRankEmoji(index + 1)}
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user.full_name?.[0] || '?'}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{user.full_name || 'Anonymous'}</h3>
                  <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>🔥 {user.study_streak} days</span>
                    <span>⭐ {user.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {filter === 'points' ? user.total_points :
                     filter === 'streak' ? user.study_streak :
                     user.rating.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {filter === 'points' ? 'points' :
                     filter === 'streak' ? 'days' :
                     'rating'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {leaders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No data available yet. Start learning to appear on the leaderboard!</p>
          </div>
        )}
      </div>
    </div>
  )
}
