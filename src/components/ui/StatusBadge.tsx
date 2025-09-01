import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

const statusVariants = {
  default: 'bg-muted text-muted-foreground',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  error: 'bg-error/10 text-error border-error/20',
  info: 'bg-info/10 text-info border-info/20',
};

const statusMap: Record<string, keyof typeof statusVariants> = {
  // Assembly Unit Status
  Created: 'default',
  Pending: 'warning',
  InProgress: 'info',
  Assembled: 'info',
  Tested: 'info',
  Passed: 'success',
  Pack: 'success',
  Failed: 'error',
  Scrapped: 'error',
  
  // Batch Status
  Planned: 'default',
  Completed: 'success',
  OnHold: 'warning',
  
  // Work Order Status
  Released: 'info',
  Cancelled: 'error',
  
  // Raw Material Status
  Received: 'success',
  Consumed: 'default',
  
  // Station Types
  Assembly: 'info',
  Inspection: 'warning',
  Packaging: 'success',
  Storage: 'default',
};

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const autoVariant = variant || statusMap[status] || 'default';
  
  return (
    <Badge 
      className={cn(
        'border',
        statusVariants[autoVariant],
        className
      )}
    >
      {status}
    </Badge>
  );
}