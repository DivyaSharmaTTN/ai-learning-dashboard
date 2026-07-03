import type { DashboardSummary } from '../types';

interface SummaryCardsProps {
  summary: DashboardSummary;
}

const cards = [
  { key: 'totalItems' as const, label: 'Total Items', className: 'card-total' },
  { key: 'completedItems' as const, label: 'Completed', className: 'card-completed' },
  { key: 'inProgressItems' as const, label: 'In Progress', className: 'card-inprogress' },
  { key: 'overdueItems' as const, label: 'Overdue', className: 'card-overdue' },
  { key: 'highPriorityItems' as const, label: 'High Priority', className: 'card-high' },
];

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <section className="summary-cards" aria-label="Dashboard summary">
      {cards.map(({ key, label, className }) => (
        <article key={key} className={`summary-card ${className}`}>
          <span className="summary-label">{label}</span>
          <strong className="summary-value">{summary[key]}</strong>
        </article>
      ))}
    </section>
  );
}
