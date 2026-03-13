import { useState } from 'react';
import { parseDurationInput, formatDurationHHMMSS } from '../../lib/pace';

interface DurationInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function DurationInput({ value, onChange, className = '' }: DurationInputProps) {
  const [focused, setFocused] = useState(false);

  const handleBlur = () => {
    setFocused(false);
    if (!value.trim()) return;
    const secs = parseDurationInput(value);
    if (!isNaN(secs) && secs > 0) {
      onChange(formatDurationHHMMSS(secs));
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        className={`w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
        placeholder="e.g. 45:30 or 1:05:00"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
      />
      {focused && (
        <p className="absolute top-full left-0 mt-1 text-xs text-slate-400">
          Enter MM:SS, HH:MM:SS, or seconds
        </p>
      )}
    </div>
  );
}
