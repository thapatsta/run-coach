import { subDays, subWeeks, parseISO, isAfter, format } from 'date-fns';
import type { Run, TrainingLoad } from '../types';

function runsAfter(runs: Run[], date: Date): Run[] {
  return runs.filter((r) => isAfter(parseISO(r.date), date));
}

function avgWeeklyKm(runs: Run[], weeks: number): number {
  const since = subWeeks(new Date(), weeks);
  const inRange = runsAfter(runs, since);
  if (weeks === 0) return 0;
  const total = inRange.reduce((s, r) => s + r.distanceKm, 0);
  return total / weeks;
}

function consecutiveRunDays(runs: Run[]): number {
  if (runs.length === 0) return 0;
  const dates = new Set(runs.map((r) => r.date));
  let count = 0;
  let current = new Date();
  while (true) {
    const d = format(current, 'yyyy-MM-dd');
    if (dates.has(d)) {
      count++;
      current = new Date(current.getTime() - 86400000);
    } else {
      break;
    }
  }
  return count;
}

function detectPaceDrift(runs: Run[]): string | undefined {
  // Compare last 5 easy runs: if pace slowed while RPE stayed same or rose
  const easyRuns = runs
    .filter((r) => r.runType === 'easy')
    .slice(0, 5);
  if (easyRuns.length < 3) return undefined;

  const oldest = easyRuns[easyRuns.length - 1];
  const newest = easyRuns[0];
  const paceDiffSec = newest.paceSecondsPerKm - oldest.paceSecondsPerKm;
  const rpeDiff = newest.perceivedEffort - oldest.perceivedEffort;

  if (paceDiffSec > 15 && rpeDiff >= 0) {
    return `Easy pace slowed ~${Math.round(paceDiffSec)}s/km at same or higher effort over last ${easyRuns.length} easy runs`;
  }
  if (paceDiffSec < -10 && rpeDiff <= 0) {
    return `Easy pace improving — ${Math.abs(Math.round(paceDiffSec))}s/km faster at same or lower effort`;
  }
  return undefined;
}

export function computeTrainingLoad(runs: Run[]): TrainingLoad {
  const last7Days = subDays(new Date(), 7);
  const recentRuns = runsAfter(runs, last7Days);

  const acuteLoadKm = recentRuns.reduce((s, r) => s + r.distanceKm, 0);
  const chronicLoadKm = avgWeeklyKm(runs, 4);
  const loadRatio = chronicLoadKm > 0 ? acuteLoadKm / chronicLoadKm : 1;

  const highRPERunsLast7Days = recentRuns.filter((r) => r.perceivedEffort >= 7).length;
  const recentPainMentions = recentRuns.filter(
    (r) => (r.painLevel ?? 0) > 0 || r.tags.includes('injury_note'),
  ).length;
  const streak = consecutiveRunDays(runs);

  let fatigueStatus: TrainingLoad['fatigueStatus'] = 'good';
  if (loadRatio > 1.5 || (streak >= 4 && highRPERunsLast7Days >= 3) || recentPainMentions >= 2) {
    fatigueStatus = 'alert';
  } else if (loadRatio > 1.25 || (streak >= 3 && highRPERunsLast7Days >= 2) || recentPainMentions >= 1) {
    fatigueStatus = 'caution';
  }

  return {
    acuteLoadKm,
    chronicLoadKm,
    loadRatio,
    consecutiveRunDays: streak,
    highRPERunsLast7Days,
    recentPainMentions,
    paceDriftNote: detectPaceDrift(runs),
    fatigueStatus,
  };
}

/** Returns human-readable pattern flags for ThingsToWatch component */
export function getPatternFlags(runs: Run[], load: TrainingLoad): string[] {
  const flags: string[] = [];

  if (load.loadRatio > 1.5) {
    flags.push(`High training load — ${load.loadRatio.toFixed(1)}x your weekly average`);
  } else if (load.loadRatio > 1.25) {
    flags.push(`Mileage spike — ${load.loadRatio.toFixed(1)}x your normal weekly volume`);
  }

  if (load.consecutiveRunDays >= 4) {
    flags.push(`${load.consecutiveRunDays} consecutive run days — consider a rest day`);
  }

  if (load.recentPainMentions >= 2) {
    flags.push(`Pain noted in ${load.recentPainMentions} recent runs — monitor carefully`);
  }

  if (load.paceDriftNote) {
    flags.push(load.paceDriftNote);
  }

  // HR drift detection
  const easyRunsWithHR = runs
    .filter((r) => r.runType === 'easy' && r.heartRateAvg)
    .slice(0, 4);
  if (easyRunsWithHR.length >= 3) {
    const oldest = easyRunsWithHR[easyRunsWithHR.length - 1].heartRateAvg!;
    const newest = easyRunsWithHR[0].heartRateAvg!;
    if (newest - oldest > 8) {
      flags.push(`HR climbing at easy pace — ${Math.round(newest - oldest)} bpm higher than ${easyRunsWithHR.length} runs ago`);
    }
  }

  return flags;
}
