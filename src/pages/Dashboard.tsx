import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRuns } from '../hooks/useRuns';
import { useSettings } from '../hooks/useSettings';
import { CoachCard } from '../components/dashboard/CoachCard';
import { GoalProgressCard } from '../components/dashboard/GoalProgressCard';
import { WeeklyMileageChart } from '../components/dashboard/WeeklyMileageChart';
import { PaceTrendChart } from '../components/dashboard/PaceTrendChart';
import { LoadIndicator } from '../components/dashboard/LoadIndicator';
import { ThingsToWatch } from '../components/dashboard/ThingsToWatch';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { computeTrainingLoad, getPatternFlags } from '../lib/load';
import { getCurrentWeekDailyKm, formatDateShort } from '../lib/dateUtils';
import { formatPace, distanceKmToDisplay } from '../lib/pace';
import { RUN_TYPE_LABELS } from '../constants';

export function Dashboard() {
  const navigate = useNavigate();
  const { runs } = useRuns();
  const { settings } = useSettings();

  const load = useMemo(() => computeTrainingLoad(runs), [runs]);
  const flags = useMemo(() => getPatternFlags(runs, load), [runs, load]);
  const dailyKm = useMemo(() => getCurrentWeekDailyKm(runs), [runs]);
  const totalThisWeek = dailyKm.reduce((s, d) => s + d.km, 0);

  if (runs.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">RunCoach</h1>
        </div>
        <EmptyState
          title="Welcome to RunCoach"
          description="Log your first run to start getting coaching insights, training analysis, and personalized recommendations."
          action={{ label: 'Log a Run', onClick: () => navigate('/log') }}
          icon="🏃"
        />
        {!settings.openaiApiKey && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
            <p className="text-sm text-amber-700">
              <strong>Set up AI:</strong> Add your OpenAI API key in{' '}
              <button onClick={() => navigate('/settings')} className="underline font-medium">Settings</button>{' '}
              to enable coaching insights.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <Button size="sm" onClick={() => navigate('/log')}>+ Log Run</Button>
      </div>

      {/* Coach recommendation */}
      <CoachCard
        load={load}
        weeklyGoalKm={settings.runnerGoal?.weeklyMileageGoalKm}
        weekActualKm={totalThisWeek}
        goalPhase={settings.runnerGoal?.currentPhase}
      />

      {/* Goal progress */}
      <GoalProgressCard
        goal={settings.runnerGoal}
        weekActualKm={totalThisWeek}
        weeklyGoalKm={settings.runnerGoal?.weeklyMileageGoalKm}
      />

      {/* Things to watch */}
      <ThingsToWatch flags={flags} injuryWatchAreas={settings.injuryWatchAreas} />

      {/* Training load */}
      <LoadIndicator load={load} />

      {/* Charts */}
      <WeeklyMileageChart runs={runs} goalKm={settings.runnerGoal?.weeklyMileageGoalKm} />
      <PaceTrendChart runs={runs} unit={settings.preferredUnit} />

      {/* Recent runs quick view */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-700">Recent runs</h3>
          <button onClick={() => navigate('/runs')} className="text-xs text-indigo-600 hover:underline">View all</button>
        </div>
        <div className="space-y-2">
          {runs.slice(0, 3).map((run) => (
            <button
              key={run.id}
              onClick={() => navigate(`/runs/${run.id}`)}
              className="w-full text-left flex items-center justify-between rounded-xl bg-white border border-slate-100 px-4 py-3 hover:shadow-sm transition-all"
            >
              <div>
                <p className="text-xs text-slate-400">{formatDateShort(run.date)}</p>
                <p className="text-sm font-semibold text-slate-800">
                  {distanceKmToDisplay(run.distanceKm, settings.preferredUnit)} · {formatPace(run.paceSecondsPerKm, settings.preferredUnit)}
                </p>
              </div>
              <span className="text-xs text-slate-400">{RUN_TYPE_LABELS[run.runType]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
