import React, { useState } from 'react';
import {
  X,
  Bell,
  Sparkles,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  Sliders,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import { JobAlert } from '../types';

interface JobAlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: JobAlert[];
  onMarkAllAsRead: () => void;
  onSimulateNewAlert: () => void;
  onSelectAlert: (alert: JobAlert) => void;
}

export const JobAlertsDrawer: React.FC<JobAlertsDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  onMarkAllAsRead,
  onSimulateNewAlert,
  onSelectAlert,
}) => {
  if (!isOpen) return null;

  const [minMatchAlert, setMinMatchAlert] = useState(80);
  const [receiveEmailNotification, setReceiveEmailNotification] = useState(true);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Instant Job Alerts</h2>
              <p className="text-[11px] text-slate-400">Feature 8: Real-Time Opportunity Radar</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Simulation Trigger Bar */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-2">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-200">Simulate Real-Time Influx</span>
            <p className="text-[10px] text-slate-400">Trigger simulated new opening</p>
          </div>
          <button
            onClick={onSimulateNewAlert}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Simulate Alert</span>
          </button>
        </div>

        {/* Preferences Toggle */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Minimum Match Threshold:
            </span>
            <span className="font-bold text-emerald-400">{minMatchAlert}%</span>
          </div>
          <input
            type="range"
            min="60"
            max="95"
            step="5"
            value={minMatchAlert}
            onChange={(e) => setMinMatchAlert(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
          <div className="flex items-center justify-between text-[11px] pt-1">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={receiveEmailNotification}
                onChange={(e) => setReceiveEmailNotification(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-0 bg-slate-800 border-slate-700"
              />
              <span>Send instant email digest</span>
            </label>
            <button onClick={onMarkAllAsRead} className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Mark all read
            </button>
          </div>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">No active alerts at this moment.</div>
          ) : (
            alerts.map((al) => (
              <div
                key={al.id}
                onClick={() => onSelectAlert(al)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  !al.read
                    ? 'bg-indigo-950/40 border-indigo-500/40 hover:border-indigo-400'
                    : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {al.type}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1">{al.jobTitle}</h3>
                    <p className="text-xs font-semibold text-indigo-300">{al.company}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded-md text-xs font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {al.matchScore}% Match
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{al.timestamp}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{al.location}</span>
                  </span>

                  <span className="text-indigo-400 font-semibold text-[11px] flex items-center gap-1">
                    <span>View Opportunity</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
