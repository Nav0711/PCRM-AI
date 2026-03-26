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
    <div className={cn('stat-card flex flex-col gap-2 animate-fade-in', className)}>
      <div className="flex items-start justify-between">
        <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center bg-primary/10 shadow-sm border border-primary/5', iconClassName)}>
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <button className="text-muted-foreground hover:bg-muted p-1 rounded-lg transition-colors">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight animate-count-up text-foreground">{value}</p>
        <p className="text-xs font-medium text-muted-foreground mt-0.5">{title}</p>
      </div>
      {description && (
        <div className="pt-1">
          <p className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 w-fit px-2 py-0.5 rounded-md flex items-center gap-1">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
