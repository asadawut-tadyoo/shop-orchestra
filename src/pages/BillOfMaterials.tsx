import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/DataTable';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { bomService } from '@/services/bom';
import type { BillOfMaterials, BOMItem } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

const bomItemSchema = z.object({
  materialCode: z.string().min(1, 'Material code is required'),
  materialName: z.string().min(1, 'Material name is required'),
  requiredQty: z.number().min(0.01, 'Quantity must be greater than 0'),
  unit: z.string().optional(),
  specification: z.string().optional(),
});

const bomFormSchema = z.object({
  productCode: z.string().min(1, 'Product code is required'),
  productName: z.string().min(1, 'Product name is required'),
  revision: z.string().min(1, 'Revision is required'),
  bomItems: z.array(bomItemSchema).min(1, 'At least one item is required'),
  isActive: z.boolean().optional(),
});

type BOMFormValues = z.infer<typeof bomFormSchema>;

export default function BillOfMaterials() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBOM, setSelectedBOM] = useState<BillOfMaterials | null>(null);
  const [editingItem, setEditingItem] = useState<BOMItem | null>(null);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const form = useForm<BOMFormValues>({
    resolver: zodResolver(bomFormSchema),
    defaultValues: {
      productCode: '',
      productName: '',
      revision: '1.0',
      bomItems: [],
      isActive: true,
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['boms', page, pageSize, searchQuery],
    queryFn: () => bomService.getAll({
      page,
      pageSize,
      search: searchQuery,
    }),
  });

  const createMutation = useMutation({
    mutationFn: bomService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boms'] });
      toast.success('Bill of Materials created successfully');
      handleCloseForm();
    },
    onError: () => {
      toast.error('Failed to create Bill of Materials');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BillOfMaterials> }) =>
      bomService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boms'] });
      toast.success('Bill of Materials updated successfully');
      handleCloseForm();
    },
    onError: () => {
      toast.error('Failed to update Bill of Materials');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: bomService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boms'] });
      toast.success('Bill of Materials deleted successfully');
      setIsDeleteOpen(false);
      setSelectedBOM(null);
    },
    onError: () => {
      toast.error('Failed to delete Bill of Materials');
    },
  });

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedBOM(null);
    setEditingItem(null);
    setEditingItemIndex(null);
    form.reset();
  };

  const handleOpenForm = (bom?: BillOfMaterials) => {
    if (bom) {
      setSelectedBOM(bom);
      form.reset({
        productCode: bom.productCode,
        productName: bom.productName,
        revision: bom.revision,
        bomItems: bom.bomItems || [],
        isActive: bom.isActive ?? true,
      });
    } else {
      setSelectedBOM(null);
      form.reset();
    }
    setIsFormOpen(true);
  };

  const handleViewBOM = (bom: BillOfMaterials) => {
    setSelectedBOM(bom);
    setIsViewOpen(true);
  };

  const handleDeleteBOM = (bom: BillOfMaterials) => {
    setSelectedBOM(bom);
    setIsDeleteOpen(true);
  };

  const handleAddItem = () => {
    const newItem: BOMItem = {
      materialCode: '',
      materialName: '',
      requiredQty: 1,
      unit: 'PCS',
      specification: '',
    };
    setEditingItem(newItem);
    setEditingItemIndex(null);
  };

  const handleEditItem = (item: BOMItem, index: number) => {
    setEditingItem(item);
    setEditingItemIndex(index);
  };

  const handleSaveItem = () => {
    if (!editingItem) return;

    const currentItems = form.getValues('bomItems');
    if (editingItemIndex !== null) {
      currentItems[editingItemIndex] = editingItem;
    } else {
      currentItems.push(editingItem);
    }
    form.setValue('bomItems', currentItems, { shouldValidate: true });
    setEditingItem(null);
    setEditingItemIndex(null);
  };

  const handleRemoveItem = (index: number) => {
    const currentItems = form.getValues('bomItems');
    currentItems.splice(index, 1);
    form.setValue('bomItems', currentItems, { shouldValidate: true });
  };

  const onSubmit = (values: BOMFormValues) => {
    if (selectedBOM) {
      updateMutation.mutate({ id: selectedBOM.id, data: values as any });
    } else {
      createMutation.mutate(values as any);
    }
  };

  const columns = [
    {
      key: 'productCode',
      header: 'Product Code',
      accessor: (item: BillOfMaterials) => (
        <span className="font-medium text-foreground">{item.productCode}</span>
      ),
    },
    {
      key: 'productName',
      header: 'Product Name',
      accessor: (item: BillOfMaterials) => item.productName,
    },
    {
      key: 'revision',
      header: 'Revision',
      accessor: (item: BillOfMaterials) => (
        <Badge variant="outline">{item.revision}</Badge>
      ),
    },
    {
      key: 'itemCount',
      header: 'Items',
      accessor: (item: BillOfMaterials) => (
        <span className="text-muted-foreground">
          {item.bomItems?.length || 0} items
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (item: BillOfMaterials) => (
        <Badge variant={item.isActive ? 'default' : 'secondary'}>
          {item.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (item: BillOfMaterials) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleViewBOM(item)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleOpenForm(item)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteBOM(item)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bill of Materials</h1>
            <p className="text-muted-foreground mt-1">
              Manage product recipes and material requirements
            </p>
          </div>
          <Button onClick={() => handleOpenForm()}>
            <Plus className="mr-2 h-4 w-4" />
            Create BOM
          </Button>
        </div>

        <DataTable
          data={data?.data || []}
          columns={columns}
          searchPlaceholder="Search by product code or name..."
          onSearch={setSearchQuery}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          currentPage={page}
          pageSize={pageSize}
          totalItems={data?.total || 0}
          isLoading={isLoading}
        />

        {/* Create/Edit Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedBOM ? 'Edit Bill of Materials' : 'Create Bill of Materials'}
              </DialogTitle>
              <DialogDescription>
                Define the materials required to produce this product
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="productCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Code</FormLabel>
                        <FormControl>
                          <Input placeholder="PROD-001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="productName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Product Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="revision"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Revision</FormLabel>
                        <FormControl>
                          <Input placeholder="1.0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">BOM Items</h3>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </div>

                  {form.watch('bomItems').length > 0 && (
                    <ScrollArea className="h-[300px] rounded-md border">
                      <div className="p-4 space-y-2">
                        {form.watch('bomItems').map((item, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Material Code</p>
                                    <p className="font-medium">{item.materialCode}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Material Name</p>
                                    <p className="font-medium">{item.materialName}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Quantity</p>
                                    <p className="font-medium">
                                      {item.requiredQty} {item.unit || 'PCS'}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Specification</p>
                                    <p className="font-medium">{item.specification || '-'}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditItem(item as BOMItem, index)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveItem(index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  )}

                  {form.watch('bomItems').length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No items added yet. Click "Add Item" to start.
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleCloseForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {selectedBOM ? 'Update' : 'Create'} BOM
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Item Edit Dialog */}
        {editingItem && (
          <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingItemIndex !== null ? 'Edit Item' : 'Add Item'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Material Code</Label>
                  <Input
                    value={editingItem.materialCode}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, materialCode: e.target.value })
                    }
                    placeholder="MAT-001"
                  />
                </div>
                <div>
                  <Label>Material Name</Label>
                  <Input
                    value={editingItem.materialName}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, materialName: e.target.value })
                    }
                    placeholder="Material Name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Required Quantity</Label>
                    <Input
                      type="number"
                      value={editingItem.requiredQty}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          requiredQty: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="1"
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label>Unit</Label>
                    <Input
                      value={editingItem.unit || ''}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, unit: e.target.value })
                      }
                      placeholder="PCS"
                    />
                  </div>
                </div>
                <div>
                  <Label>Specification (Optional)</Label>
                  <Input
                    value={editingItem.specification || ''}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, specification: e.target.value })
                    }
                    placeholder="Additional specifications..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingItem(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveItem}>Save Item</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* View Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Bill of Materials Details</DialogTitle>
            </DialogHeader>
            {selectedBOM && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Product Code</p>
                      <p className="font-medium">{selectedBOM.productCode}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Product Name</p>
                      <p className="font-medium">{selectedBOM.productName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Revision</p>
                      <p className="font-medium">{selectedBOM.revision}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant={selectedBOM.isActive ? 'default' : 'secondary'}>
                        {selectedBOM.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>BOM Items ({selectedBOM.bomItems?.length || 0})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedBOM.bomItems?.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Material Code</p>
                              <p className="text-sm font-medium">{item.materialCode}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Material Name</p>
                              <p className="text-sm font-medium">{item.materialName}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Required Qty</p>
                              <p className="text-sm font-medium">
                                {item.requiredQty} {item.unit || 'PCS'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Specification</p>
                              <p className="text-sm font-medium">{item.specification || '-'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Bill of Materials</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete BOM for "{selectedBOM?.productName}"? 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => selectedBOM && deleteMutation.mutate(selectedBOM.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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