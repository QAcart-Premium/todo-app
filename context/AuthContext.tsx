'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import Cookies from 'js-cookie'

interface User {
  access_token: string
  userID: string
  firstName: string
}

interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const access_token = Cookies.get('access_token')
    const userID = Cookies.get('userID')
    const firstName = Cookies.get('firstName')

    if (access_token && userID && firstName) {
      setUser({ access_token, userID, firstName })
    }
    setIsLoading(false)
  }, [])

  const login = (userData: User) => {
    // Set cookies
    Cookies.set('access_token', userData.access_token, { expires: 7 })
    Cookies.set('userID', userData.userID, { expires: 7 })
    Cookies.set('firstName', userData.firstName, { expires: 7 })
    setUser(userData)
  }

  const logout = () => {
    // Clear cookies
    Cookies.remove('access_token')
    Cookies.remove('userID')
    Cookies.remove('firstName')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
