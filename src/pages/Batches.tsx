import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { useBatches, useDeleteBatch } from '@/hooks/useApi';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Batch } from '@/types';
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
import { Progress } from '@/components/ui/progress';

export default function BatchesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useBatches({
    page: currentPage,
    pageSize,
    search: searchQuery,
  });

  const deleteBatch = useDeleteBatch();

  const handleDelete = async () => {
    if (deleteId) {
      await deleteBatch.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      key: 'batchNumber',
      header: 'Batch Number',
      accessor: (item: Batch) => (
        <span className="font-mono font-semibold">{item.batchNumber}</span>
      ),
    },
    {
      key: 'workOrder',
      header: 'Work Order',
      accessor: (item: Batch) => (
        <span className="text-sm">{item.workOrderId}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (item: Batch) => <StatusBadge status={item.status} />,
    },
    {
      key: 'progress',
      header: 'Progress',
      accessor: (item: Batch) => {
        const percentage = (item.actualQuantity / item.plannedQuantity) * 100;
        return (
          <div className="w-32 space-y-1">
            <Progress value={percentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {item.actualQuantity}/{item.plannedQuantity} units
            </p>
          </div>
        );
      },
    },
    {
      key: 'dates',
      header: 'Schedule',
      accessor: (item: Batch) => (
        <div className="text-sm">
          <p>Start: {item.startDate ? new Date(item.startDate).toLocaleDateString() : '-'}</p>
          <p className="text-muted-foreground">
            End: {item.endDate ? new Date(item.endDate).toLocaleDateString() : '-'}
          </p>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (item: Batch) => (
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
            <h1 className="text-3xl font-bold">Production Batches</h1>
            <p className="text-muted-foreground mt-1">
              Manage production batches and track their progress
            </p>
          </div>
          <Button className="bg-gradient-primary">
            <Plus className="mr-2 h-4 w-4" />
            New Batch
          </Button>
        </div>

        {/* <div className="bg-card rounded-lg border shadow-sm">
          <DataTable
            data={data?.data || []}
            columns={columns}
            searchPlaceholder="Search by batch number..."
            onSearch={setSearchQuery}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={data?.total || 0}
            isLoading={isLoading}
          />
        </div> */}

        {/* <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                batch and all associated records.
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
        </AlertDialog> */}
      </div>
    </Layout>
  );
}