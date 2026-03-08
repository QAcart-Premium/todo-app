import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { updateTaskSchema } from '@/lib/validations/task'

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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    const payload = verifyToken(authHeader)

    if (!payload) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const task = await prisma.task.findFirst({
      where: {
        id: params.id,
        userId: payload.userId,
      },
    })

    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json(formatTask(task))
  } catch (error) {
    console.error('Get task error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    const payload = verifyToken(authHeader)

    if (!payload) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const result = updateTaskSchema.safeParse(body)
    if (!result.success) {
      const errors = result.error.errors.map(e => e.message)
      return NextResponse.json({ message: errors[0] }, { status: 400 })
    }

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: params.id,
        userId: payload.userId,
      },
    })

    if (!existingTask) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 })
    }

    const task = await prisma.task.update({
      where: { id: params.id },
      data: result.data,
    })

    return NextResponse.json(formatTask(task))
  } catch (error) {
    console.error('Update task error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    const payload = verifyToken(authHeader)

    if (!payload) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: params.id,
        userId: payload.userId,
      },
    })

    if (!existingTask) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 })
    }

    await prisma.task.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Delete task error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
