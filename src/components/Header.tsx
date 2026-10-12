import React from 'react';
import { 
  Building2, 
  Plus, 
  ShieldCheck, 
  Sparkles, 
  Search, 
  ChevronDown,
  Info
} from 'lucide-react';
import { TenantOrganization } from '../types/crm';

interface HeaderProps {
  currentOrg: TenantOrganization;
  allOrgs: TenantOrganization[];
  onSelectOrg: (org: TenantOrganization) => void;
  onOpenNewBooking: () => void;
  onOpenArturoAi: () => void;
  currentViewTitle: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentOrg,
  allOrgs,
  onSelectOrg,
  onOpenNewBooking,
  onOpenArturoAi,
  currentViewTitle,
}) => {
  const [showOrgDropdown, setShowOrgDropdown] = React.useState(false);
  const [showBanner, setShowBanner] = React.useState(true);

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
      {/* Stage 0 Prototype Banner */}
      {showBanner && (
        <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-blue-950/80 border-b border-cyan-800/40 px-4 py-2 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-semibold text-cyan-400 shrink-0">Stage A / Phase 0 Prototype</span>
            <span className="text-slate-500 hidden sm:inline" aria-hidden="true">·</span>
            <span className="truncate text-slate-300">
              Interactive visual build with local state & demonstration records. Live Supabase database & payment processing detached until Phase 1 approval.
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-2">
            <span className="text-slate-400 hidden md:inline text-[11px] font-mono">domain: {currentOrg.domain.replace('https://', '')}</span>
            <button
              onClick={() => setShowBanner(false)}
              className="text-slate-400 hover:text-slate-200 text-xs px-1.5 py-0.5 rounded transition-colors"
              aria-label="Dismiss phase banner"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Top Bar Contract: 3 Zones */}
      <div className="flex items-center justify-between gap-6 px-4 lg:px-8 py-3.5">
        {/* Zone 1: Brand & Multi-Tenant Switcher */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-base shadow-sm">
              E
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white whitespace-nowrap block leading-none">
                Elite Tech CRM
              </span>
              <span className="text-[11px] text-slate-400 whitespace-nowrap block mt-1 font-mono">
                Multi-Tenant Business OS
              </span>
            </div>
          </div>

          <div className="hidden sm:block h-6 w-px bg-slate-800" />

          {/* Organization Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowOrgDropdown(!showOrgDropdown)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-200 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="max-w-[140px] md:max-w-[190px] truncate">{currentOrg.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {showOrgDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowOrgDropdown(false)} 
                />
                <div className="absolute left-0 mt-2 w-72 rounded-lg bg-slate-900 border border-slate-800 shadow-xl shadow-black/50 z-50 p-2 text-xs">
                  <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Organization (Multi-Tenant Demo)
                  </div>
                  <div className="space-y-1 mt-1">
                    {allOrgs.map((org) => {
                      const isSelected = org.id === currentOrg.id;
                      return (
                        <button
                          key={org.id}
                          onClick={() => {
                            onSelectOrg(org);
                            setShowOrgDropdown(false);
                          }}
                          className={`w-full text-left px-2.5 py-2 rounded-md transition-colors flex flex-col gap-0.5 ${
                            isSelected 
                              ? 'bg-cyan-500/10 border border-cyan-500/30 text-white' 
                              : 'hover:bg-slate-800/80 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs">{org.name}</span>
                            {org.id === 'org_elite_tech_miami' ? (
                              <span className="text-[10px] text-cyan-400 font-mono">Primary Active</span>
                            ) : (
                              <span className="text-[10px] text-slate-500 font-mono">Preview Tenant</span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 truncate">{org.cityState} · {org.businessType.replace('_', ' ')}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-800 px-2 text-[11px] text-slate-400 leading-relaxed">
                    Demonstrates independent organization configuration and business models.
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Zone 2: Navigation Breadcrumb / View Indicator */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
          <span className="text-slate-500">Workspace</span>
          <span aria-hidden="true">/</span>
          <span className="text-white font-medium">{currentViewTitle}</span>
          <span aria-hidden="true">·</span>
          <span className="text-cyan-400/90 font-mono">{currentOrg.cityState}</span>
        </div>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenArturoAi}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/50 transition-colors whitespace-nowrap"
            title="Arturo AI Assistant (Phase 6 Preview)"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Arturo Copilot</span>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1 rounded font-mono">P6</span>
          </button>

          <button
            onClick={onOpenNewBooking}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-sm shadow-cyan-900/40 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>New Booking</span>
          </button>
        </div>
      </div>
    </header>
  );
};
