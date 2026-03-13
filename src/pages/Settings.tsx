import { useState } from 'react';
import { useSettings } from '../hooks/useSettings';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { clearAllData, exportRunsAsJSON } from '../lib/storage';
import { PHASE_LABELS } from '../constants';
import type { TrainingPhase, Shoe } from '../types';

export function Settings() {
  const { settings, saveSettings, addShoe, updateShoe } = useSettings();
  const [saved, setSaved] = useState(false);
  const [newShoeName, setNewShoeName] = useState('');
  const [newShoeKm, setNewShoeKm] = useState('');
  const [newInjuryArea, setNewInjuryArea] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const [form, setForm] = useState({
    openaiApiKey: settings.openaiApiKey,
    preferredUnit: settings.preferredUnit,
    openaiModel: settings.openaiModel,
    runnerContext: settings.runnerContext ?? '',
    currentGoal: settings.runnerGoal?.currentGoal ?? '',
    raceDate: settings.runnerGoal?.raceDate ?? '',
    raceDistanceKm: settings.runnerGoal?.raceDistanceKm?.toString() ?? '',
    targetFinishTime: settings.runnerGoal?.targetFinishTime ?? '',
    weeklyMileageGoalKm: settings.runnerGoal?.weeklyMileageGoalKm?.toString() ?? '',
    currentPhase: settings.runnerGoal?.currentPhase ?? '',
    longRunDay: settings.runnerGoal?.longRunDay ?? '',
    targetRunsPerWeek: settings.runnerGoal?.targetRunsPerWeek?.toString() ?? '',
  });

  const handleSave = () => {
    saveSettings({
      ...settings,
      openaiApiKey: form.openaiApiKey,
      preferredUnit: form.preferredUnit as 'km' | 'mi',
      openaiModel: form.openaiModel,
      runnerContext: form.runnerContext,
      runnerGoal: {
        currentGoal: form.currentGoal || undefined,
        raceDate: form.raceDate || undefined,
        raceDistanceKm: form.raceDistanceKm ? parseFloat(form.raceDistanceKm) : undefined,
        targetFinishTime: form.targetFinishTime || undefined,
        weeklyMileageGoalKm: form.weeklyMileageGoalKm ? parseFloat(form.weeklyMileageGoalKm) : undefined,
        currentPhase: (form.currentPhase as TrainingPhase) || undefined,
        longRunDay: form.longRunDay || undefined,
        targetRunsPerWeek: form.targetRunsPerWeek ? parseInt(form.targetRunsPerWeek) : undefined,
      },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddShoe = () => {
    if (!newShoeName.trim()) return;
    const shoe: Shoe = {
      id: crypto.randomUUID(),
      name: newShoeName.trim(),
      totalKm: parseFloat(newShoeKm) || 0,
      isActive: true,
    };
    addShoe(shoe);
    setNewShoeName('');
    setNewShoeKm('');
  };

  const handleAddInjuryArea = () => {
    if (!newInjuryArea.trim()) return;
    const areas = [...(settings.injuryWatchAreas ?? []), newInjuryArea.trim()];
    saveSettings({ ...settings, injuryWatchAreas: areas });
    setNewInjuryArea('');
  };

  const handleRemoveInjuryArea = (area: string) => {
    const areas = (settings.injuryWatchAreas ?? []).filter((a) => a !== area);
    saveSettings({ ...settings, injuryWatchAreas: areas });
  };

  const handleExport = () => {
    const json = exportRunsAsJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `runcoach-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const input = 'w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';
  const label = 'block text-sm font-medium text-slate-700 mb-1';
  const section = 'space-y-4';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>

      {/* AI Setup */}
      <Card>
        <h2 className="text-base font-semibold text-slate-800 mb-4">AI Setup</h2>
        <div className={section}>
          <div>
            <label className={label}>OpenAI API Key</label>
            <input
              type="password"
              className={input}
              placeholder="sk-..."
              value={form.openaiApiKey}
              onChange={(e) => setForm((f) => ({ ...f, openaiApiKey: e.target.value }))}
            />
            <p className="text-xs text-slate-400 mt-1">Stored locally in your browser. Never sent anywhere except OpenAI.</p>
          </div>
          <div>
            <label className={label}>Model</label>
            <select
              className={input}
              value={form.openaiModel}
              onChange={(e) => setForm((f) => ({ ...f, openaiModel: e.target.value }))}
            >
              <option value="gpt-4o-mini">gpt-4o-mini (fast, cheap — recommended)</option>
              <option value="gpt-4o">gpt-4o (more capable)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card>
        <h2 className="text-base font-semibold text-slate-800 mb-4">Preferences</h2>
        <div>
          <label className={label}>Distance unit</label>
          <div className="flex gap-3">
            {(['km', 'mi'] as const).map((u) => (
              <button
                key={u}
                onClick={() => setForm((f) => ({ ...f, preferredUnit: u }))}
                className={`flex-1 rounded-xl border py-2 text-sm font-medium transition-colors ${
                  form.preferredUnit === u
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Runner Profile */}
      <Card>
        <h2 className="text-base font-semibold text-slate-800 mb-4">Runner Profile</h2>
        <div className={section}>
          <div>
            <label className={label}>Current goal</label>
            <input className={input} placeholder="e.g. Sub-1:45 half marathon, May 2026" value={form.currentGoal} onChange={(e) => setForm((f) => ({ ...f, currentGoal: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Race date</label>
              <input type="date" className={input} value={form.raceDate} onChange={(e) => setForm((f) => ({ ...f, raceDate: e.target.value }))} />
            </div>
            <div>
              <label className={label}>Race distance (km)</label>
              <input type="number" className={input} placeholder="21.1" value={form.raceDistanceKm} onChange={(e) => setForm((f) => ({ ...f, raceDistanceKm: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Target finish time</label>
              <input className={input} placeholder="1:45:00" value={form.targetFinishTime} onChange={(e) => setForm((f) => ({ ...f, targetFinishTime: e.target.value }))} />
            </div>
            <div>
              <label className={label}>Weekly mileage goal (km)</label>
              <input type="number" className={input} placeholder="55" value={form.weeklyMileageGoalKm} onChange={(e) => setForm((f) => ({ ...f, weeklyMileageGoalKm: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Training phase</label>
              <select className={input} value={form.currentPhase} onChange={(e) => setForm((f) => ({ ...f, currentPhase: e.target.value }))}>
                <option value="">— select —</option>
                {(Object.entries(PHASE_LABELS) as [TrainingPhase, string][]).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Long run day</label>
              <select className={input} value={form.longRunDay} onChange={(e) => setForm((f) => ({ ...f, longRunDay: e.target.value }))}>
                <option value="">— select —</option>
                {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={label}>Target runs per week</label>
            <input type="number" className={input} placeholder="5" value={form.targetRunsPerWeek} onChange={(e) => setForm((f) => ({ ...f, targetRunsPerWeek: e.target.value }))} />
          </div>
          <div>
            <label className={label}>Runner bio (for AI context)</label>
            <textarea className={`${input} min-h-20 resize-none`} placeholder="e.g. 38yo male, training around travel schedule, history of plantar fasciitis in left foot" value={form.runnerContext} onChange={(e) => setForm((f) => ({ ...f, runnerContext: e.target.value }))} />
          </div>
        </div>
      </Card>

      {/* Injury Watch */}
      <Card>
        <h2 className="text-base font-semibold text-slate-800 mb-4">Injury Watch Areas</h2>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input className={`${input} flex-1`} placeholder="e.g. left foot, right shin" value={newInjuryArea} onChange={(e) => setNewInjuryArea(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddInjuryArea()} />
            <Button variant="secondary" onClick={handleAddInjuryArea}>Add</Button>
          </div>
          {(settings.injuryWatchAreas ?? []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {(settings.injuryWatchAreas ?? []).map((area) => (
                <span key={area} className="inline-flex items-center gap-1 rounded-full bg-red-50 text-red-700 px-3 py-1 text-sm">
                  {area}
                  <button onClick={() => handleRemoveInjuryArea(area)} className="ml-1 text-red-400 hover:text-red-600">×</button>
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Shoes */}
      <Card>
        <h2 className="text-base font-semibold text-slate-800 mb-4">Shoes</h2>
        <div className="space-y-3">
          {(settings.shoes ?? []).map((shoe) => (
            <div key={shoe.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
              <div>
                <p className="text-sm font-medium text-slate-800">{shoe.name}</p>
                <p className="text-xs text-slate-500">{Math.round(shoe.totalKm)} km logged</p>
              </div>
              <button
                className="text-xs text-slate-400 hover:text-slate-600"
                onClick={() => updateShoe({ ...shoe, isActive: !shoe.isActive })}
              >
                {shoe.isActive ? 'Active' : 'Retired'}
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <input className={`${input} flex-1`} placeholder="Shoe name (e.g. Vaporfly 3)" value={newShoeName} onChange={(e) => setNewShoeName(e.target.value)} />
            <input type="number" className={`${input} w-24`} placeholder="km" value={newShoeKm} onChange={(e) => setNewShoeKm(e.target.value)} />
            <Button variant="secondary" onClick={handleAddShoe}>Add</Button>
          </div>
        </div>
      </Card>

      <Button onClick={handleSave} size="lg" className="w-full">
        {saved ? '✓ Saved' : 'Save Settings'}
      </Button>

      {/* Data Management */}
      <Card>
        <h2 className="text-base font-semibold text-slate-800 mb-4">Data</h2>
        <div className="space-y-3">
          <Button variant="secondary" className="w-full" onClick={handleExport}>
            Export all runs (JSON)
          </Button>
          {!showClearConfirm ? (
            <Button variant="ghost" className="w-full text-red-500 hover:bg-red-50" onClick={() => setShowClearConfirm(true)}>
              Clear all data
            </Button>
          ) : (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm">
              <p className="text-red-700 mb-3 font-medium">This will permanently delete all runs and settings. Are you sure?</p>
              <div className="flex gap-2">
                <Button variant="danger" onClick={() => { clearAllData(); window.location.reload(); }}>Yes, delete everything</Button>
                <Button variant="secondary" onClick={() => setShowClearConfirm(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
