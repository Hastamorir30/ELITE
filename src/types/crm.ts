export type BusinessType = 'auto_detailing' | 'nail_salon' | 'cleaning_service';

export interface TenantOrganization {
  id: string;
  name: string;
  slug: string;
  domain: string;
  businessType: BusinessType;
  phone: string;
  email: string;
  address: string;
  cityState: string;
  primaryColor: string;
  tagline: string;
  currency: string;
  businessHours: {
    days: string;
    hours: string;
  };
}

export interface CustomFieldDefinition {
  id: string;
  orgId: string;
  entityType: 'customer' | 'appointment' | 'work_order';
  name: string;
  key: string;
  dataType: 'text' | 'number' | 'select' | 'boolean' | 'date';
  options?: string[];
  isRequired: boolean;
  displayOrder: number;
  isActive: boolean;
  industryDefault?: BusinessType;
}

export interface Customer {
  id: string;
  orgId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
  tags: string[];
  totalSpent: number;
  appointmentsCount: number;
  lastServiceDate: string;
  createdAt: string;
  customFields: Record<string, string | number | boolean>;
}

export interface ServiceTierPricing {
  sedan: number;
  suv: number;
  truck: number;
}

export interface ServiceItem {
  id: string;
  orgId: string;
  name: string;
  category: 'core_package' | 'add_on';
  description: string;
  durationRange: string;
  durationMinutes: number;
  pricingType: 'tiered' | 'fixed';
  tieredPrices?: ServiceTierPricing;
  fixedPrice?: number;
  isActive: boolean;
  displayOrder: number;
}

export type AppointmentStatus = 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';

export interface Appointment {
  id: string;
  orgId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  subjectOrVehicle: string;
  vehicleCategory?: 'sedan' | 'suv' | 'truck';
  serviceId: string;
  serviceName: string;
  addOnIds: string[];
  addOnNames: string[];
  scheduledDate: string;
  scheduledTime: string;
  durationMinutes: number;
  totalAmount: number;
  status: AppointmentStatus;
  assignedStaff: string;
  notes?: string;
  workOrderId?: string;
}

export type WorkOrderStatus = 'scheduled' | 'checked_in' | 'in_progress' | 'quality_check' | 'completed';

export interface WorkOrderChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface WorkOrder {
  id: string;
  orgId: string;
  appointmentId: string;
  customerName: string;
  subjectOrVehicle: string;
  serviceName: string;
  technician: string;
  status: WorkOrderStatus;
  bayOrLocation: string;
  startTime?: string;
  completedAt?: string;
  checklist: WorkOrderChecklistItem[];
  inspectionNotes: string;
  updatedAt: string;
}

export interface InvoiceItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  orgId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  date: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'draft' | 'cancelled';
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod?: string;
  paidAt?: string;
}

export interface ModuleFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  isCore: boolean;
  enabled: boolean;
  category: 'operations' | 'finance' | 'communication' | 'intelligence';
}
