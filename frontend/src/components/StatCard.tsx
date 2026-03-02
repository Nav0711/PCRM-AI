import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  className?: string;
  iconClassName?: string;
}

export function StatCard({ title, value, icon: Icon, description, className, iconClassName }: StatCardProps) {
  return (
    <div className={cn('stat-card animate-fade-in', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1 animate-count-up">{value}</p>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center bg-primary/10', iconClassName)}>
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
