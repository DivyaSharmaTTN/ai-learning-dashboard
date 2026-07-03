/**
 * @branch feature/modern-ai-dashboard-ui
 * @history 2026-07-03 — Reusable skeleton loading primitives
 */
interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

export function Skeleton({
  className = '',
  width,
  height,
  rounded = false,
}: SkeletonProps) {
  const style = {
    width: width ?? undefined,
    height: height ?? undefined,
  };

  return (
    <div
      className={`skeleton ${rounded ? 'skeleton--rounded' : ''} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="dashboard-skeleton" aria-busy="true" aria-label="Loading dashboard">
      <div className="skeleton-header">
        <Skeleton width="280px" height="32px" />
        <Skeleton width="200px" height="18px" />
      </div>
      <div className="summary-cards">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="summary-card skeleton-card">
            <Skeleton width="40px" height="40px" rounded />
            <Skeleton width="80px" height="14px" />
            <Skeleton width="48px" height="28px" />
          </div>
        ))}
      </div>
      <div className="dashboard-grid">
        <Skeleton className="skeleton-chart" height={260} />
        <Skeleton className="skeleton-chart" height={260} />
        <Skeleton className="skeleton-panel" height={200} />
        <Skeleton className="skeleton-panel" height={200} />
        <Skeleton className="skeleton-panel" height={200} />
      </div>
      <Skeleton height={52} />
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} height={88} className="skeleton-task" />
      ))}
    </div>
  );
}
