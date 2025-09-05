import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWorkOrders } from '@/hooks/useApi';
import { WorkOrder } from '@/types';
import { Factory, Package, TestTube } from 'lucide-react';

interface StationSelectorProps {
  onSelectionComplete: (workOrderId: string, stationId: string) => void;
}

const stations = [
  {
    id: 'station-assembly',
    name: 'Assembly Station',
    icon: Factory,
    description: 'Assembly and raw material consumption'
  },
  {
    id: 'station-testing',
    name: 'Testing Station',
    icon: TestTube,
    description: 'Quality testing and validation'
  },
  {
    id: 'station-packing',
    name: 'Packing Station',
    icon: Package,
    description: 'Final packing and shipping preparation'
  }
];

export default function StationSelector({ onSelectionComplete }: StationSelectorProps) {
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<string>('');
  const [selectedStation, setSelectedStation] = useState<string>('');
  const { data: workOrdersData } = useWorkOrders({ pageSize: 100 });

  const workOrders = workOrdersData?.data || [];
  const activeWorkOrders = workOrders.filter(wo => 
    wo.status === 'Released' || wo.status === 'InProgress'
  );

  const handleStart = () => {
    if (selectedWorkOrder && selectedStation) {
      onSelectionComplete(selectedWorkOrder, selectedStation);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Work Order and Station</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Work Order</label>
            <Select value={selectedWorkOrder} onValueChange={setSelectedWorkOrder}>
              <SelectTrigger>
                <SelectValue placeholder="Select a work order" />
              </SelectTrigger>
              <SelectContent>
                {activeWorkOrders.map((wo) => (
                  <SelectItem key={wo.id} value={wo.id}>
                    {wo.workOrderNo} - {wo.productName} ({wo.quantity} units)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Station</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stations.map((station) => {
                const Icon = station.icon;
                return (
                  <Card
                    key={station.id}
                    className={`cursor-pointer transition-all ${
                      selectedStation === station.id
                        ? 'ring-2 ring-primary border-primary'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedStation(station.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center space-y-2">
                        <Icon className="h-8 w-8 text-primary" />
                        <h3 className="font-semibold text-sm">{station.name}</h3>
                        <p className="text-xs text-muted-foreground text-center">
                          {station.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Button
            onClick={handleStart}
            disabled={!selectedWorkOrder || !selectedStation}
            className="w-full"
          >
            Start Process
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}