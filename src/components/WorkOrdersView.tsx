import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  Clock,
  Car,
  User,
  Plus,
  Play,
  ArrowRight,
  AlertCircle,
  X,
  MapPin,
  Check,
  FileCheck,
  ShieldCheck
} from 'lucide-react';
import { WorkOrder, WorkOrderStatus, WorkOrderChecklistItem } from '../types/crm';

interface WorkOrdersViewProps {
  workOrders: WorkOrder[];
  onUpdateWorkOrderStatus: (workOrderId: string, status: WorkOrderStatus) => void;
  onToggleChecklistItem: (workOrderId: string, itemId: string) => void;
  onAddWorkOrder: (workOrder: WorkOrder) => void;
}

export const WorkOrdersView: React.FC<WorkOrdersViewProps> = ({
  workOrders,
  onUpdateWorkOrderStatus,
  onToggleChecklistItem,
  onAddWorkOrder,
}) => {
  const [selectedJob, setSelectedJob] = useState<WorkOrder | null>(null);

  const columns: { id: WorkOrderStatus; title: string; count: number }[] = [
    { id: 'scheduled', title: 'Scheduled / Intake', count: workOrders.filter(w => w.status === 'scheduled').length },
    { id: 'checked_in', title: 'Checked-In & Inspected', count: workOrders.filter(w => w.status === 'checked_in').length },
    { id: 'in_progress', title: 'In Service / Detailing', count: workOrders.filter(w => w.status === 'in_progress').length },
    { id: 'quality_check', title: 'Quality Manager Audit', count: workOrders.filter(w => w.status === 'quality_check').length },
    { id: 'completed', title: 'Completed & Delivered', count: workOrders.filter(w => w.status === 'completed').length },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
            <ClipboardCheck className="w-4 h-4 text-amber-400" />
            <span>Prototype Operational Workflow (Stage 0)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Jobs & Work Order Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Physical execution tracking: connecting scheduled bookings with shop bay checklists, paint gauge logs, and final inspection.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg flex items-center gap-2">
          <span className="text-cyan-400">Total Work Orders:</span>
          <span className="font-bold text-white tabular-nums">{workOrders.length} active</span>
        </div>
      </div>

      {/* Kanban Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {columns.map((col) => {
          const colJobs = workOrders.filter((w) => w.status === col.id);
          return (
            <div
              key={col.id}
              className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-3.5 flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-semibold text-slate-300">
                <span className="truncate">{col.title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                  {colJobs.length}
                </span>
              </div>

              {/* Cards in Column */}
              <div className="space-y-3 mt-3 flex-1 overflow-y-auto">
                {colJobs.length === 0 ? (
                  <div className="h-32 border border-dashed border-slate-800/60 rounded-xl flex items-center justify-center text-[11px] text-slate-600 p-3 text-center">
                    No vehicles in this phase
                  </div>
                ) : (
                  colJobs.map((job) => {
                    const completedCount = job.checklist.filter(i => i.completed).length;
                    const progressPercent = Math.round((completedCount / (job.checklist.length || 1)) * 100);

                    return (
                      <div
                        key={job.id}
                        onClick={() => setSelectedJob(job)}
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all shadow-sm group space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                            {job.subjectOrVehicle}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono shrink-0">
                            {job.id}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-400">
                          <span className="text-slate-300">{job.customerName}</span> · {job.serviceName}
                        </div>

                        <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between">
                          <span>Tech: {job.technician}</span>
                          <span className="text-cyan-400/80">{job.bayOrLocation}</span>
                        </div>

                        {/* Checklist mini progress */}
                        <div className="space-y-1 pt-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-500">Inspection</span>
                            <span className="text-cyan-400 font-mono tabular-nums">{completedCount}/{job.checklist.length}</span>
                          </div>
                          <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
                            <div
                              className="bg-cyan-400 h-full rounded-full transition-all"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* Pipeline Move Buttons */}
                        <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px]">
                          <span className="text-slate-500">Move state:</span>
                          <div className="flex items-center gap-1">
                            {job.status !== 'completed' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const nextStatus: Record<WorkOrderStatus, WorkOrderStatus> = {
                                    scheduled: 'checked_in',
                                    checked_in: 'in_progress',
                                    in_progress: 'quality_check',
                                    quality_check: 'completed',
                                    completed: 'completed',
                                  };
                                  onUpdateWorkOrderStatus(job.id, nextStatus[job.status]);
                                }}
                                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 font-medium transition-colors"
                              >
                                Advance →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Job Inspection Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-cyan-400">Work Order Details · {selectedJob.id}</span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  {selectedJob.subjectOrVehicle}
                </h2>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Client</span>
                <span className="text-white font-medium mt-0.5 block">{selectedJob.customerName}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Assigned Tech</span>
                <span className="text-white font-medium mt-0.5 block">{selectedJob.technician}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Bay / Van</span>
                <span className="text-cyan-400 font-mono mt-0.5 block truncate">{selectedJob.bayOrLocation}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Status</span>
                <select
                  value={selectedJob.status}
                  onChange={(e) => {
                    const newSt = e.target.value as WorkOrderStatus;
                    onUpdateWorkOrderStatus(selectedJob.id, newSt);
                    setSelectedJob({ ...selectedJob, status: newSt });
                  }}
                  className="bg-transparent text-white font-mono text-xs focus:outline-none w-full"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="checked_in">Checked In</option>
                  <option value="in_progress">In Progress</option>
                  <option value="quality_check">Quality Check</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Interactive Quality & Procedure Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Shop Procedural Checklist & Inspection Steps</span>
                </h3>
                <span className="text-xs font-mono text-cyan-400">
                  {selectedJob.checklist.filter(i => i.completed).length} of {selectedJob.checklist.length} Verified
                </span>
              </div>

              <div className="space-y-2">
                {selectedJob.checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onToggleChecklistItem(selectedJob.id, item.id);
                      setSelectedJob({
                        ...selectedJob,
                        checklist: selectedJob.checklist.map(ci => 
                          ci.id === item.id ? { ...ci, completed: !ci.completed } : ci
                        )
                      });
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      item.completed 
                        ? 'bg-slate-950 border-cyan-800/40 text-slate-200' 
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                        item.completed ? 'bg-cyan-500 text-slate-950 font-bold' : 'border border-slate-700'
                      }`}>
                        {item.completed && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs font-medium">{item.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      {item.completed ? 'PASSED' : 'PENDING'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Operational Notes */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
              <div className="text-slate-400 font-semibold text-[11px]">
                Pre-Service Inspection & Vehicle Notes:
              </div>
              <p className="text-slate-300 leading-relaxed">
                {selectedJob.inspectionNotes || 'No anomalies recorded during walkaround.'}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[11px]">
                Updated: {selectedJob.updatedAt}
              </span>
              <button
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 rounded-lg font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300"
              >
                Close Work Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
