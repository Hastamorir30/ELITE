import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  ShieldAlert,
  Send,
  X,
  CheckCircle2,
  Car,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { TenantOrganization, Customer } from '../types/crm';

interface ArturoAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOrg: TenantOrganization;
  customers: Customer[];
}

export const ArturoAiModal: React.FC<ArturoAiModalProps> = ({
  isOpen,
  onClose,
  currentOrg,
  customers,
}) => {
  if (!isOpen) return null;

  const [activePrompt, setActivePrompt] = useState<string | null>(null);

  const sampleCapabilities = [
    {
      title: 'Customer Briefing (Alejandro Vance)',
      question: 'Summarize Alejandro Vance’s service history, vehicle care preferences, and ceramic warranty status.',
      response: `Alejandro Vance (Porsche 911 GT3 RS, Miami):
• Lifetime Spend: $1,680 across 6 detailing sessions.
• Paint Condition: Ceramic Coated under active warranty (expires April 15, 2028).
• Technician Notes: Extremely particular regarding wheel barrel finish; requires non-greasy matte finish on Napa leather.
• Recommendation: Schedule 6-month ceramic boost decontamination wash before track season.`,
    },
    {
      title: 'Miami Weather & Detailing Advisory',
      question: 'How should mobile detailing van crews handle South Florida afternoon rain and sprinkler water spots?',
      response: `Miami Regional Detailing Advisory:
• High humidity & sudden 3:00 PM showers require scheduling ceramic coating applications in the morning window (8:00 AM - 12:00 PM) to ensure proper initial cure time.
• Calcium & mineral-heavy Miami sprinkler water spots on dark paints (like Sofia Delgado's BMW M4) require acidic bath neutralization prior to machine polishing to avoid burning minerals into clearcoat.`,
    },
    {
      title: 'Quote & Package Recommendation',
      question: 'Recommend a detailing package for a Range Rover Autobiography with light swirl marks and pet hair.',
      response: `Recommended Package:
1. Core: Elite Restoration (SUV Tier: $390) — 4 to 5.5 hours. Multi-stage cut eliminates light swirl marks and restores clearcoat depth.
2. Add-on: Seat Extraction ($80 for 2 rows) — deep heated soil extraction.
3. Add-on: Deep Carpet Extraction ($80) — enzymatic shampoo removes pet dander and sand.
Estimated Invoice Total: $550 + 7% Miami-Dade Tax ($38.50) = $588.50.`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Arturo AI Copilot</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                  Phase 6 Architecture Spec
                </span>
              </div>
              <p className="text-xs text-slate-400">
                AI operating assistant for {currentOrg.name} ({currentOrg.cityState}).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 17 Master Prompt Guidelines */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Section 17 AI Assistant Governance Rules:</span>
          </div>
          <ul className="space-y-1 text-slate-400 text-[11px] list-disc list-inside leading-relaxed">
            <li>Strict multi-tenant boundaries: Arturo cannot access data belonging to another organization.</li>
            <li>Distinguishes verified records from assumptions.</li>
            <li>Requires human confirmation before sensitive actions (sending customer SMS, modifying prices, issuing refunds).</li>
            <li>Core CRM functions remain 100% operational even if the AI model or API is unavailable.</li>
          </ul>
        </div>

        {/* Interactive Capability Demonstrations */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Explore Planned Arturo Capabilities (Interactive Simulation)
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {sampleCapabilities.map((item, index) => {
              const isSelected = activePrompt === item.title;
              return (
                <div
                  key={index}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-slate-950 border-cyan-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-white">
                      {item.title}
                    </span>
                    <button
                      onClick={() => setActivePrompt(isSelected ? null : item.title)}
                      className="text-[11px] text-cyan-400 hover:underline font-mono"
                    >
                      {isSelected ? 'Hide briefing' : 'Simulate query →'}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1 italic">
                    "{item.question}"
                  </p>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300 whitespace-pre-line leading-relaxed font-mono text-[11px] bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                      {item.response}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Targeting Gemini 2.5 Flash / Server-Side Tool Calling</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
