import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { useAssemblyUnits, useDeleteAssemblyUnit } from '@/hooks/useApi';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { AssemblyUnit } from '@/types';
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

export default function AssemblyUnitsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useAssemblyUnits({
    page: currentPage,
    pageSize,
    search: searchQuery,
  });

  const deleteUnit = useDeleteAssemblyUnit();

  const handleDelete = async () => {
    if (deleteId) {
      await deleteUnit.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      key: 'serialNumber',
      header: 'Serial Number',
      accessor: (item: AssemblyUnit) => (
        <span className="font-mono text-sm">{item.serialNumber}</span>
      ),
    },
    {
      key: 'productCode',
      header: 'Product Code',
      accessor: (item: AssemblyUnit) => (
        <span className="font-mono">{item.productCode}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (item: AssemblyUnit) => <StatusBadge status={item.status} />,
    },
    {
      key: 'workOrder',
      header: 'Work Order',
      accessor: (item: AssemblyUnit) => (
        <span className="text-sm">{item.workOrderId}</span>
      ),
    },
    {
      key: 'batch',
      header: 'Batch',
      accessor: (item: AssemblyUnit) => (
        <span className="text-sm">{item.batchId}</span>
      ),
    },
    {
      key: 'station',
      header: 'Station',
      accessor: (item: AssemblyUnit) => (
        <span className="text-sm">{item.stationId}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (item: AssemblyUnit) => (
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
            <h1 className="text-3xl font-bold">Assembly Units</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track assembly units in production
            </p>
          </div>
          <Button className="bg-gradient-primary">
            <Plus className="mr-2 h-4 w-4" />
            New Assembly Unit
          </Button>
        </div>

        <div className="bg-card rounded-lg border shadow-sm">
          <DataTable
            data={data?.data || []}
            columns={columns}
            searchPlaceholder="Search by serial number, product code..."
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
                assembly unit and all associated data.
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