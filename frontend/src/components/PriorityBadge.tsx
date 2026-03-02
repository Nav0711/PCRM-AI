import { TaskPriority } from '@/types';
import { cn } from '@/lib/utils';

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-secondary text-secondary-foreground' },
  medium: { label: 'Medium', className: 'status-in-progress' },
  high: { label: 'High', className: 'status-awaiting' },
  urgent: { label: 'Urgent', className: 'status-rejected' },
};

export function PriorityBadge({ priority, className }: { priority: TaskPriority; className?: string }) {
  const config = priorityConfig[priority];
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', config.className, className)}>
      {config.label}
    </span>
  );
}
