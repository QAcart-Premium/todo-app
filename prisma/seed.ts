import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.task.deleteMany()
  await prisma.user.deleteMany()

  // Create a test user
  const hashedPassword = await bcrypt.hash('SuperSecret#1', 10)
  const user = await prisma.user.create({
    data: {
      firstName: 'QAcart',
      lastName: 'User',
      email: 'user@qacart.com',
      password: hashedPassword,
    },
  })

  // Create sample tasks
  await prisma.task.createMany({
    data: [
      { item: 'Learn Next.js', isCompleted: false, userId: user.id },
      { item: 'Build a todo app', isCompleted: true, userId: user.id },
      { item: 'Write tests', isCompleted: false, userId: user.id },
    ],
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
