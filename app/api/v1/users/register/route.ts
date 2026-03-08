import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword, signToken } from '@/lib/auth'
import { registerSchema } from '@/lib/validations/user'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const result = registerSchema.safeParse(body)
    if (!result.success) {
      const errors = result.error.errors.map(e => e.message)
      return NextResponse.json({ message: errors[0] }, { status: 400 })
    }

    const { firstName, lastName, email, password } = result.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ message: 'Email already exists' }, { status: 400 })
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    })

    // Generate token
    const access_token = signToken({ userId: user.id, email: user.email })

    return NextResponse.json({
      access_token,
      userID: user.id,
      firstName: user.firstName,
    }, { status: 201 })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
