import React from 'react';
import {
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  Car,
  ChevronRight,
  Sparkles,
  Shield,
  ArrowUpRight,
  Activity,
  Plus,
  Play,
  FileText,
  MapPin,
  ClipboardList
} from 'lucide-react';
import { 
  TenantOrganization, 
  Appointment, 
  WorkOrder, 
  Customer 
} from '../types/crm';
import { ActiveTab } from './Sidebar';

interface DashboardViewProps {
  currentOrg: TenantOrganization;
  appointments: Appointment[];
  workOrders: WorkOrder[];
  customers: Customer[];
  onNavigate: (tab: ActiveTab) => void;
  onOpenNewBooking: () => void;
  onSelectCustomer: (customer: Customer) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentOrg,
  appointments,
  workOrders,
  customers,
  onNavigate,
  onOpenNewBooking,
  onSelectCustomer,
}) => {
  // Compute metrics with tabular nums
  const todayAppointments = appointments.filter(a => a.scheduledDate === '2026-10-12');
  const totalTodayRevenue = todayAppointments.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const activeJobsCount = workOrders.filter(w => w.status === 'in_progress').length;
  const completedJobsCount = workOrders.filter(w => w.status === 'completed').length;

  const currentJob = workOrders.find(w => w.status === 'in_progress') || workOrders[0];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{currentOrg.cityState}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-cyan-400">{currentOrg.domain}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Operations Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time shop schedule, bay utilization, and client work order tracking.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('work_orders')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <ClipboardList className="w-4 h-4 text-cyan-400" />
            <span>Inspection Board</span>
          </button>
          <button
            onClick={onOpenNewBooking}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>Create Booking</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Strip (Tabular Figures) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Today's Bookings Value</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono tabular-nums">
            ${totalTodayRevenue.toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-emerald-400 font-medium">3 vehicles</span>
            <span aria-hidden="true">·</span>
            <span>Est. Miami bay total</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Bays / Units</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono tabular-nums">
            {activeJobsCount} In Progress
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
            <span>Wynwood Bay #1</span>
            <span aria-hidden="true">·</span>
            <span>Mobile Van #1 En Route</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Client Profiles</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono tabular-nums">
            {customers.length} Active Records
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-cyan-400">100% with vehicle specs</span>
            <span aria-hidden="true">·</span>
            <span>Miami clientele</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Average Ticket Size</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono tabular-nums">
            $325.00
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
            <span>Core Detail + Add-ons</span>
            <span aria-hidden="true">·</span>
            <span>Tiered vehicle pricing</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Schedule & Pipeline (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Today's Appointment Queue (October 12, 2026)</span>
            </h2>
            <button
              onClick={() => onNavigate('appointments')}
              className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View full schedule</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {appointments.map((apt) => {
              const isToday = apt.scheduledDate === '2026-10-12';
              return (
                <div
                  key={apt.id}
                  className={`p-4 rounded-xl border transition-all ${
                    apt.status === 'in_progress'
                      ? 'bg-slate-900/90 border-cyan-500/40 shadow-sm shadow-cyan-950/50'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                        <Car className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-white">{apt.customerName}</span>
                          <span className="text-xs text-slate-400 font-mono">({apt.subjectOrVehicle})</span>
                          {apt.status === 'in_progress' && (
                            <span className="text-[10px] font-medium text-amber-300 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded">
                              In Service
                            </span>
                          )}
                          {apt.status === 'confirmed' && (
                            <span className="text-[10px] font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
                              Confirmed
                            </span>
                          )}
                          {apt.status === 'completed' && (
                            <span className="text-[10px] font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                              Completed
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 flex-wrap">
                          <span className="text-slate-300 font-medium">{apt.serviceName}</span>
                          <span aria-hidden="true">·</span>
                          <span>{apt.durationMinutes} mins</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-400">{apt.assignedStaff}</span>
                        </div>
                        {apt.addOnNames.length > 0 && (
                          <div className="text-[11px] text-cyan-400/80 mt-1">
                            Add-ons: {apt.addOnNames.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <div className="text-base font-bold text-white font-mono tabular-nums">
                        ${apt.totalAmount}
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        {apt.scheduledTime} · {isToday ? 'Today' : apt.scheduledDate}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Customers Spotlight */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Recent VIP Clients (Miami Roster)
              </h3>
              <button
                onClick={() => onNavigate('customers')}
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                View all ({customers.length})
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {customers.slice(0, 4).map((c) => (
                <div
                  key={c.id}
                  onClick={() => onSelectCustomer(c)}
                  className="p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-white truncate">
                      {c.firstName} {c.lastName}
                    </span>
                    <span className="text-xs font-mono text-cyan-400 font-medium tabular-nums">
                      ${c.totalSpent}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-1">
                    {c.customFields.vehicleMake} {c.customFields.vehicleModel}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>{c.city}</span>
                    <span className="text-cyan-500/80">View profile →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Work Order Spotlight & Phase 0 Transparency (1 col) */}
        <div className="space-y-4">
          {/* Live Bay #1 Spotlight */}
          {currentJob && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Bay #1 Active Service</span>
                </span>
                <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                  {currentJob.status.replace('_', ' ')}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-white">
                  {currentJob.subjectOrVehicle}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Client: {currentJob.customerName} · Tech: {currentJob.technician}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                  Location: {currentJob.bayOrLocation}
                </p>
              </div>

              {/* Checklist Progress */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Inspection Checklist</span>
                  <span className="text-cyan-400 font-mono tabular-nums">
                    {currentJob.checklist.filter(i => i.completed).length} / {currentJob.checklist.length} done
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-cyan-400 h-full rounded-full transition-all"
                    style={{
                      width: `${(currentJob.checklist.filter(i => i.completed).length / currentJob.checklist.length) * 100}%`
                    }}
                  />
                </div>
                <div className="space-y-1.5 pt-1">
                  {currentJob.checklist.slice(0, 4).map((item) => (
                    <div key={item.id} className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${item.completed ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <span className={`truncate ${item.completed ? 'text-slate-300' : 'text-slate-500'}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onNavigate('work_orders')}
                className="w-full mt-2 py-2 px-3 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Open Work Order Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Architecture Status / Phase 0 Disclosure Card */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Phase 0 Architecture Boundary</span>
            </div>

            <div className="space-y-2 text-slate-400 leading-relaxed text-[11px]">
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>
                  <strong className="text-slate-200">Interactive UI Engine:</strong> Navigation, customer modals, service pricing math, and state updating are active in-browser.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">◷</span>
                <span>
                  <strong className="text-slate-200">Database Persistence:</strong> Demonstrating with verified Elite Tech seed data. Supabase RLS and relational schemas staged for Phase 1.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">◷</span>
                <span>
                  <strong className="text-slate-200">Payments & Webhooks:</strong> Square & Twilio APIs isolated. Invoices simulate 7% Miami-Dade sales tax calculations without charging real cards.
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
              <span>Ready for user visual review</span>
              <button 
                onClick={() => onNavigate('settings')}
                className="text-cyan-400 hover:underline"
              >
                Inspect settings →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
