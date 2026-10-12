import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Plus,
  Clock,
  DollarSign,
  Car,
  CheckCircle2,
  FileUp,
  Info,
  Edit2,
  X,
  AlertTriangle
} from 'lucide-react';
import { ServiceItem } from '../types/crm';

interface ServicesViewProps {
  services: ServiceItem[];
  onToggleServiceActive: (serviceId: string) => void;
  onAddService: (newService: ServiceItem) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  services,
  onToggleServiceActive,
  onAddService,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAiImportModal, setShowAiImportModal] = useState(false);

  // New service state
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState<'core_package' | 'add_on'>('core_package');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('1–2 hours');
  const [newSedanPrice, setNewSedanPrice] = useState(150);
  const [newSuvPrice, setNewSuvPrice] = useState(180);
  const [newTruckPrice, setNewTruckPrice] = useState(210);
  const [newFixedPrice, setNewFixedPrice] = useState(50);

  const corePackages = services.filter((s) => s.category === 'core_package');
  const addOns = services.filter((s) => s.category === 'add_on');

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName) return;

    const newService: ServiceItem = {
      id: `srv_${Date.now().toString().slice(-4)}`,
      orgId: 'org_elite_tech_miami',
      name: newServiceName,
      category: newServiceCategory,
      description: newServiceDesc,
      durationRange: newServiceDuration,
      durationMinutes: 90,
      pricingType: newServiceCategory === 'core_package' ? 'tiered' : 'fixed',
      tieredPrices: newServiceCategory === 'core_package' ? {
        sedan: Number(newSedanPrice),
        suv: Number(newSuvPrice),
        truck: Number(newTruckPrice),
      } : undefined,
      fixedPrice: newServiceCategory === 'add_on' ? Number(newFixedPrice) : undefined,
      isActive: true,
      displayOrder: services.length + 1,
    };

    onAddService(newService);
    setShowAddModal(false);

    // Reset form
    setNewServiceName('');
    setNewServiceDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Elite Tech Service Catalog & Pricing
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configurable detailing packages, vehicle-tier pricing matrices (Sedan / SUV / Truck), and studio add-ons.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAiImportModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/50 transition-colors"
          >
            <FileUp className="w-4 h-4 text-cyan-400" />
            <span>AI Menu Import Spec</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {/* Section 1: Core Tiered Packages (Section 12 of Master Prompt) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Core Detailing Packages (Vehicle Tier Pricing)</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {corePackages.length} Active Packages
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {corePackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                pkg.isActive
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-900/40 border-slate-800/40 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-base text-white">
                    {pkg.name}
                  </h3>
                  <button
                    onClick={() => onToggleServiceActive(pkg.id)}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors ${
                      pkg.isActive 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' 
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {pkg.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono mt-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Duration: {pkg.durationRange}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mt-3">
                  {pkg.description}
                </p>

                {/* Vehicle Tier Price Matrix */}
                {pkg.tieredPrices && (
                  <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Tiered Vehicle Pricing
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                        <span className="block text-[10px] text-slate-400 font-medium">Sedan</span>
                        <span className="block text-sm font-bold text-white font-mono tabular-nums mt-0.5">
                          ${pkg.tieredPrices.sedan}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                        <span className="block text-[10px] text-slate-400 font-medium">SUV</span>
                        <span className="block text-sm font-bold text-white font-mono tabular-nums mt-0.5">
                          ${pkg.tieredPrices.suv}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                        <span className="block text-[10px] text-slate-400 font-medium">Truck</span>
                        <span className="block text-sm font-bold text-white font-mono tabular-nums mt-0.5">
                          ${pkg.tieredPrices.truck}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>Org-Scoped Catalog</span>
                <span className="text-cyan-400 font-mono text-[11px]">Elite Tech Miami</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Specialized Add-Ons (Section 12 of Master Prompt) */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Detailing Add-Ons & Enhancements</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {addOns.length} Specialized Add-ons
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {addOns.map((addon) => (
            <div
              key={addon.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                addon.isActive
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-900/40 border-slate-800/40 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm text-white">
                    {addon.name}
                  </h3>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-cyan-400 font-mono tabular-nums">
                      ${addon.fixedPrice}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono mt-1">
                  <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                  <span>{addon.durationRange}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mt-2">
                  {addon.description}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <button
                  onClick={() => onToggleServiceActive(addon.id)}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors ${
                    addon.isActive 
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {addon.isActive ? 'Active in booking' : 'Disabled'}
                </button>
                <span className="text-[10px] text-slate-500 font-mono">
                  Fixed Add-on
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">Add New Catalog Item</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  placeholder="e.g. Ceramic Pro 5-Year Coating"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={newServiceCategory}
                    onChange={(e) => setNewServiceCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="core_package">Core Package (Tiered)</option>
                    <option value="add_on">Add-on (Fixed Price)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Estimated Duration</label>
                  <input
                    type="text"
                    value={newServiceDuration}
                    onChange={(e) => setNewServiceDuration(e.target.value)}
                    placeholder="e.g. 2–3 hours"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {newServiceCategory === 'core_package' ? (
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-slate-400 font-semibold text-[11px]">
                    Vehicle Tier Pricing ($)
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-slate-500 text-[10px] mb-1">Sedan ($)</label>
                      <input
                        type="number"
                        value={newSedanPrice}
                        onChange={(e) => setNewSedanPrice(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 text-[10px] mb-1">SUV ($)</label>
                      <input
                        type="number"
                        value={newSuvPrice}
                        onChange={(e) => setNewSuvPrice(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 text-[10px] mb-1">Truck ($)</label>
                      <input
                        type="number"
                        value={newTruckPrice}
                        onChange={(e) => setNewTruckPrice(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-slate-400 mb-1">Fixed Price ($)</label>
                  <input
                    type="number"
                    value={newFixedPrice}
                    onChange={(e) => setNewFixedPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-400 mb-1">Service Description</label>
                <textarea
                  rows={2}
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  placeholder="Detailing procedures, chemicals used, warranty coverage..."
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
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Menu Import Specification Modal */}
      {showAiImportModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileUp className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-bold text-white">AI Menu Import Specification</h2>
              </div>
              <button
                onClick={() => setShowAiImportModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                In accordance with <strong>Section 12 of the Master Prompt</strong>, the upcoming AI Menu Import feature enables business owners to paste unformatted menu text or upload PDF flyers.
              </p>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-semibold text-cyan-400 text-xs">
                  Mandatory Architectural Safeguards:
                </div>
                <ul className="space-y-1.5 text-slate-400 list-disc list-inside text-[11px]">
                  <li>All extracted packages, prices, and durations are imported strictly as <strong>drafts</strong>.</li>
                  <li>AI is prohibited from silently publishing unreviewed catalog changes.</li>
                  <li>The shop owner must explicitly review, adjust, and approve each tier price before it becomes live.</li>
                  <li>Manual catalog management remains 100% operational even when AI services are offline.</li>
                </ul>
              </div>

              <p className="text-[11px] text-slate-500 font-mono">
                Status: Scheduled for Phase 6 (Arturo AI Integration). Manual catalog management active now.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowAiImportModal(false)}
                className="px-4 py-2 rounded-lg font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 text-xs"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
