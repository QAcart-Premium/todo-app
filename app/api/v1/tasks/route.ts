import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { createTaskSchema } from '@/lib/validations/task'

// Helper to format task response with _id
function formatTask(task: { id: string; item: string; isCompleted: boolean; userId: string; createdAt: Date }) {
  return {
    _id: task.id,
    item: task.item,
    isCompleted: task.isCompleted,
    userID: task.userId,
    createdAt: task.createdAt.toISOString(),
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const payload = verifyToken(authHeader)

    if (!payload) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const tasks = await prisma.task.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(tasks.map(formatTask))
  } catch (error) {
    console.error('Get tasks error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const payload = verifyToken(authHeader)

    if (!payload) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const result = createTaskSchema.safeParse(body)
    if (!result.success) {
      const errors = result.error.errors.map(e => e.message)
      return NextResponse.json({ message: errors[0] }, { status: 400 })
    }

    const { item } = result.data

    const task = await prisma.task.create({
      data: {
        item,
        userId: payload.userId,
      },
    })

    return NextResponse.json(formatTask(task), { status: 201 })
  } catch (error) {
    console.error('Create task error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
