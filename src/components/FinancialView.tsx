import React, { useState } from 'react';
import {
  Receipt,
  DollarSign,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  FileText,
  Printer,
  Download,
  ShieldAlert,
  X,
  CreditCard,
  Building2
} from 'lucide-react';
import { Invoice, TenantOrganization } from '../types/crm';

interface FinancialViewProps {
  invoices: Invoice[];
  currentOrg: TenantOrganization;
  onUpdateInvoiceStatus: (invoiceId: string, status: Invoice['status']) => void;
}

export const FinancialView: React.FC<FinancialViewProps> = ({
  invoices,
  currentOrg,
  onUpdateInvoiceStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Compute metrics with tabular figures
  const totalBilled = invoices.reduce((acc, curr) => acc + curr.total, 0);
  const collected = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((acc, curr) => acc + curr.total, 0);
  const pending = invoices
    .filter((inv) => inv.status === 'pending')
    .reduce((acc, curr) => acc + curr.total, 0);
  const draft = invoices
    .filter((inv) => inv.status === 'draft')
    .reduce((acc, curr) => acc + curr.total, 0);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{currentOrg.name}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-cyan-400">Financial Ledger Prototype</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Financial Ledger & Invoices
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Detailed client invoices, estimates, simulated payment references, and 7% Miami-Dade sales tax accounting.
          </p>
        </div>

        {/* Phase 0 Financial Safety Notice */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Simulated records only · Square API detached</span>
        </div>
      </div>

      {/* Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Invoiced</span>
            <Receipt className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono tabular-nums">
            ${totalBilled.toFixed(2)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">
            Across {invoices.length} billing items
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Collected Revenue</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400 font-mono tabular-nums">
            ${collected.toFixed(2)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">
            Settled simulated funds
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pending Payment</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-400 font-mono tabular-nums">
            ${pending.toFixed(2)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">
            Due upon job pickup
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Draft Estimates</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono tabular-nums">
            ${draft.toFixed(2)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">
            Pending service sign-off
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoices by invoice number or client name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs shrink-0">
          {[
            { id: 'all', label: 'All Invoices' },
            { id: 'paid', label: 'Paid' },
            { id: 'pending', label: 'Pending' },
            { id: 'draft', label: 'Drafts' },
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

      {/* Invoices Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Subtotal</th>
                <th className="py-3 px-4">Tax (7%)</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-medium text-white">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3 px-4 text-slate-200">
                    <span className="font-medium">{inv.customerName}</span>
                    <span className="block text-[10px] text-slate-500 truncate">{inv.customerEmail}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {inv.date}
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-300">
                    ${inv.subtotal.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-400">
                    ${inv.tax.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-white tabular-nums">
                    ${inv.total.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                        inv.status === 'paid'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                          : inv.status === 'pending'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInvoice(inv);
                      }}
                      className="text-cyan-400 hover:text-cyan-300 font-medium text-xs"
                    >
                      View Receipt →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Invoice Receipt Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs">
                    E
                  </div>
                  <span className="font-bold text-white text-base">Elite Tech Auto Detailing</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">
                  {currentOrg.address} · {currentOrg.cityState}
                </p>
                <p className="text-[11px] text-cyan-400 font-mono">
                  {currentOrg.domain}
                </p>
              </div>

              <button
                onClick={() => setSelectedInvoice(null)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Invoice Meta Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Billed To</span>
                <span className="text-white font-medium block">{selectedInvoice.customerName}</span>
                <span className="text-slate-400 text-[11px] block">{selectedInvoice.customerEmail}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Invoice Info</span>
                <span className="text-white font-mono block">{selectedInvoice.invoiceNumber}</span>
                <span className="text-slate-400 text-[11px] block font-mono">Date: {selectedInvoice.date}</span>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="rounded-lg border border-slate-800 bg-slate-950 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-[10px] font-semibold text-slate-400 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Service Item</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Price</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {selectedInvoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 text-slate-200">{item.name}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-400">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-300 tabular-nums">${item.unitPrice.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium text-white tabular-nums">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="p-3 bg-slate-900/60 border-t border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums">${selectedInvoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Miami-Dade Sales Tax (7.0%)</span>
                  <span className="font-mono tabular-nums">${selectedInvoice.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-1.5 border-t border-slate-800">
                  <span>Total Amount</span>
                  <span className="font-mono text-cyan-400 tabular-nums">${selectedInvoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method / Status */}
            <div className="flex items-center justify-between text-xs p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-300">
                  {selectedInvoice.paymentMethod || 'Pay at Counter / Mobile Unit'}
                </span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                selectedInvoice.status === 'paid' 
                  ? 'bg-emerald-950 text-emerald-400' 
                  : 'bg-amber-950 text-amber-400'
              }`}>
                {selectedInvoice.status}
              </span>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {selectedInvoice.status === 'pending' && (
                  <button
                    onClick={() => {
                      onUpdateInvoiceStatus(selectedInvoice.id, 'paid');
                      setSelectedInvoice({ ...selectedInvoice, status: 'paid' });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-colors"
                  >
                    Simulate Mark as Paid
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Simulated print trigger: In Phase 4, PDF invoices are generated via server template.')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-1.5 rounded-lg font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
