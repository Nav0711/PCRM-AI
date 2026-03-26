import { cn } from '@/lib/utils';
import { LucideIcon, MoreHorizontal } from 'lucide-react';

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
    <div className={cn('stat-card flex flex-col gap-4 animate-fade-in', className)}>
      <div className="flex items-start justify-between">
        <div className={cn('h-12 w-12 rounded-2xl flex items-center justify-center bg-primary/10 shadow-sm border border-primary/5', iconClassName)}>
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <button className="text-muted-foreground hover:bg-muted p-1.5 rounded-lg transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      <div>
        <p className="text-3xl font-bold tracking-tight animate-count-up text-foreground">{value}</p>
        <p className="text-sm font-medium text-muted-foreground mt-1">{title}</p>
      </div>
      {description && (
        <div className="mt-auto pt-2">
          <p className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 w-fit px-2 py-1 rounded-md flex items-center gap-1">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
