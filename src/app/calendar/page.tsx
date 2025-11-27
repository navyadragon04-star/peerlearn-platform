'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Event {
  id: string
  title: string
  type: 'study_room' | 'quiz' | 'lecture' | 'reminder'
  scheduled_at: string
  description: string
}

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    // Load scheduled study rooms
    const { data: rooms } = await supabase
      .from('study_rooms')
      .select('id, title, description, scheduled_at')
      .not('scheduled_at', 'is', null)
      .gte('scheduled_at', new Date().toISOString())

    const events: Event[] = (rooms || []).map(room => ({
      id: room.id,
      title: room.title,
      type: 'study_room',
      scheduled_at: room.scheduled_at!,
      description: room.description
    }))

    setEvents(events)
  }

  const today = new Date()
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay()

  const upcomingEvents = events
    .filter(e => new Date(e.scheduled_at) >= today)
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Study Calendar</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your study schedule</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            + Add Event
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                ←
              </button>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                →
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2">
                  {day}
                </div>
              ))}
              
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square"></div>
              ))}
              
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day)
                const isToday = date.toDateString() === today.toDateString()
                const hasEvents = events.some(e => 
                  new Date(e.scheduled_at).toDateString() === date.toDateString()
                )

                return (
                  <div
                    key={day}
                    className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer transition ${
                      isToday
                        ? 'bg-blue-600 text-white font-bold'
                        : hasEvents
                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    {day}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upcoming Events</h2>
            <div className="space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map(event => (
                  <div key={event.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">
                        {event.type === 'study_room' ? '🏫' : 
                         event.type === 'quiz' ? '🎯' : 
                         event.type === 'lecture' ? '🎥' : '📅'}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {new Date(event.scheduled_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No upcoming events
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
