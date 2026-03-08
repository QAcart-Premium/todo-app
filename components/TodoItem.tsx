'use client'

interface TodoItemProps {
  id: string
  item: string
  isCompleted: boolean
  onToggle: (id: string, isCompleted: boolean) => void
  onDelete: (id: string) => void
}

export default function TodoItem({ id, item, isCompleted, onToggle, onDelete }: TodoItemProps) {
  return (
    <div
      data-testid="todo-item"
      className={`flex items-center justify-between p-4 rounded-lg mb-3 ${
        isCompleted ? 'bg-completed-bg' : 'bg-primary'
      }`}
    >
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          data-testid="complete-task"
          checked={isCompleted}
          onChange={() => onToggle(id, !isCompleted)}
          className="w-5 h-5 cursor-pointer accent-white"
        />
        <span
          data-testid="todo-text"
          className={`text-white ${isCompleted ? 'line-through' : ''}`}
        >
          {item}
        </span>
      </div>

      <button
        data-testid="delete"
        onClick={() => onDelete(id)}
        className="text-white hover:text-red-400 transition-colors"
        aria-label="Delete task"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  )
}
