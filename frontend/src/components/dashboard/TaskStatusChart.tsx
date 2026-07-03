/**
 * @branch feature/modern-ai-dashboard-ui
 * @history 2026-07-03 — Task status distribution chart (Recharts)
 */
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { DashboardSummary } from '../../types';
import { buildStatusChartData } from '../../utils/dashboardAnalytics';

interface TaskStatusChartProps {
  summary: DashboardSummary;
}

export function TaskStatusChart({ summary }: TaskStatusChartProps) {
  const data = buildStatusChartData(summary);

  if (summary.totalItems === 0) {
    return (
      <div className="chart-panel chart-panel--empty">
        <p>No task data yet</p>
      </div>
    );
  }

  return (
    <div className="chart-panel">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text)',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="chart-legend">
        {data.map((item) => (
          <span key={item.name} className="chart-legend-item">
            <span className="chart-legend-dot" style={{ background: item.fill }} />
            {item.name} ({item.value})
          </span>
        ))}
      </div>
    </div>
  );
}
