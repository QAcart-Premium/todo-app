'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function NewTodoPage() {
  const [item, setItem] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/v1/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.access_token}`,
        },
        body: JSON.stringify({ item }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to create task')
        setIsSubmitting(false)
        return
      }

      router.push('/todo')
    } catch {
      setError('An error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-card-bg rounded-lg p-8">
        <h1 data-testid="header" className="text-2xl font-bold text-white mb-2 text-center">
          Create New Task
        </h1>
        <p data-testid="sub-header" className="text-gray-400 mb-6 text-center">
          Add a new task to your todo list
        </p>

        {error && (
          <div
            data-testid="error-message"
            className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded mb-4"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="item" className="block text-white mb-2">
              Task
            </label>
            <input
              type="text"
              id="item"
              data-testid="new-todo"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="Enter your task..."
              className="w-full px-4 py-2 bg-page-bg text-white border border-gray-600 rounded focus:outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            data-testid="submit-newTask"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/80 transition-colors disabled:opacity-50 mb-4"
          >
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </button>

          <Link
            href="/todo"
            data-testid="back"
            className="block text-center text-gray-400 hover:text-white transition-colors"
          >
            Back to Todo List
          </Link>
        </form>
      </div>
    </div>
  )
}
