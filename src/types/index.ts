// Core type definitions for Shop Floor Management System

// Enums
export enum BatchStatus {
  Planned = 'Planned',
  InProgress = 'InProgress',
  Completed = 'Completed',
  OnHold = 'OnHold'
}

export enum AssemblyUnitStatus {
  Created = 'Created',
  Pending = 'Pending',
  InProgress = 'InProgress',
  Assembled = 'Assembled',
  Tested = 'Tested',
  Passed = 'Passed',
  Pack = 'Pack',
  Failed = 'Failed',
  Scrapped = 'Scrapped'
}

export enum RawMaterialStatus {
  Created = 'Created',
  Received = 'Received',
  Consumed = 'Consumed',
  Scrapped = 'Scrapped'
}

export enum StationType {
  Assembly = 'Assembly',
  Inspection = 'Inspection',
  Packaging = 'Packaging',
  Storage = 'Storage'
}

export enum WorkOrderStatus {
  Created = 'Created',
  Released = 'Released',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

// Interfaces
export interface Inspection {
  id: string;
  assemblyUnitId: string;
  rawMaterialId?: string;
  targetType: string;
  targetId: string;
  testType: string;
  result: string;
  measuredValue: string;
  inspector: string;
  timestamp: Date;
}

export interface ProcessStep {
  id: string;
  name: string;
  stationId: string;
  assemblyUnitId: string;
  startTime: Date;
  endTime?: Date;
  duration?: string;
}

export interface MaterialUsage {
  materialCode: string;
  serialNumber: string;
  usedAt: Date;
}

export interface RawMaterial {
  id: string;
  code: string;
  serialNumber: string;
  lotNumber: string;
  batchNo: string;
  status: RawMaterialStatus;
  inspections: Inspection[];
  description?: string;
  quantity?: number;
  unit?: string;
  supplier?: string;
  receivedDate?: Date;
}

export interface AssemblyUnit {
  id: string;
  serialNumber: string;
  productCode: string;
  workOrderId: string;
  batchId: string;
  stationId: string;
  status: AssemblyUnitStatus;
  rawMaterials: RawMaterial[];
  steps: ProcessStep[];
  inspections: Inspection[];
  usages: MaterialUsage[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Batch {
  id: string;
  batchNo: string;
  productCode:string; 
  status: BatchStatus;
  // workOrder: WorkOrder;
  // plannedQuantity: number;
  // actualQuantity: number;
  startDate?: Date;
  endDate?: Date;
  description?: string;
}

export interface BillOfMaterials {
  id: string;
  productCode: string;
  productName: string;
  revision: string;
  bomItems: BOMItem[];
  isActive?: boolean;
  createdAt?: Date;
  updatedAt: Date;
}

export interface BOMItem {
  materialCode: string;
  materialName: string;
  requiredQty: number;
  unit?: string;
  specification?: string;
}

export interface Station {
  id: string;
  code?: string;
  name: string;
  stationType: StationType;
  location: string;
  isActive?: boolean;
  capacity?: number;
  currentLoad?: number;
  description?: string;
}

export interface WorkOrder {
  id: string;
  workOrderNo: string;
  productCode: string;
  productName: string;
  bomId:string;
  quantity: number;
  status: WorkOrderStatus;
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
  startDate: Date;
  dueDate?: Date;
  completedQuantity?: number;
  customer?: string;
  notes?: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

// Query Parameters
export interface QueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filter?: Record<string, any>;
}

// Form Types
export interface AssemblyUnitFormData {
  serialNumber: string;
  productCode: string;
  workOrderId: string;
  batchId: string;
  stationId: string;
  status: AssemblyUnitStatus;
}

export interface BatchFormData {
  batchNumber: string;
  workOrderId: string;
  status: BatchStatus;
  plannedQuantity: number;
  description?: string;
}

export interface WorkOrderFormData {
  orderNumber: string;
  productCode: string;
  productName: string;
  quantity: number;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  startDate: string;
  dueDate: string;
  customer?: string;
  notes?: string;
}

export interface StationFormData {
  code: string;
  name: string;
  type: StationType;
  location: string;
  isActive: boolean;
  capacity?: number;
  description?: string;
}

export interface RawMaterialFormData {
  code: string;
  serialNumber: string;
  lotNumber: string;
  batchNo: string;
  status: RawMaterialStatus;
  description?: string;
  quantity?: number;
  unit?: string;
  supplier?: string;
}