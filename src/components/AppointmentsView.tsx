import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Car,
  User,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Play,
  RotateCcw,
  ClipboardList,
  Phone,
  MapPin,
  ChevronRight,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { 
  Appointment, 
  AppointmentStatus, 
  Customer, 
  ServiceItem 
} from '../types/crm';

interface AppointmentsViewProps {
  appointments: Appointment[];
  services: ServiceItem[];
  customers: Customer[];
  onOpenNewBooking: () => void;
  onUpdateStatus: (appointmentId: string, newStatus: AppointmentStatus) => void;
  onConvertToWorkOrder: (appointment: Appointment) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  services,
  customers,
  onOpenNewBooking,
  onUpdateStatus,
  onConvertToWorkOrder,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'agenda' | 'day'>('agenda');

  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesSearch = 
      apt.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.subjectOrVehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Schedule & Bay Appointments
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Bookings calendar, technician dispatch, vehicle categories, and dynamic service duration calculation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                viewMode === 'agenda'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Agenda Queue
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                viewMode === 'day'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Today's Bays
            </button>
          </div>

          <button
            onClick={onOpenNewBooking}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client name, vehicle or service package..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs shrink-0">
          {[
            { id: 'all', label: 'All Appointments' },
            { id: 'in_progress', label: 'In Service' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* View Mode: Day Bay Timeline vs Agenda List */}
      {viewMode === 'day' ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h2 className="text-sm font-semibold text-white mb-3 flex items-center justify-between">
              <span>Miami Bay & Mobile Units · Today (October 12, 2026)</span>
              <span className="text-xs font-mono text-cyan-400">3 Units Active</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Bay #1 */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-cyan-800/40 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Wynwood Bay #1 (Cleanroom)</span>
                  <span className="text-[10px] text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">Occupied</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                  <div className="font-semibold text-white">Porsche 911 GT3 RS</div>
                  <div className="text-slate-400 text-[11px]">Alejandro Vance · VIP Detail</div>
                  <div className="text-[11px] text-cyan-400 font-mono">09:00 AM – 12:00 PM</div>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Assigned: Carlos R.</span>
                  <button 
                    onClick={() => {
                      const apt = appointments.find(a => a.id === 'apt_101');
                      if (apt) onConvertToWorkOrder(apt);
                    }}
                    className="text-cyan-400 hover:underline"
                  >
                    View Job →
                  </button>
                </div>
              </div>

              {/* Mobile Van #1 */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Mobile Van #1 (Miami Beach)</span>
                  <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">Dispatched 1:30 PM</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                  <div className="font-semibold text-white">Range Rover Autobiography</div>
                  <div className="text-slate-400 text-[11px]">Elena Rostova · Elite Restoration</div>
                  <div className="text-[11px] text-cyan-400 font-mono">01:30 PM – 06:30 PM</div>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Assigned: Mateo S.</span>
                  <span className="text-slate-500">450 Ocean Dr</span>
                </div>
              </div>

              {/* Bay #2 (Available) */}
              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-dashed border-slate-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-400">Wynwood Bay #2 (Dry Bay)</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">Available</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Open for walk-ins or afternoon express Signature Wash services.
                  </p>
                </div>
                <button
                  onClick={onOpenNewBooking}
                  className="w-full py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-cyan-400 text-xs font-medium transition-colors border border-slate-800"
                >
                  Book into Bay #2 +
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Agenda List of Appointments */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-900 border border-slate-800">
            <CalendarIcon className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-white">No appointments found</h3>
            <p className="text-xs text-slate-400 mt-1">Try clearing filters or search terms.</p>
          </div>
        ) : (
          filteredAppointments.map((apt) => {
            const isToday = apt.scheduledDate === '2026-10-12';
            return (
              <div
                key={apt.id}
                className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Left: Time & Customer Information */}
                <div className="flex items-start gap-4">
                  <div className="text-center p-2.5 rounded-lg bg-slate-950 border border-slate-800 shrink-0 min-w-[76px]">
                    <span className="block text-[11px] font-bold text-cyan-400 uppercase tracking-wider font-mono">
                      {isToday ? 'TODAY' : apt.scheduledDate.slice(5)}
                    </span>
                    <span className="block text-xs font-bold text-white font-mono mt-0.5">
                      {apt.scheduledTime}
                    </span>
                    <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                      {apt.durationMinutes}m
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-white">{apt.customerName}</h3>
                      <span className="text-xs text-slate-400 font-mono">({apt.subjectOrVehicle})</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        Tier: {apt.vehicleCategory || 'Sedan'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-300 flex-wrap">
                      <span className="font-semibold text-cyan-400">{apt.serviceName}</span>
                      {apt.addOnNames.length > 0 && (
                        <>
                          <span aria-hidden="true" className="text-slate-600">·</span>
                          <span className="text-slate-400">Add-ons: {apt.addOnNames.join(', ')}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1 flex-wrap">
                      <span className="flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-slate-500" />
                        {apt.customerPhone}
                      </span>
                      <span className="text-slate-600" aria-hidden="true">·</span>
                      <span>Assigned: {apt.assignedStaff}</span>
                      {apt.notes && (
                        <>
                          <span className="text-slate-600" aria-hidden="true">·</span>
                          <span className="text-slate-400 italic truncate max-w-xs">{apt.notes}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Pricing & Status Controls */}
                <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  <div className="lg:text-right">
                    <div className="text-lg font-bold text-white font-mono tabular-nums">
                      ${apt.totalAmount}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Estimated Invoice Total
                    </div>
                  </div>

                  {/* Status Dropdown / Interactive Transition */}
                  <div className="flex items-center gap-2">
                    <select
                      value={apt.status}
                      onChange={(e) => onUpdateStatus(apt.id, e.target.value as AppointmentStatus)}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none transition-colors ${
                        apt.status === 'in_progress'
                          ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                          : apt.status === 'confirmed'
                          ? 'bg-cyan-950/60 border-cyan-800 text-cyan-300'
                          : apt.status === 'completed'
                          ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="rescheduled">Rescheduled</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() => onConvertToWorkOrder(apt)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                      title="Convert to Work Order & Checklist"
                    >
                      <ClipboardList className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="hidden sm:inline">Work Order</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
