/**
 * @branch feature/modern-ai-dashboard-ui
 * @history 2026-07-03 — AI insights panel derived from real dashboard data
 */
import { Lightbulb, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import type { DashboardSummary, Task } from '../../types';
import { buildAiInsights, type AiInsight } from '../../utils/dashboardAnalytics';

interface AiInsightsProps {
  summary: DashboardSummary;
  tasks: Task[];
}

const iconMap = {
  success: TrendingUp,
  warning: AlertTriangle,
  info: Lightbulb,
  accent: Sparkles,
};

export function AiInsights({ summary, tasks }: AiInsightsProps) {
  const insights = buildAiInsights(summary, tasks);

  return (
    <section className="side-panel ai-insights" aria-label="AI Insights">
      <header className="panel-header">
        <Sparkles size={18} className="panel-icon" />
        <h2>AI Insights</h2>
      </header>
      <ul className="insights-list">
        {insights.map((insight: AiInsight) => {
          const Icon = iconMap[insight.type];
          return (
            <li key={insight.id} className={`insight-card insight-${insight.type}`}>
              <Icon size={16} aria-hidden="true" />
              <div>
                <strong>{insight.title}</strong>
                <p>{insight.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
