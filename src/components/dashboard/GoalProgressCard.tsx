import { Card } from '../ui/Card';
import type { RunnerGoal } from '../../types';
import { daysUntil } from '../../lib/dateUtils';

interface GoalProgressCardProps {
  goal?: RunnerGoal;
  weekActualKm: number;
  weeklyGoalKm?: number;
}

export function GoalProgressCard({ goal, weekActualKm, weeklyGoalKm }: GoalProgressCardProps) {
  if (!goal?.currentGoal && !weeklyGoalKm) return null;

  const daysOut = goal?.raceDate ? daysUntil(goal.raceDate) : null;
  const pct = weeklyGoalKm && weeklyGoalKm > 0 ? Math.min((weekActualKm / weeklyGoalKm) * 100, 100) : null;

  const barColor = pct == null ? '' : pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-indigo-500' : 'bg-amber-500';

  return (
    <Card>
      {goal?.currentGoal && (
        <div className="mb-3">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Goal</p>
          <p className="text-sm font-semibold text-slate-800 mt-0.5">{goal.currentGoal}</p>
          {daysOut !== null && daysOut > 0 && (
            <p className="text-xs text-indigo-600 font-medium mt-0.5">{daysOut} days out</p>
          )}
          {daysOut !== null && daysOut <= 0 && (
            <p className="text-xs text-green-600 font-medium mt-0.5">Race week!</p>
          )}
        </div>
      )}

      {pct !== null && weeklyGoalKm && (
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>This week: {weekActualKm.toFixed(1)} km</span>
            <span>Goal: {weeklyGoalKm} km</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs text-slate-400 mt-1">{pct.toFixed(0)}% of weekly target</p>
        </div>
      )}
    </Card>
  );
}
