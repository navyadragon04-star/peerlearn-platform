'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Note {
  id: string
  title: string
  description: string
  subject: string
  file_url: string
  thumbnail_url: string | null
  author_id: string
  is_paid: boolean
  price: number | null
  downloads: number
  rating: number
  created_at: string
  profiles: {
    full_name: string
    avatar_url: string | null
  }
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [filter, setFilter] = useState<'all' | 'free' | 'paid'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)

  useEffect(() => {
    loadNotes()
  }, [filter])

  async function loadNotes() {
    let query = supabase
      .from('notes')
      .select(`
        *,
        profiles (full_name, avatar_url)
      `)
      .order('created_at', { ascending: false })

    if (filter === 'free') {
      query = query.eq('is_paid', false)
    } else if (filter === 'paid') {
      query = query.eq('is_paid', true)
    }

    const { data, error } = await query

    if (data) setNotes(data)
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notes Library</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Browse and share study materials</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            + Upload Notes
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search notes by title or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('free')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'free'
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
              }`}
            >
              Free
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'paid'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
              }`}
            >
              Premium
            </button>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map(note => (
            <div key={note.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              {/* Thumbnail */}
              <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-6xl">📄</span>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {note.title}
                    </h3>
                    <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">
                      {note.subject}
                    </span>
                  </div>
                  {note.is_paid ? (
                    <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded font-semibold">
                      ₹{note.price}
                    </span>
                  ) : (
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded font-semibold">
                      FREE
                    </span>
                  )}
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {note.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <span className="mr-2">⭐</span>
                    <span>{note.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">📥</span>
                    <span>{note.downloads} downloads</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2">
                      {note.profiles?.full_name?.[0] || 'A'}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {note.profiles?.full_name || 'Author'}
                    </span>
                  </div>
                  <Link
                    href={`/notes/${note.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                  >
                    {note.is_paid ? 'Buy' : 'Download'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No notes found. Try adjusting your filters!</p>
          </div>
        )}
      </div>
    </div>
  )
}
