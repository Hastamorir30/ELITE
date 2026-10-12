import React from 'react';
import {
  Sliders,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Sparkles,
  Layers,
  Info,
  Lock
} from 'lucide-react';
import { ModuleFlag } from '../types/crm';

interface ModulesViewProps {
  moduleFlags: ModuleFlag[];
  onToggleModule: (moduleId: string) => void;
}

export const ModulesView: React.FC<ModulesViewProps> = ({
  moduleFlags,
  onToggleModule,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Modular Architecture & Feature Flags
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Enable or disable business operating capabilities per tenant without code redeployments or database migrations.
        </p>
      </div>

      {/* Section 9 Architectural Principles Notice */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Section 9 Architecture Contract: Module Governance</span>
        </div>
        <p className="text-slate-300 leading-relaxed text-[11px]">
          In the production platform, toggling a feature flag off hides the operational workflows but <strong>never deletes historical records, breaks relational foreign keys, or weakens multi-tenant authorization</strong>. Core CRM authentication and tenant isolation are non-optional invariants.
        </p>
      </div>

      {/* Modules Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {moduleFlags.map((mod) => (
          <div
            key={mod.id}
            className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
              mod.enabled
                ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                : 'bg-slate-900/40 border-slate-800/40 opacity-75'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <span>{mod.name}</span>
                    {mod.isCore && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                        Core Essential
                      </span>
                    )}
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                    key: {mod.key}
                  </span>
                </div>

                {/* Toggle switch */}
                {mod.isCore ? (
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                    <Lock className="w-3 h-3 text-slate-500" />
                    <span>Locked</span>
                  </span>
                ) : (
                  <button
                    onClick={() => onToggleModule(mod.id)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      mod.enabled ? 'bg-cyan-500' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                        mod.enabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                {mod.description}
              </p>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 capitalize">Category: {mod.category}</span>
              <span className={`font-mono text-[10px] ${mod.enabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                {mod.enabled ? 'Enabled in App' : 'Disabled'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
