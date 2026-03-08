import { z } from 'zod'

export const createTaskSchema = z.object({
  item: z.string().min(3, 'Task must be at least 3 characters'),
})

export const updateTaskSchema = z.object({
  item: z.string().min(3, 'Task must be at least 3 characters').optional(),
  isCompleted: z.boolean().optional(),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
