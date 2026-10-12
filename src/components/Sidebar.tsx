import React from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Layers,
  ClipboardCheck,
  Receipt,
  Sliders,
  Settings,
  Bot,
  Car,
  Sparkles,
  Phone,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { TenantOrganization } from '../types/crm';

export type ActiveTab = 
  | 'dashboard' 
  | 'customers' 
  | 'appointments' 
  | 'services' 
  | 'work_orders' 
  | 'financials' 
  | 'modules' 
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  currentOrg: TenantOrganization;
  customersCount: number;
  appointmentsCount: number;
  workOrdersCount: number;
  onOpenArturoModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentOrg,
  customersCount,
  appointmentsCount,
  workOrdersCount,
  onOpenArturoModal,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      id: 'customers' as ActiveTab,
      label: 'Customers',
      icon: Users,
      badge: customersCount.toString(),
    },
    {
      id: 'appointments' as ActiveTab,
      label: 'Appointments',
      icon: Calendar,
      badge: appointmentsCount.toString(),
    },
    {
      id: 'services' as ActiveTab,
      label: 'Services & Catalog',
      icon: Layers,
      badge: undefined,
    },
    {
      id: 'work_orders' as ActiveTab,
      label: 'Jobs & Work Orders',
      icon: ClipboardCheck,
      badge: workOrdersCount.toString(),
    },
    {
      id: 'financials' as ActiveTab,
      label: 'Financials & Invoices',
      icon: Receipt,
      badge: undefined,
    },
    {
      id: 'modules' as ActiveTab,
      label: 'Modules & Flags',
      icon: Sliders,
      badge: undefined,
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Settings & Tenant',
      icon: Settings,
      badge: undefined,
    },
  ];

  return (
    <aside className="w-full lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 lg:min-h-[calc(100vh-73px)]">
      {/* Top Organization Card */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700/80 flex items-center justify-center text-cyan-400 shrink-0">
            {currentOrg.businessType === 'auto_detailing' ? (
              <Car className="w-5 h-5 text-cyan-400" />
            ) : currentOrg.businessType === 'nail_salon' ? (
              <Sparkles className="w-5 h-5 text-pink-400" />
            ) : (
              <Layers className="w-5 h-5 text-emerald-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-white truncate leading-tight">
              {currentOrg.name}
            </h2>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              {currentOrg.cityState}
            </p>
          </div>
        </div>

        {/* Business Domain Link */}
        <div className="mt-3 flex items-center justify-between text-[11px] bg-slate-950/60 rounded px-2.5 py-1.5 border border-slate-800">
          <span className="text-slate-400 truncate font-mono">
            {currentOrg.domain.replace('https://', '')}
          </span>
          <span className="text-[10px] text-cyan-400 font-mono shrink-0 ml-1">Live Host</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Core Operations
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Arturo AI Teaser */}
        <div className="pt-4 mt-2 border-t border-slate-800">
          <div className="px-3 py-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            AI Operating Copilot
          </div>
          <button
            onClick={onOpenArturoModal}
            className="w-full mt-1 flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-cyan-950/30 border border-slate-800 hover:border-cyan-800/40 transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <Bot className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <span className="block text-white leading-none">Arturo Assistant</span>
                <span className="block text-[10px] text-slate-400 mt-1">Phase 6 Copilot Spec</span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
          </button>
        </div>
      </nav>

      {/* Organization Hours & Contact Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Business Hours</span>
          <span className="text-slate-300 font-mono text-[10px]">{currentOrg.businessHours.hours}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Dispatch Phone</span>
          <span className="text-slate-300 font-mono text-[10px]">{currentOrg.phone}</span>
        </div>
        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
          <span>AI Studio Build</span>
          <span className="text-cyan-400 font-mono">Stage A Prototype</span>
        </div>
      </div>
    </aside>
  );
};
