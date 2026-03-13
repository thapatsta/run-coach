import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRuns } from '../hooks/useRuns';
import { useSettings } from '../hooks/useSettings';
import { RunCard } from '../components/runs/RunCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import type { RunType, RunTag } from '../types';
import { RUN_TYPE_LABELS, TAG_LABELS, ALL_TAGS, ALL_RUN_TYPES } from '../constants';

export function History() {
  const navigate = useNavigate();
  const { runs } = useRuns();
  const { settings } = useSettings();
  const [typeFilter, setTypeFilter] = useState<RunType | ''>('');
  const [tagFilter, setTagFilter] = useState<RunTag | ''>('');

  const filtered = useMemo(() => {
    return runs.filter((r) => {
      if (typeFilter && r.runType !== typeFilter) return false;
      if (tagFilter && !r.tags.includes(tagFilter)) return false;
      return true;
    });
  }, [runs, typeFilter, tagFilter]);

  const select = 'rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">History</h1>
        <Button size="sm" onClick={() => navigate('/log')}>+ Log Run</Button>
      </div>

      {runs.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <select className={select} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as RunType | '')}>
            <option value="">All types</option>
            {ALL_RUN_TYPES.map((t) => <option key={t} value={t}>{RUN_TYPE_LABELS[t]}</option>)}
          </select>
          <select className={select} value={tagFilter} onChange={(e) => setTagFilter(e.target.value as RunTag | '')}>
            <option value="">All tags</option>
            {ALL_TAGS.map((t) => <option key={t} value={t}>{TAG_LABELS[t]}</option>)}
          </select>
          {(typeFilter || tagFilter) && (
            <button
              className="text-sm text-slate-500 hover:text-slate-700"
              onClick={() => { setTypeFilter(''); setTagFilter(''); }}
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title={runs.length === 0 ? "No runs logged yet" : "No runs match your filters"}
          description={runs.length === 0 ? "Log your first run to get started with coaching insights." : undefined}
          action={runs.length === 0 ? { label: 'Log a Run', onClick: () => navigate('/log') } : undefined}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((run) => (
            <RunCard key={run.id} run={run} unit={settings.preferredUnit} />
          ))}
        </div>
      )}
    </div>
  );
}
