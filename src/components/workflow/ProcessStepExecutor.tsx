import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import BarcodeForm from '@/components/form/BarcodeForm';
import RawMaterialScanForm from '@/components/form/RawMaterialScanForm';
import { ProcessStepConfig, ProcessStepType, WorkflowState } from '@/types/workflow';
import { AssemblyUnit, AssemblyUnitStatus, RawMaterialStatus } from '@/types';
import { assemblyUnitsService } from '@/services/assemblyUnits';
import { ChevronRight, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface ProcessStepExecutorProps {
  workOrderId: string;
  stationId: string;
  stationName: string;
  steps: ProcessStepConfig[];
  onComplete: () => void;
  onCancel: () => void;
}

export default function ProcessStepExecutor({
  workOrderId,
  stationId,
  stationName,
  steps,
  onComplete,
  onCancel
}: ProcessStepExecutorProps) {
  const [workflowState, setWorkflowState] = useState<WorkflowState>({
    currentStepIndex: 0,
    completedSteps: [],
    errors: []
  });
  
  const [barcodeValue, setBarcodeValue] = useState('');
  const [testResult, setTestResult] = useState<'Pass' | 'Fail' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [assemblyUnit, setAssemblyUnit] = useState<AssemblyUnit | null>(null);

  const currentStep = steps[workflowState.currentStepIndex];
  const progress = (workflowState.completedSteps.length / steps.length) * 100;

  const handleScanAssemblyUnit = async (barcode: string) => {
    setIsProcessing(true);
    try {
      // Parse barcode format: ProductCode:SerialNumber
      const [productCode, serialNumber] = barcode.split(':');
      
      if (!productCode || !serialNumber) {
        throw new Error('Invalid barcode format. Expected format: ProductCode:SerialNumber');
      }

      // Get assembly unit by serial
      const unit = await assemblyUnitsService.getBySerial(productCode, serialNumber);
      
      // Validate status based on step requirements
      if (currentStep.validationRules?.statusCheck) {
        const validStatuses = currentStep.validationRules.statusCheck;
        if (!validStatuses.includes(unit.status)) {
          throw new Error(`Invalid assembly unit status. Expected: ${validStatuses.join(', ')}, Got: ${unit.status}`);
        }
      }

      setAssemblyUnit(unit);
      
      // Auto-advance for simple scan steps
      if (currentStep.type === ProcessStepType.ScanAssemblyUnit && 
          steps[workflowState.currentStepIndex + 1]?.type !== ProcessStepType.ScanRawMaterial) {
        moveToNextStep();
      } else if (steps[workflowState.currentStepIndex + 1]?.type === ProcessStepType.ScanRawMaterial) {
        // Move to raw material scanning
        moveToNextStep();
      }
      
      toast.success('Assembly unit scanned successfully');
      setBarcodeValue('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to scan assembly unit');
      setWorkflowState(prev => ({
        ...prev,
        errors: [...prev.errors, error.message]
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTestResult = async (result: 'Pass' | 'Fail') => {
    setIsProcessing(true);
    try {
      if (!assemblyUnit) throw new Error('No assembly unit selected');
      
      // Update status based on test result
      const newStatus = result === 'Pass' ? AssemblyUnitStatus.Passed : AssemblyUnitStatus.Failed;
      await assemblyUnitsService.changeStatus(assemblyUnit.id, newStatus);
      
      if (result === 'Fail') {
        toast.error('Test failed. Assembly unit marked as failed.');
        // Optionally end workflow on failure
        onComplete();
        return;
      }
      
      toast.success('Test passed successfully');
      moveToNextStep();
    } catch (error: any) {
      toast.error(error.message || 'Failed to record test result');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePack = async () => {
    setIsProcessing(true);
    try {
      if (!assemblyUnit) throw new Error('No assembly unit selected');
      
      // Update status to Pack
      await assemblyUnitsService.changeStatus(assemblyUnit.id, AssemblyUnitStatus.Pack);
      
      toast.success('Product packed successfully');
      moveToNextStep();
    } catch (error: any) {
      toast.error(error.message || 'Failed to pack product');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAssembled = async () => {
    setIsProcessing(true);
    try {
      if (!assemblyUnit) throw new Error('No assembly unit selected');
      
      // Update status to Assembled
      await assemblyUnitsService.changeStatus(assemblyUnit.id, AssemblyUnitStatus.Assembled);
      
      toast.success('Assembly completed successfully');
      moveToNextStep();
    } catch (error: any) {
      toast.error(error.message || 'Failed to mark as assembled');
    } finally {
      setIsProcessing(false);
    }
  };

  const moveToNextStep = () => {
    setWorkflowState(prev => {
      const newCompletedSteps = [...prev.completedSteps, prev.currentStepIndex];
      const nextIndex = prev.currentStepIndex + 1;
      
      if (nextIndex >= steps.length) {
        toast.success('Workflow completed successfully!');
        onComplete();
        return prev;
      }
      
      return {
        ...prev,
        currentStepIndex: nextIndex,
        completedSteps: newCompletedSteps,
        errors: []
      };
    });
    
    // Reset inputs
    setBarcodeValue('');
    setTestResult(null);
  };

  const renderStepInput = () => {
    switch (currentStep.type) {
      case ProcessStepType.ScanAssemblyUnit:
        return (
          <BarcodeForm
            label="Scan Assembly Unit Barcode"
            valueCode={barcodeValue}
            onChangeCode={setBarcodeValue}
            onSubmit={handleScanAssemblyUnit}
            isEnable={!isProcessing}
          />
        );
        
      case ProcessStepType.ScanRawMaterial:
        return assemblyUnit ? (
          <RawMaterialScanForm
            assemblyUnit={assemblyUnit}
            onSubmit={moveToNextStep}
            onAccept={() => {
              toast.success('All raw materials consumed');
              moveToNextStep();
            }}
          />
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No assembly unit selected</AlertDescription>
          </Alert>
        );
        
      case ProcessStepType.Test:
      case ProcessStepType.FinalTest:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Record test result for AU: {assemblyUnit?.serialNumber}</p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleTestResult('Pass')}
                disabled={isProcessing}
              >
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                Pass
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleTestResult('Fail')}
                disabled={isProcessing}
              >
                <XCircle className="mr-2 h-4 w-4 text-red-600" />
                Fail
              </Button>
            </div>
          </div>
        );
        
      case ProcessStepType.Pack:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Ready to pack AU: {assemblyUnit?.serialNumber}
            </p>
            <Button
              onClick={handlePack}
              disabled={isProcessing}
              className="w-full"
            >
              Confirm Packing Complete
            </Button>
          </div>
        );
        
      case ProcessStepType.Assembled:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Mark AU as assembled: {assemblyUnit?.serialNumber}
            </p>
            <Button
              onClick={handleAssembled}
              disabled={isProcessing}
              className="w-full"
            >
              Confirm Assembly Complete
            </Button>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{stationName}</CardTitle>
            <Button variant="outline" size="sm" onClick={onCancel}>
              Cancel Process
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">
                  {workflowState.completedSteps.length} / {steps.length} steps
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            {assemblyUnit && (
              <div className="flex items-center gap-4 text-sm">
                <Badge variant="outline">AU: {assemblyUnit.serialNumber}</Badge>
                <Badge variant="outline">Product: {assemblyUnit.productCode}</Badge>
                <Badge variant="outline">Status: {assemblyUnit.status}</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Process Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Process Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {steps.map((step, index) => {
              const isCompleted = workflowState.completedSteps.includes(index);
              const isCurrent = index === workflowState.currentStepIndex;
              
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    isCurrent ? 'bg-primary/5 border-primary' : 
                    isCompleted ? 'bg-green-50 border-green-200' : 
                    'bg-muted/20'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : isCurrent ? (
                      <div className="h-5 w-5 rounded-full border-2 border-primary bg-primary/20" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${isCurrent ? 'text-primary' : ''}`}>
                      Step {step.stepNumber}: {step.name}
                    </p>
                    {step.description && (
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    )}
                  </div>
                  {isCurrent && (
                    <ChevronRight className="h-4 w-4 text-primary animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Step Input */}
      {workflowState.currentStepIndex < steps.length && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {currentStep.name}
            </CardTitle>
            {currentStep.description && (
              <p className="text-sm text-muted-foreground">{currentStep.description}</p>
            )}
          </CardHeader>
          <CardContent>
            {renderStepInput()}
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {workflowState.errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {workflowState.errors[workflowState.errors.length - 1]}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}