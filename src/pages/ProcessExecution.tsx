import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import StationSelector from '@/components/workflow/StationSelector';
import ProcessStepExecutor from '@/components/workflow/ProcessStepExecutor';
import { stationWorkflows } from '@/config/stationWorkflows';

export default function ProcessExecution() {
  const [workflowActive, setWorkflowActive] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<string>('');
  const [selectedStation, setSelectedStation] = useState<string>('');

  const handleSelectionComplete = (workOrderId: string, stationId: string) => {
    setSelectedWorkOrder(workOrderId);
    setSelectedStation(stationId);
    setWorkflowActive(true);
  };

  const handleWorkflowComplete = () => {
    setWorkflowActive(false);
    setSelectedWorkOrder('');
    setSelectedStation('');
  };

  const handleCancel = () => {
    setWorkflowActive(false);
    setSelectedWorkOrder('');
    setSelectedStation('');
  };

  const getStationName = (stationId: string) => {
    const stationNames: Record<string, string> = {
      'station-assembly': 'Assembly Station',
      'station-testing': 'Testing Station',
      'station-packing': 'Packing Station'
    };
    return stationNames[stationId] || stationId;
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Process Execution</h1>
          <p className="text-muted-foreground mt-1">
            Execute assembly processes based on work order and station
          </p>
        </div>

        {!workflowActive ? (
          <StationSelector onSelectionComplete={handleSelectionComplete} />
        ) : (
          <ProcessStepExecutor
            workOrderId={selectedWorkOrder}
            stationId={selectedStation}
            stationName={getStationName(selectedStation)}
            steps={stationWorkflows[selectedStation] || []}
            onComplete={handleWorkflowComplete}
            onCancel={handleCancel}
          />
        )}
      </div>
    </Layout>
  );
}