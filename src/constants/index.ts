import type { RunType, RunTag, Terrain, TrainingPhase } from '../types';

export const RUN_TYPE_LABELS: Record<RunType, string> = {
  easy: 'Easy',
  tempo: 'Tempo',
  long: 'Long',
  race: 'Race',
  trail: 'Trail',
  treadmill: 'Treadmill',
  race_prep: 'Race Prep',
};

export const RUN_TYPE_COLORS: Record<RunType, string> = {
  easy: 'bg-green-100 text-green-700',
  tempo: 'bg-amber-100 text-amber-700',
  long: 'bg-blue-100 text-blue-700',
  race: 'bg-red-100 text-red-700',
  trail: 'bg-emerald-100 text-emerald-700',
  treadmill: 'bg-slate-100 text-slate-600',
  race_prep: 'bg-purple-100 text-purple-700',
};

export const TAG_LABELS: Record<RunTag, string> = {
  long_run: 'Long Run',
  easy_run: 'Easy Run',
  tempo: 'Tempo',
  race_prep: 'Race Prep',
  travel_run: 'Travel Run',
  treadmill: 'Treadmill',
  injury_note: 'Injury Note',
};

export const ALL_TAGS: RunTag[] = [
  'long_run',
  'easy_run',
  'tempo',
  'race_prep',
  'travel_run',
  'treadmill',
  'injury_note',
];

export const ALL_RUN_TYPES: RunType[] = [
  'easy',
  'tempo',
  'long',
  'race',
  'trail',
  'treadmill',
  'race_prep',
];

export const TERRAIN_LABELS: Record<Terrain, string> = {
  road: 'Road',
  trail: 'Trail',
  treadmill: 'Treadmill',
  mixed: 'Mixed',
  beach: 'Beach',
};

export const ALL_TERRAINS: Terrain[] = ['road', 'trail', 'treadmill', 'mixed', 'beach'];

export const RPE_LABELS: Record<number, string> = {
  1: 'Very Easy',
  2: 'Easy',
  3: 'Moderate',
  4: 'Somewhat Hard',
  5: 'Hard',
  6: 'Hard+',
  7: 'Very Hard',
  8: 'Very Hard+',
  9: 'Max Effort',
  10: 'All Out',
};

export const PHASE_LABELS: Record<TrainingPhase, string> = {
  base: 'Base',
  build: 'Build',
  peak: 'Peak',
  taper: 'Taper',
  recovery: 'Recovery',
};

export const DEFAULT_SETTINGS = {
  openaiApiKey: '',
  preferredUnit: 'km' as const,
  openaiModel: 'gpt-4o-mini',
  runnerContext: '',
  injuryWatchAreas: [] as string[],
  shoes: [] as import('../types').Shoe[],
};

export const STORAGE_KEYS = {
  RUNS: 'runcoach_runs',
  SETTINGS: 'runcoach_settings',
} as const;
