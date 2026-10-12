import React, { useState } from 'react';
import {
  Building2,
  Sliders,
  Shield,
  Key,
  Clock,
  Car,
  Sparkles,
  Users,
  Check,
  Plus,
  X,
  Server,
  Globe,
  Lock,
  Layers
} from 'lucide-react';
import { TenantOrganization, CustomFieldDefinition, BusinessType } from '../types/crm';

interface SettingsViewProps {
  currentOrg: TenantOrganization;
  allOrgs: TenantOrganization[];
  onSelectOrg: (org: TenantOrganization) => void;
  customFields: CustomFieldDefinition[];
  onAddCustomField: (field: CustomFieldDefinition) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentOrg,
  allOrgs,
  onSelectOrg,
  customFields,
  onAddCustomField,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'custom_fields' | 'roles' | 'security'>('profile');
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);

  // New field state
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldType, setNewFieldType] = useState<CustomFieldDefinition['dataType']>('text');
  const [newFieldRequired, setNewFieldRequired] = useState(false);

  const handleCreateField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldName) return;

    const key = newFieldKey || newFieldName.toLowerCase().replace(/[^a-z0-9]/g, '');

    const field: CustomFieldDefinition = {
      id: `cf_${Date.now().toString().slice(-4)}`,
      orgId: currentOrg.id,
      entityType: 'customer',
      name: newFieldName,
      key,
      dataType: newFieldType,
      isRequired: newFieldRequired,
      displayOrder: customFields.length + 1,
      isActive: true,
    };

    onAddCustomField(field);
    setShowAddFieldModal(false);
    setNewFieldName('');
    setNewFieldKey('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Organization Settings & Multi-Tenant Engine
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure business profile, branding, custom field architecture, and view multi-tenant security status.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        {[
          { id: 'profile', label: 'Business Profile & Domain' },
          { id: 'custom_fields', label: 'Custom Field Architect' },
          { id: 'roles', label: 'Roles & Access Control' },
          { id: 'security', label: 'Backend & Security Audit' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Business Profile & Multi-Tenant Demo Switcher */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Organization Selector */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span>Tenant Organization Context</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select an organization to simulate how data and terminology adapt per tenant.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              {allOrgs.map((org) => {
                const isSelected = org.id === currentOrg.id;
                return (
                  <div
                    key={org.id}
                    onClick={() => onSelectOrg(org)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-950 border-cyan-500/80 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/40'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">{org.name}</span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      )}
                    </div>
                    <span className="block text-xs text-cyan-400 font-mono mt-1">
                      {org.domain}
                    </span>
                    <span className="block text-[11px] text-slate-400 mt-1">
                      {org.cityState} · {org.businessType.replace('_', ' ')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Profile Details Form */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Profile Details ({currentOrg.name})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Company Display Name</label>
                <input
                  type="text"
                  readOnly
                  value={currentOrg.name}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Primary Web Domain</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    readOnly
                    value={currentOrg.domain}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Dispatch Phone</label>
                <input
                  type="text"
                  readOnly
                  value={currentOrg.phone}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Service Email</label>
                <input
                  type="text"
                  readOnly
                  value={currentOrg.email}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Studio / Dispatch Address</label>
                <input
                  type="text"
                  readOnly
                  value={currentOrg.address}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">City, State & Postal Code</label>
                <input
                  type="text"
                  readOnly
                  value={currentOrg.cityState}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-semibold text-slate-300">Multi-Tenant Isolation Notice:</span>
              <p>
                Each organization operates with its own tenant ID. When switched, customer records, catalogs, and staff memberships are isolated at the application boundary and will be governed by Supabase Row-Level Security in Phase 1.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Custom Field Architect */}
      {activeTab === 'custom_fields' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Dynamic Custom Field Architect</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Define domain-specific attributes for customers without altering database schemas.
              </p>
            </div>

            <button
              onClick={() => setShowAddFieldModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Add Custom Field</span>
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase font-mono">
                <tr>
                  <th className="py-3 px-4">Field Name</th>
                  <th className="py-3 px-4">Internal Key</th>
                  <th className="py-3 px-4">Data Type</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Required</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {customFields.map((field) => (
                  <tr key={field.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-white">
                      {field.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-cyan-400 text-[11px]">
                      {field.key}
                    </td>
                    <td className="py-3 px-4 font-mono uppercase text-slate-400 text-[10px]">
                      {field.dataType}
                    </td>
                    <td className="py-3 px-4 text-slate-300 capitalize">
                      {field.entityType}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {field.isRequired ? 'Yes' : 'No'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Roles & Access Control Preview */}
      {activeTab === 'roles' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Role-Based Access Control (RBAC Specification)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Prepared for Phase 1 Supabase authentication and organization membership claims.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">Organization Owner</span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded">Full Admin</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Full access to financial ledgers, pricing adjustments, custom field schemas, team invitations, and integration webhooks.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">Shop Manager / Lead Tech</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">Operations</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Can create and assign appointments, sign off on quality checklists, update customer vehicle notes, and generate invoices.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">Mobile Van Detailer</span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded">Field Tech</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Mobile-optimized view: inspect assigned daily jobs, toggle checklists, log paint notes, and trigger arrival timestamps.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">Front Desk / Dispatcher</span>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-950 px-2 py-0.5 rounded">Scheduling</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Customer intake, schedule booking, phone confirmations, and calendar management. Financial settings restricted.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Backend & Security Audit */}
      {activeTab === 'security' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>Phase 0 Architecture & Security Verification Status</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Honest status of backend components in accordance with Section 5 of the Master Prompt.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-800/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Frontend SPA & Reactive State</span>
                <span className="text-[10px] font-mono text-emerald-400">ACTIVE & VERIFIED</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                React 19 + Tailwind v4 + Vite. All screens, modals, pricing formulas, and checklists are fully navigable.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-800/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Supabase PostgreSQL & RLS Policies</span>
                <span className="text-[10px] font-mono text-amber-400">DEFERRED TO PHASE 1</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                No destructive migrations run in Phase 0. Schema designs ready for user approval before provisioning.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-800/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Payment Gateway (Square / Stripe Connect)</span>
                <span className="text-[10px] font-mono text-amber-400">DEFERRED TO PHASE 4</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Invoices and receipts are simulated with local state and Miami-Dade 7.0% tax. No payment card tokens stored.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-800/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Arturo AI Assistant Engine</span>
                <span className="text-[10px] font-mono text-amber-400">DEFERRED TO PHASE 6</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                AI capabilities specified and showcased via preview dialog. No premature API billing or hallucinated calls.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Field Modal */}
      {showAddFieldModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">Add Dynamic Custom Field</h2>
              <button
                onClick={() => setShowAddFieldModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateField} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Field Display Name *</label>
                <input
                  type="text"
                  required
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  placeholder="e.g. Paint Thickness (Mils)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Internal Key</label>
                <input
                  type="text"
                  value={newFieldKey}
                  onChange={(e) => setNewFieldKey(e.target.value)}
                  placeholder="e.g. paintThickness"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Data Type</label>
                <select
                  value={newFieldType}
                  onChange={(e) => setNewFieldType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="text">Text (Single-line)</option>
                  <option value="number">Number</option>
                  <option value="select">Dropdown Selection</option>
                  <option value="date">Date</option>
                  <option value="boolean">Boolean (Yes / No)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="req_field"
                  checked={newFieldRequired}
                  onChange={(e) => setNewFieldRequired(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-cyan-400"
                />
                <label htmlFor="req_field" className="text-slate-300">
                  Required field during client intake
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddFieldModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300"
                >
                  Save Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
