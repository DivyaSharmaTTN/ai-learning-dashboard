/**
 * @branch feature/modern-ai-dashboard-ui
 * @history 2026-07-03 — Weekly progress chart from task created/completed dates
 */
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { Task } from '../../types';
import { buildWeeklyProgressData } from '../../utils/dashboardAnalytics';

interface WeeklyProgressChartProps {
  tasks: Task[];
}

export function WeeklyProgressChart({ tasks }: WeeklyProgressChartProps) {
  const data = buildWeeklyProgressData(tasks);

  return (
    <div className="chart-panel">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fill: 'var(--muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: 'var(--muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text)',
            }}
          />
          <Bar
            dataKey="created"
            name="Created"
            fill="var(--chart-created)"
            radius={[4, 4, 0, 0]}
            animationDuration={800}
          />
          <Bar
            dataKey="completed"
            name="Completed"
            fill="var(--chart-completed)"
            radius={[4, 4, 0, 0]}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
