/**
 * @branch feature/modern-ai-dashboard-ui
 * @history 2026-07-03 — Decorative sparkline for summary stat cards
 */
interface MiniSparklineProps {
  color: string;
  trend?: 'up' | 'down' | 'flat';
}

const paths = {
  up: 'M0,18 L8,14 L16,16 L24,10 L32,12 L40,4 L48,6 L56,2',
  down: 'M0,6 L8,10 L16,8 L24,14 L32,12 L40,18 L48,16 L56,20',
  flat: 'M0,12 L8,11 L16,13 L24,12 L32,11 L40,12 L48,11 L56,12',
};

export function MiniSparkline({ color, trend = 'up' }: MiniSparklineProps) {
  return (
    <svg
      className="mini-sparkline"
      viewBox="0 0 56 22"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d={paths[trend]}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
