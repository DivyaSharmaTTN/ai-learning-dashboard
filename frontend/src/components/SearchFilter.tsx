/**
 * @branch feature/modern-ai-dashboard-ui
 * @history 2026-07-03 — Search/filter bar with icons and modern styling
 */
import { Filter, Search } from 'lucide-react';
import type { TaskFilters, TaskStatus } from '../types';

interface SearchFilterProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
}

const statusOptions: { value: TaskStatus | ''; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'NotStarted', label: 'Not Started' },
  { value: 'InProgress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
];

export function SearchFilter({ filters, onChange }: SearchFilterProps) {
  return (
    <section className="search-filter" aria-label="Search and filter tasks">
      <div className="search-field">
        <Search size={18} className="field-icon" aria-hidden="true" />
        <label htmlFor="search-input" className="visually-hidden">
          Search
        </label>
        <input
          id="search-input"
          type="search"
          className="input-with-icon"
          placeholder="Search by title or description..."
          value={filters.search ?? ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </div>

      <div className="filter-field">
        <Filter size={18} className="field-icon" aria-hidden="true" />
        <label htmlFor="status-filter" className="visually-hidden">
          Status
        </label>
        <select
          id="status-filter"
          className="input-with-icon select-with-icon"
          value={filters.status ?? ''}
          onChange={(e) =>
            onChange({ ...filters, status: e.target.value as TaskStatus | '' })
          }
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
