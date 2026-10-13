import { cn } from '../utils/cn';

export interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}

export function StatCard({ icon, label, value, className }: StatCardProps) {
  return (
    <div className={cn('rounded-2xl border border-border bg-card p-4 sm:p-5', className)}>
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary">
        {icon}
      </span>
      <p className="mt-3 font-display text-2xl font-semibold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
