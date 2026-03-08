'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function Nav() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <nav className="bg-card-bg py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          QAcart V2
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link
                href="/todo"
                className="text-white hover:text-primary transition-colors"
              >
                Todo
              </Link>
              <button
                onClick={handleLogout}
                className="text-white hover:text-primary transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-white hover:text-primary transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="text-white hover:text-primary transition-colors"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
