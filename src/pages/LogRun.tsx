import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRuns } from '../hooks/useRuns';
import { useSettings } from '../hooks/useSettings';
import { RunForm, DEFAULT_FORM_VALUES } from '../components/forms/RunForm';
import { Button } from '../components/ui/Button';
import type { Run, RunFormValues, Terrain } from '../types';
import {
  parseDurationInput,
  calcPaceSecondsPerKm,
  displayToKm,
} from '../lib/pace';
import { todayISO } from '../lib/dateUtils';

function formFromRun(run: Run, unit: string): RunFormValues {
  const distDisplay = unit === 'mi' ? run.distanceKm / 1.60934 : run.distanceKm;
  return {
    date: run.date,
    distanceInput: distDisplay.toFixed(2),
    durationInput: `${Math.floor(run.durationSeconds / 60)}:${(run.durationSeconds % 60).toString().padStart(2, '0')}`,
    heartRateAvg: run.heartRateAvg?.toString() ?? '',
    elevationGainM: run.elevationGainM?.toString() ?? '',
    runType: run.runType,
    perceivedEffort: run.perceivedEffort,
    tags: run.tags,
    terrain: run.terrain ?? '',
    notes: run.notes,
    sleepHours: run.sleepHours?.toString() ?? '',
    energyLevel: run.energyLevel?.toString() ?? '',
    sorenessLevel: run.sorenessLevel?.toString() ?? '',
    painLevel: run.painLevel?.toString() ?? '',
    painLocation: run.painLocation ?? '',
    weatherTempC: run.weatherTempC?.toString() ?? '',
    humidityPct: run.humidityPct?.toString() ?? '',
    fueledBefore: run.fueledBefore ?? '',
    fueledDuring: run.fueledDuring ?? '',
    shoesUsedId: run.shoesUsedId ?? '',
  };
}

export function LogRun() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { saveRun, getRunById } = useRuns();
  const { settings, accumulateShoeKm } = useSettings();

  const existingRun = id ? getRunById(id) : undefined;

  const [values, setValues] = useState<RunFormValues>(
    existingRun ? formFromRun(existingRun, settings.preferredUnit) : { ...DEFAULT_FORM_VALUES, date: todayISO() },
  );
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (patch: Partial<RunFormValues>) => {
    setValues((v) => ({ ...v, ...patch }));
  };

  const validate = (): string[] => {
    const errs: string[] = [];
    if (!values.distanceInput || parseFloat(values.distanceInput) <= 0) {
      errs.push('Distance is required');
    }
    if (!values.durationInput || isNaN(parseDurationInput(values.durationInput))) {
      errs.push('Duration is required (e.g. 45:30 or 1:05:00)');
    }
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    setErrors([]);

    const distKm = displayToKm(parseFloat(values.distanceInput), settings.preferredUnit);
    const durationSecs = parseDurationInput(values.durationInput);
    const pace = calcPaceSecondsPerKm(distKm, durationSecs);

    const now = new Date().toISOString();
    const run: Run = {
      id: existingRun?.id ?? crypto.randomUUID(),
      date: values.date,
      distanceKm: distKm,
      durationSeconds: durationSecs,
      paceSecondsPerKm: pace,
      heartRateAvg: values.heartRateAvg ? parseInt(values.heartRateAvg) : undefined,
      elevationGainM: values.elevationGainM ? parseFloat(values.elevationGainM) : undefined,
      runType: values.runType,
      perceivedEffort: values.perceivedEffort,
      tags: values.tags,
      terrain: (values.terrain as Terrain) || undefined,
      notes: values.notes,
      sleepHours: values.sleepHours ? parseFloat(values.sleepHours) : undefined,
      energyLevel: values.energyLevel ? parseFloat(values.energyLevel) : undefined,
      sorenessLevel: values.sorenessLevel ? parseFloat(values.sorenessLevel) : undefined,
      painLevel: values.painLevel ? parseFloat(values.painLevel) : undefined,
      painLocation: values.painLocation || undefined,
      weatherTempC: values.weatherTempC ? parseFloat(values.weatherTempC) : undefined,
      humidityPct: values.humidityPct ? parseFloat(values.humidityPct) : undefined,
      fueledBefore: values.fueledBefore || undefined,
      fueledDuring: values.fueledDuring || undefined,
      shoesUsedId: values.shoesUsedId || undefined,
      aiInsights: existingRun?.aiInsights,
      createdAt: existingRun?.createdAt ?? now,
      updatedAt: now,
    };

    saveRun(run);

    // Accumulate shoe km if shoe selected and it's a new run (or distance changed)
    if (values.shoesUsedId) {
      const addedKm = existingRun ? distKm - existingRun.distanceKm : distKm;
      if (addedKm > 0) {
        accumulateShoeKm(values.shoesUsedId, addedKm);
      }
    }

    navigate(`/runs/${run.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-slate-900">
          {existingRun ? 'Edit Run' : 'Log a Run'}
        </h1>
      </div>

      {errors.length > 0 && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
          {errors.map((e) => (
            <p key={e} className="text-sm text-red-700">{e}</p>
          ))}
        </div>
      )}

      <RunForm
        values={values}
        onChange={handleChange}
        unit={settings.preferredUnit}
        shoes={settings.shoes}
      />

      <Button onClick={handleSubmit} size="lg" className="w-full">
        {existingRun ? 'Update Run' : 'Save Run'}
      </Button>
    </div>
  );
}
