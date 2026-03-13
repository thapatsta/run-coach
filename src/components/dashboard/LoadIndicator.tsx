import { Card } from '../ui/Card';
import type { TrainingLoad } from '../../types';

interface LoadIndicatorProps {
  load: TrainingLoad;
}

export function LoadIndicator({ load }: LoadIndicatorProps) {
  const ratio = load.loadRatio;
  const pct = Math.min((ratio / 2) * 100, 100); // 0–200% → 0–100% of bar

  const barColor =
    ratio > 1.5 ? 'bg-red-500' :
    ratio > 1.25 ? 'bg-amber-500' :
    ratio < 0.7 ? 'bg-slate-300' : 'bg-green-500';

  const label =
    ratio > 1.5 ? 'High — consider backing off' :
    ratio > 1.25 ? 'Elevated — monitor fatigue' :
    ratio < 0.7 ? 'Low — room to build' : 'Optimal range';

  return (
    <Card>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-slate-700">Training Load</h3>
        <span className="text-sm font-bold text-slate-800">{ratio.toFixed(2)}x</span>
      </div>

      <div className="h-2 rounded-full bg-slate-100 overflow-hidden mb-2">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
      </div>

      <p className="text-xs text-slate-500 mb-3">{label}</p>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-xs text-slate-400">Acute (7d)</p>
          <p className="text-sm font-bold text-slate-800">{load.acuteLoadKm.toFixed(0)} km</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Chronic (4wk)</p>
          <p className="text-sm font-bold text-slate-800">{load.chronicLoadKm.toFixed(0)} km</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Run streak</p>
          <p className="text-sm font-bold text-slate-800">{load.consecutiveRunDays}d</p>
        </div>
      </div>
    </Card>
  );
}
