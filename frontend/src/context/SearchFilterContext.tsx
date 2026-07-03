/**
 * @branch feature/modern-ai-dashboard-ui
 * @history 2026-07-03 — Shared search for topbar + dashboard task list
 */
import { createContext, useContext, useMemo, useState } from 'react';
import type { TaskFilters } from '../types';

interface SearchFilterContextValue {
  filters: TaskFilters;
  setFilters: (filters: TaskFilters) => void;
  setSearch: (search: string) => void;
}

const SearchFilterContext = createContext<SearchFilterContextValue | null>(null);

export function SearchFilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<TaskFilters>({ search: '', status: '' });

  const setSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const value = useMemo(
    () => ({ filters, setFilters, setSearch }),
    [filters],
  );

  return (
    <SearchFilterContext.Provider value={value}>
      {children}
    </SearchFilterContext.Provider>
  );
}

export function useSearchFilter() {
  const context = useContext(SearchFilterContext);
  if (!context) {
    throw new Error('useSearchFilter must be used within SearchFilterProvider');
  }
  return context;
}
