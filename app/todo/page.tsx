'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import TodoItem from '@/components/TodoItem'
import Pagination from '@/components/Pagination'

interface Task {
  _id: string
  item: string
  isCompleted: boolean
}

const ITEMS_PER_PAGE = 5

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 18) return 'Good Afternoon'
  return 'Good Evening'
}

export default function TodoPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchTasks()
    }
  }, [user])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/v1/tasks', {
        headers: {
          Authorization: `Bearer ${user?.access_token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggle = async (id: string, isCompleted: boolean) => {
    try {
      const response = await fetch(`/api/v1/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.access_token}`,
        },
        body: JSON.stringify({ isCompleted }),
      })

      if (response.ok) {
        setTasks(tasks.map(task =>
          task._id === id ? { ...task, isCompleted } : task
        ))
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.access_token}`,
        },
      })

      if (response.ok) {
        const newTasks = tasks.filter(task => task._id !== id)
        setTasks(newTasks)

        // Adjust page if current page becomes empty
        const newTotalPages = Math.ceil(newTasks.length / ITEMS_PER_PAGE)
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages)
        }
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedTasks = tasks.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex justify-between items-center mb-8">
        <h1 data-testid="welcome" className="text-2xl font-bold text-white">
          {getGreeting()}, {user?.firstName}!
        </h1>
        <Link
          href="/todo/new"
          data-testid="add"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition-colors"
        >
          Add Task
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div data-testid="no-todos" className="text-center text-gray-400 py-8">
          No todos yet. Add your first task!
        </div>
      ) : (
        <>
          <div>
            {paginatedTasks.map((task) => (
              <TodoItem
                key={task._id}
                id={task._id}
                item={task.item}
                isCompleted={task.isCompleted}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  )
}
