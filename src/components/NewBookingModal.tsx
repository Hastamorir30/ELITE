import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Car,
  User,
  Plus,
  X,
  Sparkles,
  DollarSign,
  Check
} from 'lucide-react';
import { 
  Appointment, 
  Customer, 
  ServiceItem, 
  TenantOrganization 
} from '../types/crm';

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  services: ServiceItem[];
  currentOrg: TenantOrganization;
  initialCustomer?: Customer | null;
  onSaveAppointment: (appointment: Appointment) => void;
}

export const NewBookingModal: React.FC<NewBookingModalProps> = ({
  isOpen,
  onClose,
  customers,
  services,
  currentOrg,
  initialCustomer,
  onSaveAppointment,
}) => {
  if (!isOpen) return null;

  const corePackages = services.filter((s) => s.category === 'core_package');
  const addOns = services.filter((s) => s.category === 'add_on');

  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    initialCustomer?.id || customers[0]?.id || ''
  );
  const [vehicleTier, setVehicleTier] = useState<'sedan' | 'suv' | 'truck'>('sedan');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    corePackages[1]?.id || corePackages[0]?.id || ''
  );
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [date, setDate] = useState('2026-10-12');
  const [time, setTime] = useState('11:00 AM');
  const [technician, setTechnician] = useState('Carlos R. (Lead Detailer)');
  const [notes, setNotes] = useState('');

  // Selected entities
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
  const selectedService = services.find((s) => s.id === selectedServiceId);

  // Calculate price dynamically
  let basePrice = 0;
  if (selectedService?.tieredPrices) {
    basePrice = selectedService.tieredPrices[vehicleTier] || 150;
  } else if (selectedService?.fixedPrice) {
    basePrice = selectedService.fixedPrice;
  }

  const addOnsTotal = selectedAddOnIds.reduce((sum, addOnId) => {
    const item = services.find((s) => s.id === addOnId);
    return sum + (item?.fixedPrice || 0);
  }, 0);

  const grandTotal = basePrice + addOnsTotal;

  // Calculate duration
  const baseMinutes = selectedService?.durationMinutes || 120;
  const addOnsMinutes = selectedAddOnIds.reduce((sum, addOnId) => {
    const item = services.find((s) => s.id === addOnId);
    return sum + (item?.durationMinutes || 0);
  }, 0);
  const totalMinutes = baseMinutes + addOnsMinutes;

  const handleToggleAddOn = (id: string) => {
    if (selectedAddOnIds.includes(id)) {
      setSelectedAddOnIds(selectedAddOnIds.filter((item) => item !== id));
    } else {
      setSelectedAddOnIds([...selectedAddOnIds, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !selectedService) return;

    const chosenAddOns = services.filter((s) => selectedAddOnIds.includes(s.id));

    const newAppointment: Appointment = {
      id: `apt_${Date.now().toString().slice(-4)}`,
      orgId: currentOrg.id,
      customerId: selectedCustomer.id,
      customerName: `${selectedCustomer.firstName} ${selectedCustomer.lastName}`,
      customerPhone: selectedCustomer.phone,
      customerEmail: selectedCustomer.email,
      subjectOrVehicle: `${selectedCustomer.customFields.vehicleMake || ''} ${selectedCustomer.customFields.vehicleModel || 'Vehicle'}`.trim(),
      vehicleCategory: vehicleTier,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      addOnIds: selectedAddOnIds,
      addOnNames: chosenAddOns.map((a) => a.name),
      scheduledDate: date,
      scheduledTime: time,
      durationMinutes: totalMinutes,
      totalAmount: grandTotal,
      status: 'confirmed',
      assignedStaff: technician,
      notes,
    };

    onSaveAppointment(newAppointment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white">Schedule Detailing Appointment</h2>
            <p className="text-xs text-slate-400">Select client, vehicle size tier, package, and add-ons.</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Customer Selection */}
          <div>
            <label className="block text-slate-400 mb-1">Select Client *</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName} ({c.customFields.vehicleMake} {c.customFields.vehicleModel})
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Category Tier (Affects pricing) */}
          <div>
            <label className="block text-slate-400 mb-1.5">
              Vehicle Classification (Tiered Pricing Rule)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'sedan', label: 'Sedan / Coupe' },
                { id: 'suv', label: 'SUV / Crossover' },
                { id: 'truck', label: 'Truck / Large Van' },
              ].map((tier) => (
                <button
                  type="button"
                  key={tier.id}
                  onClick={() => setVehicleTier(tier.id as any)}
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    vehicleTier === tier.id
                      ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="block text-xs">{tier.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Core Service Package */}
          <div>
            <label className="block text-slate-400 mb-1">Detailing Package *</label>
            <div className="space-y-2">
              {corePackages.map((pkg) => {
                const isSelected = selectedServiceId === pkg.id;
                const tierPrice = pkg.tieredPrices ? pkg.tieredPrices[vehicleTier] : 0;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedServiceId(pkg.id)}
                    className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-xs block">{pkg.name}</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{pkg.durationRange}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-cyan-400 text-sm tabular-nums">
                        ${tierPrice}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add-ons */}
          <div>
            <label className="block text-slate-400 mb-1.5">
              Available Add-Ons (Select all that apply)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 border border-slate-800 rounded-lg bg-slate-950">
              {addOns.map((addon) => {
                const isSelected = selectedAddOnIds.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => handleToggleAddOn(addon.id)}
                    className={`p-2 rounded-md border cursor-pointer flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500/60 text-white'
                        : 'border-slate-800/80 hover:bg-slate-900 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${
                        isSelected ? 'bg-cyan-400 text-slate-950 font-bold' : 'border border-slate-700'
                      }`}>
                        {isSelected && '✓'}
                      </div>
                      <span className="text-[11px] font-medium truncate">{addon.name}</span>
                    </div>
                    <span className="font-mono text-cyan-400 text-xs shrink-0 ml-1">
                      +${addon.fixedPrice}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Date, Time & Staff */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Service Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Start Time</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="11:00 AM"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Technician</label>
              <select
                value={technician}
                onChange={(e) => setTechnician(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-white"
              >
                <option value="Carlos R. (Lead Detailer)">Carlos R. (Wynwood Bay)</option>
                <option value="Mateo S. (Mobile Van #1)">Mateo S. (Mobile Van)</option>
                <option value="Javier M. (Paint Specialist)">Javier M. (Cleanroom)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Operational Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Gate code, keys on driver seat, water spot focus..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
            />
          </div>

          {/* Calculated Total Bar */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-800/40 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Calculated Duration</span>
              <span className="font-mono text-white font-bold">{totalMinutes} minutes</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[11px]">Total Estimated Price</span>
              <span className="font-mono text-xl text-cyan-400 font-bold tabular-nums">
                ${grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-sm"
            >
              Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
