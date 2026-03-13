import { useMemo } from 'react';
import type { RunFormValues, DistanceUnit, Shoe } from '../../types';
import { ALL_RUN_TYPES, RUN_TYPE_LABELS, ALL_TERRAINS, TERRAIN_LABELS } from '../../constants';
import { parseDurationInput, calcPaceSecondsPerKm, formatPace, displayToKm } from '../../lib/pace';
import { todayISO } from '../../lib/dateUtils';
import { DurationInput } from './DurationInput';
import { RPESlider } from './RPESlider';
import { TagSelector } from './TagSelector';
import { BodySignalsSection } from './BodySignalsSection';
import type { RunTag, Terrain } from '../../types';

interface RunFormProps {
  values: RunFormValues;
  onChange: (patch: Partial<RunFormValues>) => void;
  unit: DistanceUnit;
  shoes?: Shoe[];
}

const input = 'w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';
const label = 'block text-sm font-medium text-slate-700 mb-1';

export const DEFAULT_FORM_VALUES: RunFormValues = {
  date: todayISO(),
  distanceInput: '',
  durationInput: '',
  heartRateAvg: '',
  elevationGainM: '',
  runType: 'easy',
  perceivedEffort: 5,
  tags: [],
  terrain: '',
  notes: '',
  sleepHours: '',
  energyLevel: '',
  sorenessLevel: '',
  painLevel: '',
  painLocation: '',
  weatherTempC: '',
  humidityPct: '',
  fueledBefore: '',
  fueledDuring: '',
  shoesUsedId: '',
};

export function RunForm({ values, onChange, unit, shoes = [] }: RunFormProps) {
  const livePace = useMemo(() => {
    const distKm = displayToKm(parseFloat(values.distanceInput), unit);
    const secs = parseDurationInput(values.durationInput);
    if (!isNaN(distKm) && distKm > 0 && !isNaN(secs) && secs > 0) {
      const pace = calcPaceSecondsPerKm(distKm, secs);
      return formatPace(pace, unit);
    }
    return null;
  }, [values.distanceInput, values.durationInput, unit]);

  return (
    <div className="space-y-5">
      {/* Date */}
      <div>
        <label className={label}>Date</label>
        <input
          type="date"
          className={input}
          value={values.date}
          onChange={(e) => onChange({ date: e.target.value })}
        />
      </div>

      {/* Distance + Duration */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label}>Distance ({unit})</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className={input}
            placeholder="0.00"
            value={values.distanceInput}
            onChange={(e) => onChange({ distanceInput: e.target.value })}
          />
        </div>
        <div>
          <label className={label}>Duration</label>
          <DurationInput value={values.durationInput} onChange={(v) => onChange({ durationInput: v })} />
        </div>
      </div>

      {/* Live pace */}
      {livePace && (
        <div className="rounded-xl bg-indigo-50 px-4 py-2 flex items-center justify-between">
          <span className="text-xs text-indigo-600 font-medium">Calculated pace</span>
          <span className="text-sm font-bold text-indigo-700">{livePace}</span>
        </div>
      )}

      {/* Run type + Terrain */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label}>Run type</label>
          <select
            className={input}
            value={values.runType}
            onChange={(e) => onChange({ runType: e.target.value as RunFormValues['runType'] })}
          >
            {ALL_RUN_TYPES.map((t) => (
              <option key={t} value={t}>{RUN_TYPE_LABELS[t]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Terrain</label>
          <select
            className={input}
            value={values.terrain}
            onChange={(e) => onChange({ terrain: e.target.value as Terrain | '' })}
          >
            <option value="">— optional —</option>
            {ALL_TERRAINS.map((t) => (
              <option key={t} value={t}>{TERRAIN_LABELS[t]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* HR + Elevation */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label}>Avg heart rate (bpm)</label>
          <input
            type="number"
            className={input}
            placeholder="Optional"
            value={values.heartRateAvg}
            onChange={(e) => onChange({ heartRateAvg: e.target.value })}
          />
        </div>
        <div>
          <label className={label}>Elevation gain (m)</label>
          <input
            type="number"
            className={input}
            placeholder="Optional"
            value={values.elevationGainM}
            onChange={(e) => onChange({ elevationGainM: e.target.value })}
          />
        </div>
      </div>

      {/* Shoes */}
      {shoes.filter((s) => s.isActive).length > 0 && (
        <div>
          <label className={label}>Shoes</label>
          <select
            className={input}
            value={values.shoesUsedId}
            onChange={(e) => onChange({ shoesUsedId: e.target.value })}
          >
            <option value="">— select shoe —</option>
            {shoes.filter((s) => s.isActive).map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({Math.round(s.totalKm)} km)
              </option>
            ))}
          </select>
        </div>
      )}

      {/* RPE */}
      <div>
        <label className={label}>Perceived effort (RPE)</label>
        <RPESlider value={values.perceivedEffort} onChange={(v) => onChange({ perceivedEffort: v })} />
      </div>

      {/* Tags */}
      <div>
        <label className={label}>Tags</label>
        <TagSelector selected={values.tags} onChange={(tags: RunTag[]) => onChange({ tags })} />
      </div>

      {/* Body signals */}
      <BodySignalsSection values={values} onChange={onChange} />

      {/* Notes */}
      <div>
        <label className={label}>Notes & reflections</label>
        <textarea
          className={`${input} min-h-32 resize-none`}
          placeholder="How did it feel? What hurt? Energy levels, weather, fueling thoughts, what you noticed..."
          value={values.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
        />
      </div>
    </div>
  );
}
