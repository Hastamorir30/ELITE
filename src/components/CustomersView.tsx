import React, { useState } from 'react';
import {
  Search,
  Plus,
  Car,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  ShieldCheck,
  Tag,
  ChevronRight,
  X,
  Clock,
  Sparkles,
  FileText
} from 'lucide-react';
import { Customer, CustomFieldDefinition } from '../types/crm';

interface CustomersViewProps {
  customers: Customer[];
  customFields: CustomFieldDefinition[];
  onAddCustomer: (customer: Customer) => void;
  selectedCustomer: Customer | null;
  onSelectCustomer: (customer: Customer | null) => void;
  onBookForCustomer: (customer: Customer) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  customFields,
  onAddCustomer,
  selectedCustomer,
  onSelectCustomer,
  onBookForCustomer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Customer Form State
  const [newCustFirstName, setNewCustFirstName] = useState('');
  const [newCustLastName, setNewCustLastName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustCity, setNewCustCity] = useState('Miami, FL');
  const [newCustMake, setNewCustMake] = useState('');
  const [newCustModel, setNewCustModel] = useState('');
  const [newCustPaint, setNewCustPaint] = useState('Factory Pristine');
  const [newCustNotes, setNewCustNotes] = useState('');

  // Extract all unique tags
  const allTags = Array.from(new Set(customers.flatMap(c => c.tags)));

