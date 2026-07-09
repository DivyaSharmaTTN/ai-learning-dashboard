/**
 * @branch feature/stretch-filters-pagination
 * @history 2026-07-09 — Priority/category filters alongside search and status
 * @history 2026-07-06 — Independent search input with debounce, Enter, and Search button
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Filter, Search, X } from 'lucide-react';
import type { TaskCategory, TaskPriority, TaskStatus } from '../types';

interface SearchFilterProps {
  status: TaskStatus | '';
  priority: TaskPriority | '';
  category: TaskCategory | '';
  onStatusChange: (status: TaskStatus | '') => void;
  onPriorityChange: (priority: TaskPriority | '') => void;
  onCategoryChange: (category: TaskCategory | '') => void;
  onSearchApply: (search: string) => void;
  onClearFilters: () => void;
  listLoading?: boolean;
  hasActiveFilters?: boolean;
}

const statusOptions: { value: TaskStatus | ''; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'NotStarted', label: 'Not Started' },
  { value: 'InProgress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
];

const priorityOptions: { value: TaskPriority | ''; label: string }[] = [
  { value: '', label: 'All priorities' },
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

const categoryOptions: { value: TaskCategory | ''; label: string }[] = [
  { value: '', label: 'All categories' },
  { value: 'Learning', label: 'Learning' },
  { value: 'Project', label: 'Project' },
  { value: 'Certification', label: 'Certification' },
  { value: 'Other', label: 'Other' },
];

const DEBOUNCE_MS = 400;

export function SearchFilter({
  status,
  priority,
  category,
  onStatusChange,
  onPriorityChange,
  onCategoryChange,
  onSearchApply,
  onClearFilters,
  listLoading = false,
  hasActiveFilters = false,
}: SearchFilterProps) {
  const [searchInput, setSearchInput] = useState('');
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelDebounce = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  const applySearchNow = useCallback(
    (value: string) => {
      cancelDebounce();
      onSearchApply(value);
    },
    [cancelDebounce, onSearchApply],
  );

  const scheduleDebouncedSearch = useCallback(
    (value: string) => {
      cancelDebounce();
      debounceTimerRef.current = setTimeout(() => {
        onSearchApply(value);
      }, DEBOUNCE_MS);
    },
    [cancelDebounce, onSearchApply],
  );

  useEffect(() => cancelDebounce, [cancelDebounce]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    scheduleDebouncedSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applySearchNow(searchInput);
  };

  const handleClear = () => {
    setSearchInput('');
    cancelDebounce();
    onClearFilters();
  };

  return (
    <section className="search-filter" aria-label="Search and filter tasks">
      <form className="search-field search-form" onSubmit={handleSubmit}>
        <Search size={18} className="field-icon" aria-hidden="true" />
        <label htmlFor="search-input" className="visually-hidden">
          Search tasks
        </label>
        <input
          id="search-input"
          type="search"
          className="input-with-icon"
          placeholder="Search by title or description..."
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          autoComplete="off"
        />
        <button
          type="submit"
          className="btn btn-secondary btn-sm search-submit-btn"
          disabled={listLoading}
        >
          Search
        </button>
      </form>

      <div className="filter-row">
        <div className="filter-field">
          <Filter size={18} className="field-icon" aria-hidden="true" />
          <label htmlFor="status-filter" className="visually-hidden">
            Status filter
          </label>
          <select
            id="status-filter"
            className="input-with-icon select-with-icon"
            value={status}
            onChange={(e) => onStatusChange(e.target.value as TaskStatus | '')}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value || 'all-status'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="priority-filter" className="visually-hidden">
            Priority filter
          </label>
          <select
            id="priority-filter"
            className="input-with-icon select-with-icon select-no-icon"
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value as TaskPriority | '')}
          >
            {priorityOptions.map((opt) => (
              <option key={opt.value || 'all-priority'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="category-filter" className="visually-hidden">
            Category filter
          </label>
          <select
            id="category-filter"
            className="input-with-icon select-with-icon select-no-icon"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value as TaskCategory | '')}
          >
            {categoryOptions.map((opt) => (
              <option key={opt.value || 'all-category'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn-secondary btn-sm clear-filters-btn"
            onClick={handleClear}
            disabled={listLoading}
          >
            <X size={14} aria-hidden="true" />
            Clear filters
          </button>
        )}
      </div>
    </section>
  );
}
