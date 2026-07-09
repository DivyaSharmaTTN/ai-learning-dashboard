/**
 * @branch feature/stretch-filters-pagination
 * @history 2026-07-09 — Priority/category filters and paginated task list API
 */
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TaskPaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export function TaskPagination({
  page,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  loading = false,
}: TaskPaginationProps) {
  if (totalCount === 0) {
    return null;
  }

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <nav className="task-pagination" aria-label="Task list pagination">
      <p className="pagination-summary">
        Showing {start}–{end} of {totalCount} tasks
      </p>
      <div className="pagination-controls">
        <button
          type="button"
          className="btn btn-secondary btn-sm pagination-btn"
          onClick={() => onPageChange(page - 1)}
          disabled={loading || page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          Previous
        </button>
        <span className="pagination-page-info" aria-live="polite">
          Page {page} of {Math.max(totalPages, 1)}
        </span>
        <button
          type="button"
          className="btn btn-secondary btn-sm pagination-btn"
          onClick={() => onPageChange(page + 1)}
          disabled={loading || page >= totalPages}
          aria-label="Next page"
        >
          Next
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
