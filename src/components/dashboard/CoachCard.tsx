import { Card } from '../ui/Card';
import { StatusBadge } from '../ui/Badge';
import type { TrainingLoad } from '../../types';

interface CoachCardProps {
  load: TrainingLoad;
  weeklyGoalKm?: number;
  weekActualKm?: number;
  goalPhase?: string;
}

function getRecommendedNext(load: TrainingLoad, weeklyGoalKm?: number, weekActualKm?: number): string {
  if (load.fatigueStatus === 'alert') {
    return 'Rest day or very easy 20–30 min walk. Your body is showing signs of accumulated fatigue.';
  }
  if (load.fatigueStatus === 'caution') {
    return 'Easy recovery run, 30–40 min at conversational pace. Keep RPE under 5.';
  }
  if (weeklyGoalKm && weekActualKm != null) {
    const remaining = weeklyGoalKm - weekActualKm;
    if (remaining > 15) return `Moderate run, 10–14 km at easy to moderate effort. You have ${remaining.toFixed(0)} km left in your weekly goal.`;
    if (remaining > 5) return `Easy run, 6–10 km. ${remaining.toFixed(0)} km remaining toward your weekly target.`;
  }
  return 'You\'re on track — maintain current rhythm with your planned workout type.';
}

export function CoachCard({ load, weeklyGoalKm, weekActualKm, goalPhase }: CoachCardProps) {
  const recommendation = getRecommendedNext(load, weeklyGoalKm, weekActualKm);

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">Recommended Next Run</h3>
        <StatusBadge status={load.fatigueStatus === 'alert' ? 'alert' : load.fatigueStatus === 'caution' ? 'caution' : 'good'} />
      </div>
      <p className="text-sm text-slate-700 leading-relaxed">{recommendation}</p>
      {goalPhase && (
        <p className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-100">
          Phase: <span className="font-medium text-slate-600 capitalize">{goalPhase}</span>
        </p>
      )}
    </Card>
  );
}
