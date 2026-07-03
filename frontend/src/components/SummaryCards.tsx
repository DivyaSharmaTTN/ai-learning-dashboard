/**
 * @branch feature/modern-ai-dashboard-ui
 * @history 2026-07-03 — Glass stat cards with sparklines (Synaptix-style)
 */
import {
  AlertCircle,
  CheckCircle2,
  Flame,
  Layers,
  PlayCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { DashboardSummary } from '../types';
import { MiniSparkline } from './ui/MiniSparkline';

interface SummaryCardsProps {
  summary: DashboardSummary;
}

const cards: {
  key: keyof DashboardSummary;
  label: string;
  className: string;
  icon: LucideIcon;
  sparkColor: string;
  trend: 'up' | 'down' | 'flat';
  delta: string;
}[] = [
  {
    key: 'totalItems',
    label: 'Total Items',
    className: 'card-total',
    icon: Layers,
    sparkColor: '#818cf8',
    trend: 'up',
    delta: 'All tasks',
  },
  {
    key: 'completedItems',
    label: 'Completed',
    className: 'card-completed',
    icon: CheckCircle2,
    sparkColor: '#34d399',
    trend: 'up',
    delta: 'Done',
  },
  {
    key: 'inProgressItems',
    label: 'In Progress',
    className: 'card-inprogress',
    icon: PlayCircle,
    sparkColor: '#a78bfa',
    trend: 'flat',
    delta: 'Active',
  },
  {
    key: 'overdueItems',
    label: 'Overdue',
    className: 'card-overdue',
    icon: AlertCircle,
    sparkColor: '#f87171',
    trend: 'down',
    delta: 'Needs attention',
  },
  {
    key: 'highPriorityItems',
    label: 'High Priority',
    className: 'card-high',
    icon: Flame,
    sparkColor: '#fbbf24',
    trend: 'up',
    delta: 'Critical',
  },
];

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <section className="summary-cards" aria-label="Dashboard summary">
      {cards.map(({ key, label, className, icon: Icon, sparkColor, trend, delta }) => (
        <article key={key} className={`summary-card glass-card ${className}`}>
          <div className="summary-card-top">
            <div className="summary-card-icon">
              <Icon size={18} aria-hidden="true" />
            </div>
            <MiniSparkline color={sparkColor} trend={trend} />
          </div>
          <div className="summary-card-body">
            <span className="summary-label">{label}</span>
            <strong className="summary-value">{summary[key]}</strong>
            <span className="summary-delta">{delta}</span>
          </div>
        </article>
      ))}
    </section>
  );
}
