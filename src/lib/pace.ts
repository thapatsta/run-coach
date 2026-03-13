import type { DistanceUnit } from '../types';

const KM_PER_MILE = 1.60934;

export function calcPaceSecondsPerKm(distanceKm: number, durationSeconds: number): number {
  if (distanceKm <= 0) return 0;
  return durationSeconds / distanceKm;
}

export function formatPace(secondsPerKm: number, unit: DistanceUnit): string {
  if (!secondsPerKm || secondsPerKm <= 0) return '--:--';
  const secondsPerUnit = unit === 'mi' ? secondsPerKm * KM_PER_MILE : secondsPerKm;
  const mins = Math.floor(secondsPerUnit / 60);
  const secs = Math.round(secondsPerUnit % 60);
  const label = unit === 'mi' ? '/mi' : '/km';
  return `${mins}:${secs.toString().padStart(2, '0')} ${label}`;
}

export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0m';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  if (h > 0) return `${h}h ${m}m ${s > 0 ? s + 's' : ''}`.trim();
  if (m > 0) return `${m}m ${s > 0 ? s + 's' : ''}`.trim();
  return `${s}s`;
}

export function formatDurationHHMMSS(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Accepts: "1:23:45", "45:30", "4530" (raw seconds), "45.5" (decimal minutes)
 * Returns seconds as integer, or NaN on invalid input.
 */
export function parseDurationInput(input: string): number {
  const trimmed = input.trim();
  if (!trimmed) return NaN;

  // HH:MM:SS or MM:SS
  if (trimmed.includes(':')) {
    const parts = trimmed.split(':').map(Number);
    if (parts.some(isNaN)) return NaN;
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return NaN;
  }

  // Raw number — treat as seconds if >= 60, else minutes
  const num = parseFloat(trimmed);
  if (isNaN(num)) return NaN;
  return Math.round(num);
}

export function distanceKmToDisplay(km: number, unit: DistanceUnit): string {
  const val = unit === 'mi' ? km / KM_PER_MILE : km;
  return `${val.toFixed(2)} ${unit}`;
}

export function displayToKm(value: number, unit: DistanceUnit): number {
  return unit === 'mi' ? value * KM_PER_MILE : value;
}

export function kmToDisplay(km: number, unit: DistanceUnit): number {
  return unit === 'mi' ? km / KM_PER_MILE : km;
}
