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
    <section className="search-filter">
      <label htmlFor="search-input">Search</label>
      <input
        id="search-input"
        type="search"
        placeholder="Search by title or description..."
        value={filters.search ?? ''}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />

      <label htmlFor="status-filter">Status</label>
      <select
        id="status-filter"
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
    </section>
  );
}
