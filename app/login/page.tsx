'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Login failed')
        setIsSubmitting(false)
        return
      }

      login(data)
      router.push('/todo')
    } catch {
      setError('An error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-card-bg rounded-lg p-8">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Login</h1>

          {error && (
            <div
              data-testid="error-alert"
              className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded mb-4"
            >
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-white mb-2">
              Email
            </label>
            <input
              type="text"
              id="email"
              data-testid="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-page-bg text-white border border-gray-600 rounded focus:outline-none focus:border-primary"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-white mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              data-testid="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-page-bg text-white border border-gray-600 rounded focus:outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            data-testid="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/80 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-center text-gray-400 mt-4">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              data-testid="signup"
              className="text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
