import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { useWorkOrders, useDeleteWorkOrder } from '@/hooks/useApi';
import { Plus, Edit, Trash2, Eye, AlertCircle } from 'lucide-react';
import { WorkOrder } from '@/types/index';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const priorityColors = {
  Low: 'bg-muted text-muted-foreground',
  Medium: 'bg-info/10 text-info border-info/20',
  High: 'bg-warning/10 text-warning border-warning/20',
  Urgent: 'bg-error/10 text-error border-error/20',
};

export default function WorkOrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useWorkOrders({
    page: currentPage,
    pageSize,
    search: searchQuery,
  });

  const deleteWorkOrder = useDeleteWorkOrder();

  const handleDelete = async () => {
    if (deleteId) {
      await deleteWorkOrder.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      key: 'orderNumber',
      header: 'Order Number',
      accessor: (item: WorkOrder) => (
        <span className="font-mono font-semibold">{item.workOrderNo}</span>
      ),
    },
    {
      key: 'product',
      header: 'Product',
      accessor: (item: WorkOrder) => (
        <div>
          <p className="font-medium">{item.productName}</p>
          <p className="text-xs text-muted-foreground">{item.productCode}</p>
        </div>
      ),
    },
    {
      key: 'quantity',
      header: 'Quantity',
      accessor: (item: WorkOrder) => (
        <div>
          <p className="font-medium">{item.completedQuantity || 0}/{item.quantity}</p>
          <p className="text-xs text-muted-foreground">
            {Math.round(((item.completedQuantity || 0) / item.quantity) * 100)}% complete
          </p>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      accessor: (item: WorkOrder) => (
        <Badge className={cn('border', priorityColors[item.priority])}>
          {item.priority === 'Urgent' && <AlertCircle className="mr-1 h-3 w-3" />}
          {item.priority}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (item: WorkOrder) => <StatusBadge status={item.status} />,
    },
    {
      key: 'dates',
      header: 'Schedule',
      accessor: (item: WorkOrder) => (
        <div className="text-sm">
          <p>Start: {new Date(item.startDate).toLocaleDateString()}</p>
          <p className={cn(
            "text-muted-foreground",
            new Date(item.dueDate) < new Date() && item.status !== 'Completed' && "text-error"
          )}>
            Due: {new Date(item.dueDate).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      accessor: (item: WorkOrder) => (
        <span className="text-sm">{item.customer || '-'}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (item: WorkOrder) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => setDeleteId(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Work Orders</h1>
            <p className="text-muted-foreground mt-1">
              Manage production work orders and track their progress
            </p>
          </div>
          <Button className="bg-gradient-primary">
            <Plus className="mr-2 h-4 w-4" />
            New Work Order
          </Button>
        </div>

        <div className="bg-card rounded-lg border shadow-sm">
          <DataTable
            data={data?.data || []}
            columns={columns}
            searchPlaceholder="Search by order number, product..."
            onSearch={setSearchQuery}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={data?.total || 0}
            isLoading={isLoading}
          />
        </div>

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                work order and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}