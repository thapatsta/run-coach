import type { Run, DistanceUnit } from '../../types';
import { formatPace, formatDuration, distanceKmToDisplay } from '../../lib/pace';

interface RunStatsProps {
  run: Run;
  unit: DistanceUnit;
}

interface StatPillProps {
  label: string;
  value: string;
}

function StatPill({ label, value }: StatPillProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-slate-50 px-3 py-2 min-w-0">
      <span className="text-xs text-slate-400 font-medium">{label}</span>
      <span className="text-sm font-bold text-slate-800 mt-0.5 truncate">{value}</span>
    </div>
  );
}

export function RunStats({ run, unit }: RunStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <StatPill label="Distance" value={distanceKmToDisplay(run.distanceKm, unit)} />
      <StatPill label="Pace" value={formatPace(run.paceSecondsPerKm, unit)} />
      <StatPill label="Duration" value={formatDuration(run.durationSeconds)} />
      <StatPill label="RPE" value={`${run.perceivedEffort}/10`} />
      {run.heartRateAvg && <StatPill label="Avg HR" value={`${run.heartRateAvg} bpm`} />}
      {run.elevationGainM && <StatPill label="Elevation" value={`+${run.elevationGainM}m`} />}
      {run.sleepHours != null && <StatPill label="Sleep" value={`${run.sleepHours}h`} />}
      {run.energyLevel != null && <StatPill label="Energy" value={`${run.energyLevel}/10`} />}
    </div>
  );
}
