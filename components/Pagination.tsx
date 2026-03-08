'use client'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex justify-center space-x-2 mt-6">
      {pages.map((page) => (
        <button
          key={page}
          data-test-id="pagination-link"
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded ${
            currentPage === page
              ? 'bg-primary text-white'
              : 'bg-card-bg text-white hover:bg-primary/70'
          } transition-colors`}
        >
          {page}
        </button>
      ))}
    </div>
  )
}
