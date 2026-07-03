/**
 * @branch feature/modern-ai-dashboard-ui
 * @history 2026-07-03 — Avatar with initials from owner name
 */
import { getInitials } from '../../utils/dashboardAnalytics';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = { sm: 'avatar--sm', md: 'avatar--md', lg: 'avatar--lg' };

export function Avatar({ name, size = 'md' }: AvatarProps) {
  return (
    <div
      className={`avatar ${sizeMap[size]}`}
      title={name}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
}
