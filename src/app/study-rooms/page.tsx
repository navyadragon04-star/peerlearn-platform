'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface StudyRoom {
  id: string
  title: string
  description: string
  subject: string
  host_id: string
  scheduled_at: string | null
  max_participants: number
  is_active: boolean
  created_at: string
  profiles: {
    full_name: string
    avatar_url: string | null
  }
}

export default function StudyRooms() {
  const [rooms, setRooms] = useState<StudyRoom[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newRoom, setNewRoom] = useState({
    title: '',
    description: '',
    subject: '',
    scheduled_at: '',
    max_participants: 10
  })

  useEffect(() => {
    loadRooms()
  }, [])

  async function loadRooms() {
    const { data, error } = await supabase
      .from('study_rooms')
      .select(`
        *,
        profiles (full_name, avatar_url)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (data) setRooms(data)
  }

  async function createRoom() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('study_rooms')
      .insert([{
        ...newRoom,
        host_id: user.id,
        is_active: true
      }])

    if (!error) {
      setShowCreateModal(false)
      loadRooms()
      setNewRoom({
        title: '',
        description: '',
        subject: '',
        scheduled_at: '',
        max_participants: 10
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Study Rooms</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Join or create collaborative study sessions</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            + Create Room
          </button>
        </div>

        {/* Active Rooms */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <div key={room.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {room.title}
                  </h3>
                  <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">
                    {room.subject}
                  </span>
                </div>
                {room.is_active && (
                  <span className="flex items-center text-green-500 text-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Live
                  </span>
                )}
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {room.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center">
                  <span className="mr-2">👥</span>
                  <span>Max {room.max_participants}</span>
                </div>
                {room.scheduled_at && (
                  <div className="flex items-center">
                    <span className="mr-2">📅</span>
                    <span>{new Date(room.scheduled_at).toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2">
                    {room.profiles?.full_name?.[0] || 'H'}
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {room.profiles?.full_name || 'Host'}
                  </span>
                </div>
                <Link
                  href={`/study-rooms/${room.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Join Room
                </Link>
              </div>
            </div>
          ))}
        </div>

        {rooms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No active study rooms. Create one to get started!</p>
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create Study Room</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Room Title
                </label>
                <input
                  type="text"
                  value={newRoom.title}
                  onChange={(e) => setNewRoom({ ...newRoom, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Calculus Study Group"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={newRoom.subject}
                  onChange={(e) => setNewRoom({ ...newRoom, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Mathematics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newRoom.description}
                  onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="What will you study?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Schedule (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={newRoom.scheduled_at}
                  onChange={(e) => setNewRoom({ ...newRoom, scheduled_at: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Participants
                </label>
                <input
                  type="number"
                  value={newRoom.max_participants}
                  onChange={(e) => setNewRoom({ ...newRoom, max_participants: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  min="2"
                  max="50"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={createRoom}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
              >
                Create Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
