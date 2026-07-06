/**
 * @branch feature/fix-search-debounce
 * @history 2026-07-06 — Independent search input with debounce, Enter, and Search button
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Filter, Search } from 'lucide-react';
import type { TaskStatus } from '../types';

interface SearchFilterProps {
  status: TaskStatus | '';
  onStatusChange: (status: TaskStatus | '') => void;
  onSearchApply: (search: string) => void;
  listLoading?: boolean;
}

const statusOptions: { value: TaskStatus | ''; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'NotStarted', label: 'Not Started' },
  { value: 'InProgress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
];

const DEBOUNCE_MS = 400;

export function SearchFilter({
  status,
  onStatusChange,
  onSearchApply,
  listLoading = false,
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
            <option key={opt.value || 'all'} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