  // Filter customers
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.customFields.vehicleMake && String(c.customFields.vehicleMake).toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.customFields.vehicleModel && String(c.customFields.vehicleModel).toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = selectedTag === 'all' || c.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustFirstName || !newCustLastName) return;

    const newCustomer: Customer = {
      id: `cust_${Date.now().toString().slice(-4)}`,
      orgId: 'org_elite_tech_miami',
      firstName: newCustFirstName,
      lastName: newCustLastName,
      email: newCustEmail || 'client@example.com',
      phone: newCustPhone || '(305) 555-0100',
      address: newCustAddress || 'Miami, FL',
      city: newCustCity,
      notes: newCustNotes || 'Initial client intake created during Phase 0 session.',
      tags: ['New Client'],
      totalSpent: 0,
      appointmentsCount: 0,
      lastServiceDate: 'Never',
      createdAt: '2026-10-12',
      customFields: {
        vehicleMake: newCustMake || 'Porsche',
        vehicleModel: newCustModel || 'Cayenne GTS',
        paintCondition: newCustPaint,
        ceramicWarranty: '',
      },
    };

    onAddCustomer(newCustomer);
    setShowAddModal(false);

    // Reset fields
    setNewCustFirstName('');
    setNewCustLastName('');
    setNewCustEmail('');
    setNewCustPhone('');
    setNewCustAddress('');
    setNewCustMake('');
    setNewCustModel('');
    setNewCustNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Client Directory & Vehicles
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Customer profiles, vehicle specifications, service histories, and custom custom fields.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Add Client</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search clients by name, vehicle, phone or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Tag Filters (Functional filter tabs) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs shrink-0">
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedTag === 'all'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
            }`}
          >
            All Clients ({customers.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedTag === tag
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Cards Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => {
          const isSelected = selectedCustomer?.id === customer.id;
          return (
            <div
              key={customer.id}
              onClick={() => onSelectCustomer(customer)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500/60 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/40'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header with Name & Total Spent */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-white hover:text-cyan-400 transition-colors">
                      {customer.firstName} {customer.lastName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{customer.city}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-cyan-400 font-mono tabular-nums">
                      ${customer.totalSpent.toLocaleString()}
                    </span>
                    <span className="block text-[10px] text-slate-500 font-mono">
                      {customer.appointmentsCount} bookings
                    </span>
                  </div>
                </div>

                {/* Vehicle Specs / Custom Fields */}
                <div className="mt-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-white font-medium">
                    <Car className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">
                      {customer.customFields.vehicleMake} {customer.customFields.vehicleModel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="text-slate-500">Paint:</span>
                    <span className="truncate text-slate-300">
                      {customer.customFields.paintCondition || 'Unspecified'}
                    </span>
                  </div>
                  {customer.customFields.ceramicWarranty && (
                    <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-mono">
                      <ShieldCheck className="w-3 h-3 text-cyan-400" />
                      <span>Warranty Thru {String(customer.customFields.ceramicWarranty)}</span>
                    </div>
                  )}
                </div>

                {/* Contact metadata (unboxed text) */}
                <div className="mt-3 space-y-1 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="font-mono">{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-mono">
                  Last: {customer.lastServiceDate}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookForCustomer(customer);
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-300 text-xs font-medium transition-colors"
                >
                  Book Service →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Customer Slide-Over / Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-cyan-400">Customer Dossier</span>
                <h2 className="text-xl font-bold text-white mt-0.5">
                  {selectedCustomer.firstName} {selectedCustomer.lastName}
                </h2>
              </div>
              <button
                onClick={() => onSelectCustomer(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Contact Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                Contact & Address
              </div>
              <div className="flex items-center justify-between text-slate-200">
                <span className="text-slate-500">Phone</span>
                <span className="font-mono text-white">{selectedCustomer.phone}</span>
              </div>
              <div className="flex items-center justify-between text-slate-200">
                <span className="text-slate-500">Email</span>
                <span className="text-white">{selectedCustomer.email}</span>
              </div>
              <div className="flex items-center justify-between text-slate-200">
                <span className="text-slate-500">Service Location</span>
                <span className="text-white">{selectedCustomer.address}, {selectedCustomer.city}</span>
              </div>
            </div>

            {/* Vehicle & Dynamic Custom Fields */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider flex items-center justify-between">
                <span>Vehicle & Custom Field Records</span>
                <span className="text-[10px] text-cyan-400 font-mono">Dynamic Fields</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Vehicle Make</span>
                  <span className="text-white font-medium">{String(selectedCustomer.customFields.vehicleMake || '—')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Model & Generation</span>
                  <span className="text-white font-medium">{String(selectedCustomer.customFields.vehicleModel || '—')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Paint Condition</span>
                  <span className="text-cyan-400">{String(selectedCustomer.customFields.paintCondition || '—')}</span>
                </div>
                {selectedCustomer.customFields.ceramicWarranty && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Ceramic Warranty</span>
                    <span className="text-emerald-400 font-mono">{String(selectedCustomer.customFields.ceramicWarranty)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Notes & Special Instructions */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                Detailer Operational Notes
              </div>
              <p className="text-slate-300 leading-relaxed">
                {selectedCustomer.notes}
              </p>
            </div>

            {/* Financial Summary */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Lifetime Spend</span>
                <span className="text-lg font-bold text-white font-mono tabular-nums">
                  ${selectedCustomer.totalSpent.toLocaleString()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[11px]">Total Visits</span>
                <span className="text-lg font-bold text-white font-mono tabular-nums">
                  {selectedCustomer.appointmentsCount}
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
              <button
                onClick={() => {
                  const cust = selectedCustomer;
                  onSelectCustomer(null);
                  onBookForCustomer(cust);
                }}
                className="flex-1 py-2.5 rounded-lg text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors"
              >
                Schedule Appointment Now
              </button>
              <button
                onClick={() => onSelectCustomer(null)}
                className="px-4 py-2.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white">Add New Client</h2>
                <p className="text-xs text-slate-400">Intake customer details and vehicle custom fields.</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={newCustFirstName}
                    onChange={(e) => setNewCustFirstName(e.target.value)}
                    placeholder="e.g. Carlos"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={newCustLastName}
                    onChange={(e) => setNewCustLastName(e.target.value)}
                    placeholder="e.g. Mendoza"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    placeholder="(305) 555-0182"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newCustEmail}
                    onChange={(e) => setNewCustEmail(e.target.value)}
                    placeholder="carlos@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Vehicle Make (Custom Field)</label>
                  <input
                    type="text"
                    value={newCustMake}
                    onChange={(e) => setNewCustMake(e.target.value)}
                    placeholder="e.g. Porsche, Ferrari, BMW"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Model & Year</label>
                  <input
                    type="text"
                    value={newCustModel}
                    onChange={(e) => setNewCustModel(e.target.value)}
                    placeholder="e.g. 911 Turbo S · 2024"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Paint Condition</label>
                <select
                  value={newCustPaint}
                  onChange={(e) => setNewCustPaint(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Factory Pristine">Factory Pristine</option>
                  <option value="Light Swirl Marks">Light Swirl Marks</option>
                  <option value="Moderate Oxidation">Moderate Oxidation</option>
                  <option value="Ceramic Coated (Under Warranty)">Ceramic Coated (Under Warranty)</option>
                  <option value="Requires Multi-Stage Correction">Requires Multi-Stage Correction</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Service Address / Miami Area</label>
                <input
                  type="text"
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  placeholder="Brickell, Coconut Grove, Coral Gables..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Detailer Notes</label>
                <textarea
                  rows={2}
                  value={newCustNotes}
                  onChange={(e) => setNewCustNotes(e.target.value)}
                  placeholder="Client preferences, gate codes, leather finish..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
