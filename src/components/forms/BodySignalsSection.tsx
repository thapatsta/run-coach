import type { RunFormValues } from '../../types';
import { useState } from 'react';

interface BodySignalsSectionProps {
  values: RunFormValues;
  onChange: (patch: Partial<RunFormValues>) => void;
}

const input = 'w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';
const label = 'block text-xs font-medium text-slate-500 mb-1';

function ScaleInput({ value, onChange, min = 0, max = 10 }: { value: string; onChange: (v: string) => void; min?: number; max?: number }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={min}
        max={max}
        step="0.5"
        className={input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`${min}–${max}`}
      />
    </div>
  );
}

export function BodySignalsSection({ values, onChange }: BodySignalsSectionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-100 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <span>Body signals & environment</span>
        <svg
          className={`h-4 w-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-slate-100">
          {/* Body */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-3 mb-2">Body</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>Sleep (hours)</label>
                <input type="number" min={0} max={24} step={0.5} className={input} placeholder="7.5" value={values.sleepHours} onChange={(e) => onChange({ sleepHours: e.target.value })} />
              </div>
              <div>
                <label className={label}>Energy pre-run (1–10)</label>
                <ScaleInput value={values.energyLevel} onChange={(v) => onChange({ energyLevel: v })} min={1} />
              </div>
              <div>
                <label className={label}>Soreness pre-run (1–10)</label>
                <ScaleInput value={values.sorenessLevel} onChange={(v) => onChange({ sorenessLevel: v })} min={1} />
              </div>
              <div>
                <label className={label}>Pain level (0–10)</label>
                <ScaleInput value={values.painLevel} onChange={(v) => onChange({ painLevel: v })} />
              </div>
            </div>
            <div className="mt-3">
              <label className={label}>Pain location</label>
              <input className={input} placeholder="e.g. left foot, right shin" value={values.painLocation} onChange={(e) => onChange({ painLocation: e.target.value })} />
            </div>
          </div>

          {/* Environment */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Environment</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>Temp (°C)</label>
                <input type="number" className={input} placeholder="18" value={values.weatherTempC} onChange={(e) => onChange({ weatherTempC: e.target.value })} />
              </div>
              <div>
                <label className={label}>Humidity (%)</label>
                <input type="number" min={0} max={100} className={input} placeholder="65" value={values.humidityPct} onChange={(e) => onChange({ humidityPct: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Fueling */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Fueling</p>
            <div className="space-y-3">
              <div>
                <label className={label}>Before</label>
                <input className={input} placeholder="e.g. coffee + banana" value={values.fueledBefore} onChange={(e) => onChange({ fueledBefore: e.target.value })} />
              </div>
              <div>
                <label className={label}>During</label>
                <input className={input} placeholder="e.g. gel at 8km, water at aid stations" value={values.fueledDuring} onChange={(e) => onChange({ fueledDuring: e.target.value })} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
