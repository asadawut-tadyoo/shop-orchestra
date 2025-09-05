import { ComponentType } from 'react';
import RMCheck from '@/pages/RMCheck';
import RecievePage from '@/pages/RecievePage';
import AssemblyPage from '@/pages/AssemblyPage';
import TestingPage from '@/pages/TestingPage';
import PackingPage from '@/pages/PackingPage';

export interface PageConfig {
  id: string;
  name: string;
  component: ComponentType<any>;
  description?: string;
  barcodeFormConfig: {
    label: string;
    placeholder?: string;
    autoSubmit: boolean;
    validationRules?: {
      pattern?: RegExp;
      minLength?: number;
      maxLength?: number;
    };
  };
  apiEndpoints?: {
    fetchData?: string;
    submitData?: string;
    validateBarcode?: string;
  };
  workflow?: {
    nextPage?: string;
    previousPage?: string;
    requiresAuth?: boolean;
  };
}

export const pageConfigurations: PageConfig[] = [
  {
    id: 'receive',
    name: 'Receive Materials',
    component: RecievePage,
    description: 'Scan and receive incoming raw materials',
    barcodeFormConfig: {
      label: 'Scan Material Barcode',
      placeholder: 'Scan incoming material...',
      autoSubmit: true,
      validationRules: {
        minLength: 8,
        pattern: /^RM-/
      }
    },
    apiEndpoints: {
      fetchData: '/api/rawmaterials',
      submitData: '/api/rawmaterials/receive',
      validateBarcode: '/api/rawmaterials/validate'
    },
    workflow: {
      nextPage: 'rmcheck',
      requiresAuth: true
    }
  },
  {
    id: 'rmcheck',
    name: 'Raw Material Check',
    component: RMCheck,
    description: 'Verify and check raw materials against BOM',
    barcodeFormConfig: {
      label: 'Scan Customer Barcode',
      placeholder: 'Scan customer code...',
      autoSubmit: true
    },
    apiEndpoints: {
      fetchData: '/api/assemblyunits',
      submitData: '/api/assemblyunits/consume-rawmaterial'
    },
    workflow: {
      previousPage: 'receive',
      nextPage: 'assembly',
      requiresAuth: true
    }
  },
  {
    id: 'assembly',
    name: 'Assembly Station',
    component: AssemblyPage,
    description: 'Assemble products according to work order',
    barcodeFormConfig: {
      label: 'Scan Assembly Unit',
      placeholder: 'Scan AU barcode...',
      autoSubmit: true,
      validationRules: {
        pattern: /^AU-/
      }
    },
    apiEndpoints: {
      fetchData: '/api/assemblyunits',
      submitData: '/api/assemblyunits/assemble'
    },
    workflow: {
      previousPage: 'rmcheck',
      nextPage: 'testing',
      requiresAuth: true
    }
  },
  {
    id: 'testing',
    name: 'Testing Station',
    component: TestingPage,
    description: 'Test assembled units for quality assurance',
    barcodeFormConfig: {
      label: 'Scan Unit for Testing',
      placeholder: 'Scan unit to test...',
      autoSubmit: false
    },
    apiEndpoints: {
      fetchData: '/api/assemblyunits',
      submitData: '/api/assemblyunits/test'
    },
    workflow: {
      previousPage: 'assembly',
      nextPage: 'packing',
      requiresAuth: true
    }
  },
  {
    id: 'packing',
    name: 'Packing Station',
    component: PackingPage,
    description: 'Pack tested units for shipping',
    barcodeFormConfig: {
      label: 'Scan Unit for Packing',
      placeholder: 'Scan unit to pack...',
      autoSubmit: true,
      validationRules: {
        minLength: 10
      }
    },
    apiEndpoints: {
      fetchData: '/api/assemblyunits',
      submitData: '/api/assemblyunits/pack'
    },
    workflow: {
      previousPage: 'testing',
      requiresAuth: true
    }
  }
];

export const getPageConfig = (pageId: string): PageConfig | undefined => {
  return pageConfigurations.find(config => config.id === pageId);
};

export const getNextPage = (currentPageId: string): PageConfig | undefined => {
  const currentConfig = getPageConfig(currentPageId);
  if (currentConfig?.workflow?.nextPage) {
    return getPageConfig(currentConfig.workflow.nextPage);
  }
  return undefined;
};

export const getPreviousPage = (currentPageId: string): PageConfig | undefined => {
  const currentConfig = getPageConfig(currentPageId);
  if (currentConfig?.workflow?.previousPage) {
    return getPageConfig(currentConfig.workflow.previousPage);
  }
  return undefined;
};