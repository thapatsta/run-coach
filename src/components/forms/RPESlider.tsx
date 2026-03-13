import { RPE_LABELS } from '../../constants';

interface RPESliderProps {
  value: number;
  onChange: (value: number) => void;
}

const rpeColors = [
  '', // 0 unused
  'bg-green-400',    // 1
  'bg-green-400',    // 2
  'bg-lime-400',     // 3
  'bg-yellow-400',   // 4
  'bg-amber-400',    // 5
  'bg-orange-400',   // 6
  'bg-orange-500',   // 7
  'bg-red-400',      // 8
  'bg-red-500',      // 9
  'bg-red-600',      // 10
];

export function RPESlider({ value, onChange }: RPESliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-600">RPE {value}/10</span>
        <span className="text-sm font-medium text-slate-700">{RPE_LABELS[value]}</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: '#4f46e5' }}
      />
      <div className="flex justify-between text-xs text-slate-400">
        <span>Easy</span>
        <span>Max</span>
      </div>
      {/* Visual dot row */}
      <div className="flex gap-1">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`flex-1 h-2 rounded-full transition-all ${
              n <= value ? rpeColors[value] : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
