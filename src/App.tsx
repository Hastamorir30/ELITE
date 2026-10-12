import React, { useState } from 'react';
import {
  INITIAL_ORGANIZATIONS,
  INITIAL_SERVICES,
  INITIAL_CUSTOM_FIELDS,
  INITIAL_CUSTOMERS,
  INITIAL_APPOINTMENTS,
  INITIAL_WORK_ORDERS,
  INITIAL_INVOICES,
  INITIAL_MODULE_FLAGS,
} from './data/initialData';
import {
  TenantOrganization,
  Customer,
  ServiceItem,
  Appointment,
  AppointmentStatus,
  WorkOrder,
  WorkOrderStatus,
  Invoice,
  CustomFieldDefinition,
  ModuleFlag,
} from './types/crm';
import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { CustomersView } from './components/CustomersView';
import { AppointmentsView } from './components/AppointmentsView';
import { ServicesView } from './components/ServicesView';
import { WorkOrdersView } from './components/WorkOrdersView';
import { FinancialView } from './components/FinancialView';
import { SettingsView } from './components/SettingsView';
import { ModulesView } from './components/ModulesView';
import { ArturoAiModal } from './components/ArturoAiModal';
import { NewBookingModal } from './components/NewBookingModal';

export default function App() {
  // Master State
  const [organizations, setOrganizations] = useState<TenantOrganization[]>(INITIAL_ORGANIZATIONS);
  const [currentOrg, setCurrentOrg] = useState<TenantOrganization>(INITIAL_ORGANIZATIONS[0]);

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [customFields, setCustomFields] = useState<CustomFieldDefinition[]>(INITIAL_CUSTOM_FIELDS);
  const [moduleFlags, setModuleFlags] = useState<ModuleFlag[]>(INITIAL_MODULE_FLAGS);

  // UI Modals & Drawers
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [isArturoOpen, setIsArturoOpen] = useState(false);
  const [bookingForCustomer, setBookingForCustomer] = useState<Customer | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // State Mutators
  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers([newCustomer, ...customers]);
    showToast(`Client ${newCustomer.firstName} ${newCustomer.lastName} created.`);
  };

  const handleSaveAppointment = (newAppointment: Appointment) => {
    setAppointments([newAppointment, ...appointments]);

    // Automatically create a companion work order
    const companionWorkOrder: WorkOrder = {
      id: `wo_${Date.now().toString().slice(-4)}`,
      orgId: currentOrg.id,
      appointmentId: newAppointment.id,
      customerName: newAppointment.customerName,
      subjectOrVehicle: newAppointment.subjectOrVehicle,
      serviceName: newAppointment.serviceName,
      technician: newAppointment.assignedStaff.split(' (')[0],
      status: 'scheduled',
      bayOrLocation: 'Wynwood Bay #2 (Queued)',
      checklist: [
        { id: 'c1', label: 'Walkaround inspection & paint condition check', completed: false },
        { id: 'c2', label: 'Acid-free wheel barrel & tire cleanse', completed: false },
        { id: 'c3', label: 'pH-neutral 2-bucket hand wash', completed: false },
        { id: 'c4', label: 'Paint decontamination & iron remover', completed: false },
        { id: 'c5', label: 'Interior vacuum & surface sanitize', completed: false },
        { id: 'c6', label: 'Streak-free window & mirror finish', completed: false },
        { id: 'c7', label: 'Final shop manager delivery inspection', completed: false },
      ],
      inspectionNotes: newAppointment.notes || 'Awaiting customer arrival.',
      updatedAt: 'Just now',
    };

    setWorkOrders([companionWorkOrder, ...workOrders]);

    // Create a companion draft invoice
    const newInvoice: Invoice = {
      id: `inv_${Date.now().toString().slice(-4)}`,
      orgId: currentOrg.id,
      invoiceNumber: `INV-2026-0${Math.floor(880 + Math.random() * 20)}`,
      customerId: newAppointment.customerId,
      customerName: newAppointment.customerName,
      customerEmail: newAppointment.customerEmail,
      date: newAppointment.scheduledDate,
      dueDate: newAppointment.scheduledDate,
      status: 'pending',
      items: [
        {
          name: `${newAppointment.serviceName} (${newAppointment.subjectOrVehicle})`,
          quantity: 1,
          unitPrice: newAppointment.totalAmount,
          total: newAppointment.totalAmount,
        },
      ],
      subtotal: newAppointment.totalAmount,
      tax: Number((newAppointment.totalAmount * 0.07).toFixed(2)),
      total: Number((newAppointment.totalAmount * 1.07).toFixed(2)),
      paymentMethod: 'Pay on Delivery / Counter',
    };

    setInvoices([newInvoice, ...invoices]);
    showToast(`Appointment booked for ${newAppointment.customerName} ($${newAppointment.totalAmount}).`);
  };

  const handleUpdateAppointmentStatus = (id: string, newStatus: AppointmentStatus) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: newStatus } : a));
    showToast(`Appointment status updated to ${newStatus}.`);
  };

  const handleConvertToWorkOrder = (apt: Appointment) => {
    setActiveTab('work_orders');
    showToast(`Viewing Work Orders for ${apt.subjectOrVehicle}.`);
  };

  const handleUpdateWorkOrderStatus = (id: string, newStatus: WorkOrderStatus) => {
    setWorkOrders(workOrders.map(w => w.id === id ? { ...w, status: newStatus, updatedAt: 'Just now' } : w));
    showToast(`Work order advanced to ${newStatus.replace('_', ' ')}.`);
  };

  const handleToggleChecklistItem = (workOrderId: string, itemId: string) => {
    setWorkOrders(workOrders.map(wo => {
      if (wo.id !== workOrderId) return wo;
      return {
        ...wo,
        checklist: wo.checklist.map(item =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        ),
        updatedAt: 'Just now',
      };
    }));
  };

  const handleToggleServiceActive = (serviceId: string) => {
    setServices(services.map(s => s.id === serviceId ? { ...s, isActive: !s.isActive } : s));
    showToast(`Catalog item status toggled.`);
  };

  const handleAddService = (newService: ServiceItem) => {
    setServices([...services, newService]);
    showToast(`New service "${newService.name}" added to catalog.`);
  };

  const handleUpdateInvoiceStatus = (id: string, status: Invoice['status']) => {
    setInvoices(invoices.map(i => i.id === id ? { ...i, status } : i));
    showToast(`Invoice status marked as ${status}.`);
  };

  const handleAddCustomField = (field: CustomFieldDefinition) => {
    setCustomFields([...customFields, field]);
    showToast(`Custom field "${field.name}" saved to organization.`);
  };

  const handleToggleModule = (moduleId: string) => {
    setModuleFlags(moduleFlags.map(m => m.id === moduleId ? { ...m, enabled: !m.enabled } : m));
    showToast(`Module configuration updated.`);
  };

  const getViewTitle = (tab: ActiveTab): string => {
    switch (tab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'customers': return 'Client Directory & Vehicles';
      case 'appointments': return 'Schedule & Bays';
      case 'services': return 'Service Catalog & Pricing';
      case 'work_orders': return 'Jobs & Inspection Pipeline';
      case 'financials': return 'Financial Ledger & Invoices';
      case 'modules': return 'Modules & Feature Flags';
      case 'settings': return 'Settings & Multi-Tenant Engine';
      default: return 'Command Center';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Top Header */}
      <Header
        currentOrg={currentOrg}
        allOrgs={organizations}
        onSelectOrg={(org) => {
          setCurrentOrg(org);
          showToast(`Switched active organization context to ${org.name}`);
        }}
        onOpenNewBooking={() => {
          setBookingForCustomer(null);
          setIsNewBookingOpen(true);
        }}
        onOpenArturoAi={() => setIsArturoOpen(true)}
        currentViewTitle={getViewTitle(activeTab)}
      />

      {/* Main Workspace: Sidebar + Scrollable View */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          currentOrg={currentOrg}
          customersCount={customers.length}
          appointmentsCount={appointments.length}
          workOrdersCount={workOrders.length}
          onOpenArturoModal={() => setIsArturoOpen(true)}
        />

        {/* Content Viewport */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              currentOrg={currentOrg}
              appointments={appointments}
              workOrders={workOrders}
              customers={customers}
              onNavigate={setActiveTab}
              onOpenNewBooking={() => {
                setBookingForCustomer(null);
                setIsNewBookingOpen(true);
              }}
              onSelectCustomer={(c) => {
                setSelectedCustomer(c);
                setActiveTab('customers');
              }}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersView
              customers={customers}
              customFields={customFields}
              onAddCustomer={handleAddCustomer}
              selectedCustomer={selectedCustomer}
              onSelectCustomer={setSelectedCustomer}
              onBookForCustomer={(c) => {
                setBookingForCustomer(c);
                setIsNewBookingOpen(true);
              }}
            />
          )}

          {activeTab === 'appointments' && (
            <AppointmentsView
              appointments={appointments}
              services={services}
              customers={customers}
              onOpenNewBooking={() => {
                setBookingForCustomer(null);
                setIsNewBookingOpen(true);
              }}
              onUpdateStatus={handleUpdateAppointmentStatus}
              onConvertToWorkOrder={handleConvertToWorkOrder}
            />
          )}

          {activeTab === 'services' && (
            <ServicesView
              services={services}
              onToggleServiceActive={handleToggleServiceActive}
              onAddService={handleAddService}
            />
          )}

          {activeTab === 'work_orders' && (
            <WorkOrdersView
              workOrders={workOrders}
              onUpdateWorkOrderStatus={handleUpdateWorkOrderStatus}
              onToggleChecklistItem={handleToggleChecklistItem}
              onAddWorkOrder={(wo) => setWorkOrders([wo, ...workOrders])}
            />
          )}

          {activeTab === 'financials' && (
            <FinancialView
              invoices={invoices}
              currentOrg={currentOrg}
              onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
            />
          )}

          {activeTab === 'modules' && (
            <ModulesView
              moduleFlags={moduleFlags}
              onToggleModule={handleToggleModule}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              currentOrg={currentOrg}
              allOrgs={organizations}
              onSelectOrg={setCurrentOrg}
              customFields={customFields}
              onAddCustomField={handleAddCustomField}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <NewBookingModal
        isOpen={isNewBookingOpen}
        onClose={() => {
          setIsNewBookingOpen(false);
          setBookingForCustomer(null);
        }}
        customers={customers}
        services={services}
        currentOrg={currentOrg}
        initialCustomer={bookingForCustomer}
        onSaveAppointment={handleSaveAppointment}
      />

      <ArturoAiModal
        isOpen={isArturoOpen}
        onClose={() => setIsArturoOpen(false)}
        currentOrg={currentOrg}
        customers={customers}
      />

      {/* Subtle Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-cyan-500/40 text-white px-4 py-2.5 rounded-xl shadow-xl shadow-black/60 text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
