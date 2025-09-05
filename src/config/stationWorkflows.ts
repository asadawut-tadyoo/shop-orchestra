import { ProcessStepType, ProcessStepConfig, StationWorkflow } from '@/types/workflow';

// Station workflow configurations
export const stationWorkflows: Record<string, ProcessStepConfig[]> = {
  // Station A - Assembly Line
  'station-assembly': [
    {
      id: 'step-1',
      stepNumber: 1,
      type: ProcessStepType.ScanAssemblyUnit,
      name: 'Scan Assembly Unit',
      description: 'Scan the AU barcode to start assembly process',
      isRequired: true,
      expectedInputType: 'barcode',
      validationRules: {
        statusCheck: ['Created']
      }
    },
    {
      id: 'step-2',
      stepNumber: 2,
      type: ProcessStepType.ScanRawMaterial,
      name: 'Scan Raw Materials',
      description: 'Scan and validate all raw materials according to BOM',
      isRequired: true,
      expectedInputType: 'barcode',
      validationRules: {
        bomValidation: true,
        statusCheck: ['Received']
      }
    },
    {
      id: 'step-3',
      stepNumber: 3,
      type: ProcessStepType.Assembled,
      name: 'Mark as Assembled',
      description: 'Complete assembly process',
      isRequired: true,
      expectedInputType: 'confirmation'
    }
  ],
  
  // Station B - Testing
  'station-testing': [
    {
      id: 'step-1',
      stepNumber: 1,
      type: ProcessStepType.ScanAssemblyUnit,
      name: 'Scan Assembly Unit',
      description: 'Scan the AU barcode for testing',
      isRequired: true,
      expectedInputType: 'barcode',
      validationRules: {
        statusCheck: ['Assembled']
      }
    },
    {
      id: 'step-2',
      stepNumber: 2,
      type: ProcessStepType.FinalTest,
      name: 'Final Test',
      description: 'Perform final testing and record results',
      isRequired: true,
      expectedInputType: 'test-result'
    }
  ],
  
  // Station C - Packing
  'station-packing': [
    {
      id: 'step-1',
      stepNumber: 1,
      type: ProcessStepType.ScanAssemblyUnit,
      name: 'Scan Assembly Unit',
      description: 'Scan the AU barcode for packing',
      isRequired: true,
      expectedInputType: 'barcode',
      validationRules: {
        statusCheck: ['Tested', 'Passed']
      }
    },
    {
      id: 'step-2',
      stepNumber: 2,
      type: ProcessStepType.Pack,
      name: 'Pack Product',
      description: 'Pack the product and close AU',
      isRequired: true,
      expectedInputType: 'confirmation'
    }
  ]
};