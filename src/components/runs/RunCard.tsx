import { useNavigate } from 'react-router-dom';
import type { Run, DistanceUnit } from '../../types';
import { RunTypeBadge, TagBadge } from '../ui/Badge';
import { formatPace, formatDuration, distanceKmToDisplay } from '../../lib/pace';
import { formatDateDisplay } from '../../lib/dateUtils';

interface RunCardProps {
  run: Run;
  unit: DistanceUnit;
}

export function RunCard({ run, unit }: RunCardProps) {
  const navigate = useNavigate();

  const rpeColor =
    run.perceivedEffort <= 3 ? 'text-green-600' :
    run.perceivedEffort <= 6 ? 'text-amber-600' : 'text-red-500';

  return (
    <button
      onClick={() => navigate(`/runs/${run.id}`)}
      className="w-full text-left rounded-2xl bg-white border border-slate-100 shadow-sm p-4 hover:shadow-md transition-all active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-xs text-slate-400">{formatDateDisplay(run.date)}</p>
          <p className="text-lg font-bold text-slate-900">{distanceKmToDisplay(run.distanceKm, unit)}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <RunTypeBadge type={run.runType} />
          <span className={`text-xs font-semibold ${rpeColor}`}>RPE {run.perceivedEffort}</span>
        </div>
      </div>

      <div className="flex gap-4 text-sm text-slate-600 mb-2">
        <span>{formatPace(run.paceSecondsPerKm, unit)}</span>
        <span>{formatDuration(run.durationSeconds)}</span>
        {run.heartRateAvg && <span>{run.heartRateAvg} bpm</span>}
        {run.elevationGainM && <span>↑{run.elevationGainM}m</span>}
      </div>

      {run.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {run.tags.map((tag) => <TagBadge key={tag} tag={tag} />)}
        </div>
      )}

      {run.aiInsights && (
        <div className="flex items-center gap-1 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <span className="text-xs text-indigo-500 font-medium">AI insights ready</span>
        </div>
      )}

      {(run.painLevel ?? 0) > 0 && (
        <p className="text-xs text-red-500 mt-1">⚠️ Pain: {run.painLevel}/10{run.painLocation ? ` — ${run.painLocation}` : ''}</p>
      )}
    </button>
  );
}
