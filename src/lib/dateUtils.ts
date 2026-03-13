import {
  startOfWeek,
  endOfWeek,
  subWeeks,
  format,
  parseISO,
  differenceInDays,
  eachDayOfInterval,
  isWithinInterval,
} from 'date-fns';
import type { Run, WeekSummary } from '../types';

export function getWeekStart(date: Date = new Date()): Date {
  return startOfWeek(date, { weekStartsOn: 1 }); // Monday
}

export function getWeekEnd(date: Date = new Date()): Date {
  return endOfWeek(date, { weekStartsOn: 1 });
}

export function formatDateDisplay(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d, yyyy');
}

export function formatDateShort(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d');
}

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function daysUntil(dateStr: string): number {
  return differenceInDays(parseISO(dateStr), new Date());
}

export function getWeekSummary(runs: Run[], weekStart: Date): WeekSummary {
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  const weekRuns = runs.filter((r) => {
    const d = parseISO(r.date);
    return isWithinInterval(d, { start: weekStart, end: weekEnd });
  });

  const totalDistanceKm = weekRuns.reduce((s, r) => s + r.distanceKm, 0);
  const totalRuns = weekRuns.length;
  const avgPace =
    totalRuns > 0
      ? weekRuns.reduce((s, r) => s + r.paceSecondsPerKm, 0) / totalRuns
      : 0;

  return {
    weekStart: format(weekStart, 'yyyy-MM-dd'),
    totalDistanceKm,
    totalRuns,
    avgPaceSecondsPerKm: avgPace,
  };
}

export function getLast4WeekSummaries(runs: Run[]): WeekSummary[] {
  const now = new Date();
  return [0, 1, 2, 3].map((i) => {
    const weekStart = getWeekStart(subWeeks(now, i));
    return getWeekSummary(runs, weekStart);
  });
}

/** Returns daily km totals for the current week (Mon–Sun), keyed by "Mon", "Tue", etc. */
export function getCurrentWeekDailyKm(runs: Run[]): { day: string; km: number }[] {
  const weekStart = getWeekStart();
  const weekEnd = getWeekEnd();
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return days.map((day) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const km = runs
      .filter((r) => r.date === dayStr)
      .reduce((s, r) => s + r.distanceKm, 0);
    return { day: format(day, 'EEE'), km };
  });
}

/** Consecutive run days ending today */
export function getConsecutiveRunDays(runs: Run[]): number {
  if (runs.length === 0) return 0;
  const runDates = new Set(runs.map((r) => r.date));
  let count = 0;
  let current = new Date();
  while (true) {
    const dateStr = format(current, 'yyyy-MM-dd');
    if (runDates.has(dateStr)) {
      count++;
      current = new Date(current.getTime() - 86400000);
    } else {
      break;
    }
  }
  return count;
}
