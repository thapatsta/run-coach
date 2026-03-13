import type { Run, AppSettings } from '../types';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from '../constants';

// ─── Runs ─────────────────────────────────────────────────────────────────────

export function getRuns(): Run[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RUNS);
    return raw ? (JSON.parse(raw) as Run[]) : [];
  } catch {
    return [];
  }
}

export function getRunById(id: string): Run | undefined {
  return getRuns().find((r) => r.id === id);
}

export function saveRun(run: Run): void {
  const runs = getRuns();
  const idx = runs.findIndex((r) => r.id === run.id);
  if (idx >= 0) {
    runs[idx] = run;
  } else {
    runs.push(run);
  }
  // Sort descending by date always
  runs.sort((a, b) => b.date.localeCompare(a.date));
  localStorage.setItem(STORAGE_KEYS.RUNS, JSON.stringify(runs));
}

export function deleteRun(id: string): void {
  const runs = getRuns().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.RUNS, JSON.stringify(runs));
}

export function getRecentRuns(n: number): Run[] {
  return getRuns().slice(0, n);
}

export function getRunsInRange(startDate: string, endDate: string): Run[] {
  return getRuns().filter((r) => r.date >= startDate && r.date <= endDate);
}

// ─── Settings ────────────────────────────────────────────────────────────────

export function getSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } as AppSettings;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.RUNS);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
}

export function exportRunsAsJSON(): string {
  return JSON.stringify(getRuns(), null, 2);
}
