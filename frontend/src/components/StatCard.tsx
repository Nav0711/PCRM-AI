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
    <div className={cn('stat-card flex flex-col gap-1.5 sm:gap-2 animate-fade-in', className)}>
      <div className="flex items-start justify-between">
        <div className={cn('h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center bg-primary/10 shadow-sm border border-primary/5', iconClassName)}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        </div>
        <button className="text-muted-foreground hover:bg-muted p-1 rounded-lg transition-colors">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="mt-0.5">
        <p className="text-xl sm:text-2xl font-bold tracking-tight animate-count-up text-foreground">{value}</p>
        <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mt-0.5 leading-tight">{title}</p>
      </div>
      {description && (
        <div className="pt-1">
          <p className="text-[10px] sm:text-xs font-semibold text-emerald-500 bg-emerald-500/10 w-fit px-1.5 py-0.5 rounded flex items-center gap-1">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
