import { useNavigate, useParams } from 'react-router-dom';
import { useRuns } from '../hooks/useRuns';
import { useSettings } from '../hooks/useSettings';
import { useAIInsights } from '../hooks/useAIInsights';
import { RunStats } from '../components/runs/RunStats';
import { AIOutputPanel } from '../components/runs/AIOutputPanel';
import { RunTypeBadge, TagBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { formatDateDisplay } from '../lib/dateUtils';
import { TERRAIN_LABELS } from '../constants';
import type { Terrain } from '../types';

export function RunDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { runs, getRunById, saveRun } = useRuns();
  const { settings } = useSettings();
  const { generate, isLoading, error } = useAIInsights();

  const run = id ? getRunById(id) : undefined;

  if (!run) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">Run not found.</p>
        <Button variant="ghost" onClick={() => navigate('/runs')} className="mt-4">Back to History</Button>
      </div>
    );
  }

  const recentRuns = runs.filter((r) => r.id !== run.id).slice(0, 7);

  const handleGenerateInsights = async () => {
    const insights = await generate(run, recentRuns, settings);
    if (insights) {
      saveRun({ ...run, aiInsights: insights, updatedAt: new Date().toISOString() });
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/runs')}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <div className="flex-1">
          <p className="text-xs text-slate-400">{formatDateDisplay(run.date)}</p>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <RunTypeBadge type={run.runType} />
          </h1>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate(`/log/${run.id}`)}>Edit</Button>
      </div>

      {/* Stats */}
      <RunStats run={run} unit={settings.preferredUnit} />

      {/* Tags + terrain */}
      {(run.tags.length > 0 || run.terrain) && (
        <div className="flex flex-wrap gap-1">
          {run.terrain && (
            <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-600 px-2.5 py-0.5 text-xs font-medium">
              {TERRAIN_LABELS[run.terrain as Terrain]}
            </span>
          )}
          {run.tags.map((tag) => <TagBadge key={tag} tag={tag} />)}
        </div>
      )}

      {/* Pain alert */}
      {(run.painLevel ?? 0) > 0 && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm text-red-700 font-medium">
            ⚠️ Pain noted: {run.painLevel}/10{run.painLocation ? ` — ${run.painLocation}` : ''}
          </p>
        </div>
      )}

      {/* Notes */}
      {run.notes && (
        <Card>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Notes</p>
          <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{run.notes}</p>
        </Card>
      )}

      {/* Body signals summary */}
      {(run.fueledBefore || run.fueledDuring || run.weatherTempC != null) && (
        <Card padding="sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Context</p>
          <div className="space-y-1 text-sm text-slate-600">
            {run.weatherTempC != null && <p>🌡 {run.weatherTempC}°C{run.humidityPct != null ? `, ${run.humidityPct}% humidity` : ''}</p>}
            {run.fueledBefore && <p>⚡ Before: {run.fueledBefore}</p>}
            {run.fueledDuring && <p>🏃 During: {run.fueledDuring}</p>}
          </div>
        </Card>
      )}

      {/* AI Insights */}
      <div>
        <h2 className="text-base font-semibold text-slate-800 mb-3">AI Coaching Report</h2>
        <AIOutputPanel
          insights={run.aiInsights}
          onGenerate={handleGenerateInsights}
          isLoading={isLoading}
          error={error}
          hasApiKey={!!settings.openaiApiKey}
        />
      </div>
    </div>
  );
}
