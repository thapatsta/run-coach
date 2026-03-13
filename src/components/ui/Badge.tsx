import type { RunType, RunTag } from '../../types';
import { RUN_TYPE_COLORS, RUN_TYPE_LABELS, TAG_LABELS } from '../../constants';

interface RunTypeBadgeProps {
  type: RunType;
}

export function RunTypeBadge({ type }: RunTypeBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${RUN_TYPE_COLORS[type]}`}>
      {RUN_TYPE_LABELS[type]}
    </span>
  );
}

interface TagBadgeProps {
  tag: RunTag;
}

export function TagBadge({ tag }: TagBadgeProps) {
  const isInjury = tag === 'injury_note';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isInjury ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
      }`}
    >
      {TAG_LABELS[tag]}
    </span>
  );
}

interface StatusBadgeProps {
  status: 'good' | 'caution' | 'alert' | 'rest';
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const styles = {
    good: 'bg-green-100 text-green-700',
    caution: 'bg-amber-100 text-amber-700',
    alert: 'bg-red-100 text-red-700',
    rest: 'bg-slate-100 text-slate-600',
  };
  const defaultLabels = { good: 'Good', caution: 'Caution', alert: 'Alert', rest: 'Rest' };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}>
      {label ?? defaultLabels[status]}
    </span>
  );
}
