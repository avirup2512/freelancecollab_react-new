import { Badge } from '../ui/_badge';

interface StatusBadgeProps {
  status: 'active' | 'archived' | 'blocked';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    active: {
      label: 'Active',
      className: 'bg-green-100 text-green-800 hover:bg-green-100',
    },
    archived: {
      label: 'Archived',
      className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
    },
    blocked: {
      label: 'Blocked',
      className: 'bg-red-100 text-red-800 hover:bg-red-100',
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant="secondary" className={config?.className}>
      {config?.label}
    </Badge>
  );
}
export default StatusBadge;