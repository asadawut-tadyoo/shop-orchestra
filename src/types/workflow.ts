// Workflow and Process Step Types

export enum ProcessStepType {
  ScanAssemblyUnit = 'ScanAssemblyUnit',
  ScanRawMaterial = 'ScanRawMaterial',
  Test = 'Test',
  Pack = 'Pack',
  Assembled = 'Assembled',
  FinalTest = 'FinalTest'
}

export interface ProcessStepConfig {
  id: string;
  stepNumber: number;
  type: ProcessStepType;
  name: string;
  description?: string;
  isRequired: boolean;
  expectedInputType?: 'barcode' | 'test-result' | 'confirmation';
  validationRules?: {
    bomValidation?: boolean;
    statusCheck?: string[];
  };
}

export interface StationWorkflow {
  stationId: string;
  stationName: string;
  workOrderId: string;
  steps: ProcessStepConfig[];
}

export interface WorkflowState {
  currentStepIndex: number;
  completedSteps: number[];
  assemblyUnit?: any;
  lastScannedCode?: string;
  errors: string[];
}