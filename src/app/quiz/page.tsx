'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Quiz {
  id: string
  title: string
  description: string
  subject: string
  creator_id: string
  is_public: boolean
  time_limit: number | null
  total_questions: number
  created_at: string
  profiles: {
    full_name: string
  }
}

interface Question {
  question: string
  options: string[]
  correct_answer: number
}

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    subject: '',
    is_public: true,
    time_limit: 30
  })
  const [questions, setQuestions] = useState<Question[]>([
    { question: '', options: ['', '', '', ''], correct_answer: 0 }
  ])

  useEffect(() => {
    loadQuizzes()
  }, [])

  async function loadQuizzes() {
    const { data, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        profiles (full_name)
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    if (data) setQuizzes(data)
  }

  function addQuestion() {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correct_answer: 0 }])
  }

  function updateQuestion(index: number, field: keyof Question, value: any) {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  function updateOption(qIndex: number, oIndex: number, value: string) {
    const updated = [...questions]
    updated[qIndex].options[oIndex] = value
    setQuestions(updated)
  }

  async function createQuiz() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .insert([{
        ...newQuiz,
        creator_id: user.id,
        total_questions: questions.length
      }])
      .select()
      .single()

    if (quiz && !quizError) {
      // Insert questions
      const questionsData = questions.map(q => ({
        quiz_id: quiz.id,
        question_text: q.question,
        options: q.options,
        correct_answer: q.correct_answer
      }))

      await supabase.from('quiz_questions').insert(questionsData)

      setShowCreateModal(false)
      loadQuizzes()
      // Reset form
      setNewQuiz({
        title: '',
        description: '',
        subject: '',
        is_public: true,
        time_limit: 30
      })
      setQuestions([{ question: '', options: ['', '', '', ''], correct_answer: 0 }])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quizzes & Challenges</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Test your knowledge and compete with peers</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            + Create Quiz
          </button>
        </div>

        {/* Quizzes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {quiz.title}
                  </h3>
                  <span className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded">
                    {quiz.subject}
                  </span>
                </div>
                <span className="text-2xl">🎯</span>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {quiz.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center">
                  <span className="mr-2">❓</span>
                  <span>{quiz.total_questions} questions</span>
                </div>
                {quiz.time_limit && (
                  <div className="flex items-center">
                    <span className="mr-2">⏱️</span>
                    <span>{quiz.time_limit} min</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2">
                    {quiz.profiles?.full_name?.[0] || 'C'}
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {quiz.profiles?.full_name || 'Creator'}
                  </span>
                </div>
                <Link
                  href={`/quiz/${quiz.id}`}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Start Quiz
                </Link>
              </div>
            </div>
          ))}
        </div>

        {quizzes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No quizzes available. Create one to get started!</p>
          </div>
        )}
      </div>

      {/* Create Quiz Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4 my-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create Personal Quiz</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quiz Title
                </label>
                <input
                  type="text"
                  value={newQuiz.title}
                  onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Calculus Final Review"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={newQuiz.subject}
                  onChange={(e) => setNewQuiz({ ...newQuiz, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Mathematics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newQuiz.description}
                  onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  rows={2}
                  placeholder="Brief description of the quiz"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time Limit (minutes)
                  </label>
                  <input
                    type="number"
                    value={newQuiz.time_limit}
                    onChange={(e) => setNewQuiz({ ...newQuiz, time_limit: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    min="5"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newQuiz.is_public}
                      onChange={(e) => setNewQuiz({ ...newQuiz, is_public: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Make Public</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-6 max-h-96 overflow-y-auto mb-6">
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Question {qIndex + 1}</h3>
                  
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white mb-3"
                    placeholder="Enter question"
                  />

                  <div className="space-y-2">
                    {q.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={q.correct_answer === oIndex}
                          onChange={() => updateQuestion(qIndex, 'correct_answer', oIndex)}
                          className="text-blue-600"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder={`Option ${oIndex + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addQuestion}
              className="w-full mb-4 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 text-gray-600 dark:text-gray-400 hover:text-blue-500"
            >
              + Add Question
            </button>

            <div className="flex gap-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={createQuiz}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
              >
                Create Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
