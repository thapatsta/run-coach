export type RunType = 'easy' | 'tempo' | 'long' | 'race' | 'trail' | 'treadmill' | 'race_prep';
export type RunTag = 'long_run' | 'easy_run' | 'tempo' | 'race_prep' | 'travel_run' | 'treadmill' | 'injury_note';
export type DistanceUnit = 'km' | 'mi';
export type Terrain = 'road' | 'trail' | 'treadmill' | 'mixed' | 'beach';
export type TrainingPhase = 'base' | 'build' | 'peak' | 'taper' | 'recovery';

export interface Shoe {
  id: string;
  name: string;
  totalKm: number;
  isActive: boolean;
}

export interface Run {
  id: string;
  date: string; // "2026-03-13"
  distanceKm: number;
  durationSeconds: number;
  paceSecondsPerKm: number;
  heartRateAvg?: number;
  elevationGainM?: number;
  runType: RunType;
  perceivedEffort: number; // 1-10 RPE
  tags: RunTag[];
  terrain?: Terrain;
  notes: string;

  // Body signals
  sleepHours?: number;
  energyLevel?: number; // 1-10
  sorenessLevel?: number; // 1-10 pre-run
  painLevel?: number; // 0-10
  painLocation?: string;

  // Environment / fueling
  weatherTempC?: number;
  humidityPct?: number;
  fueledBefore?: string;
  fueledDuring?: string;

  // Shoe
  shoesUsedId?: string;

  aiInsights?: AIInsights;
  createdAt: string;
  updatedAt: string;
}

export interface AIInsights {
  summary: string;
  trainingInsight: string;
  recoveryRecommendation: string;
  nextRunSuggestion: string;
  stravaCaption: string;
  cinematicStory: string;

  readinessScore: number; // 1-10
  shouldRunTomorrow: 'yes' | 'maybe' | 'no';
  tomorrowRecommendation: string;
  targetPaceSuggestion?: string;
  confidenceNotes?: string;

  lessonsLearned?: string;
  watchNextTime?: string;
  mentalNote?: string;

  generatedAt: string;
  modelUsed: string;
}

export interface RunnerGoal {
  currentGoal?: string;
  raceDate?: string;
  raceDistanceKm?: number;
  targetFinishTime?: string;
  weeklyMileageGoalKm?: number;
  currentPhase?: TrainingPhase;
  longRunDay?: string;
  targetRunsPerWeek?: number;
}

export interface AppSettings {
  openaiApiKey: string;
  preferredUnit: DistanceUnit;
  openaiModel: string;
  runnerContext?: string;
  runnerGoal?: RunnerGoal;
  injuryWatchAreas?: string[];
  shoes?: Shoe[];
}

// Computed — never stored
export interface TrainingLoad {
  acuteLoadKm: number;
  chronicLoadKm: number;
  loadRatio: number;
  consecutiveRunDays: number;
  highRPERunsLast7Days: number;
  recentPainMentions: number;
  paceDriftNote?: string;
  fatigueStatus: 'good' | 'caution' | 'alert';
}

export interface WeekSummary {
  weekStart: string;
  totalDistanceKm: number;
  totalRuns: number;
  avgPaceSecondsPerKm: number;
}

export interface RunFormValues {
  date: string;
  distanceInput: string;
  durationInput: string;
  heartRateAvg: string;
  elevationGainM: string;
  runType: RunType;
  perceivedEffort: number;
  tags: RunTag[];
  terrain: Terrain | '';
  notes: string;
  sleepHours: string;
  energyLevel: string;
  sorenessLevel: string;
  painLevel: string;
  painLocation: string;
  weatherTempC: string;
  humidityPct: string;
  fueledBefore: string;
  fueledDuring: string;
  shoesUsedId: string;
}
