import OpenAI from 'openai';
import type { Run, AIInsights, AppSettings } from '../types';
import { formatPace, formatDuration, distanceKmToDisplay } from './pace';
import { computeTrainingLoad } from './load';
import { formatDateDisplay, daysUntil } from './dateUtils';
import { RUN_TYPE_LABELS } from '../constants';

export function createOpenAIClient(apiKey: string): OpenAI {
  return new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
}

function buildRunContext(run: Run, recentRuns: Run[], settings: AppSettings): string {
  const unit = settings.preferredUnit;
  const goal = settings.runnerGoal;

  const shoeName = run.shoesUsedId
    ? settings.shoes?.find((s) => s.id === run.shoesUsedId)?.name
    : undefined;
  const shoeKm = run.shoesUsedId
    ? settings.shoes?.find((s) => s.id === run.shoesUsedId)?.totalKm
    : undefined;

  const load = computeTrainingLoad([run, ...recentRuns]);

  const lines: string[] = [];

  lines.push('=== CURRENT RUN ===');
  lines.push(`Date: ${formatDateDisplay(run.date)}`);
  lines.push(
    `Distance: ${distanceKmToDisplay(run.distanceKm, unit)} | Duration: ${formatDuration(run.durationSeconds)} | Pace: ${formatPace(run.paceSecondsPerKm, unit)}`,
  );
  if (run.heartRateAvg) lines.push(`HR: ${run.heartRateAvg} bpm (avg)`);
  if (run.elevationGainM) lines.push(`Elevation: ${run.elevationGainM}m gain`);
  lines.push(`Type: ${RUN_TYPE_LABELS[run.runType]} | RPE: ${run.perceivedEffort}/10`);
  if (run.terrain) lines.push(`Terrain: ${run.terrain}`);
  if (run.tags.length > 0) lines.push(`Tags: ${run.tags.join(', ')}`);

  // Body signals
  const bodyLines: string[] = [];
  if (run.sleepHours != null) bodyLines.push(`Sleep: ${run.sleepHours}h`);
  if (run.energyLevel != null) bodyLines.push(`Energy (pre-run): ${run.energyLevel}/10`);
  if (run.sorenessLevel != null) bodyLines.push(`Soreness (pre-run): ${run.sorenessLevel}/10`);
  if (run.painLevel != null && run.painLevel > 0) {
    bodyLines.push(`Pain: ${run.painLevel}/10${run.painLocation ? ` (${run.painLocation})` : ''}`);
  }
  if (bodyLines.length > 0) lines.push(bodyLines.join(' | '));

  // Environment
  const envLines: string[] = [];
  if (run.weatherTempC != null) envLines.push(`Temp: ${run.weatherTempC}°C`);
  if (run.humidityPct != null) envLines.push(`Humidity: ${run.humidityPct}%`);
  if (envLines.length > 0) lines.push(envLines.join(' | '));

  // Fueling
  if (run.fueledBefore) lines.push(`Fueling before: ${run.fueledBefore}`);
  if (run.fueledDuring) lines.push(`Fueling during: ${run.fueledDuring}`);

  // Shoes
  if (shoeName) lines.push(`Shoes: ${shoeName}${shoeKm ? ` (${Math.round(shoeKm)}km on them)` : ''}`);

  if (run.notes) lines.push(`Notes: "${run.notes}"`);

  // Training load
  lines.push('');
  lines.push('=== TRAINING LOAD ===');
  lines.push(
    `Acute (last 7d): ${load.acuteLoadKm.toFixed(1)} km | Chronic (4wk avg): ${load.chronicLoadKm.toFixed(1)} km/wk | Load ratio: ${load.loadRatio.toFixed(2)}`,
  );
  lines.push(
    `Consecutive run days: ${load.consecutiveRunDays} | High-RPE runs this week: ${load.highRPERunsLast7Days} | Recent pain mentions: ${load.recentPainMentions}`,
  );
  if (load.paceDriftNote) lines.push(`Pace drift: ${load.paceDriftNote}`);

  // Recent runs
  if (recentRuns.length > 0) {
    lines.push('');
    lines.push('=== RECENT RUNS (last 7, newest first) ===');
    recentRuns.slice(0, 7).forEach((r, i) => {
      const parts = [
        `${i + 1}. ${formatDateDisplay(r.date)}`,
        `${distanceKmToDisplay(r.distanceKm, unit)}`,
        RUN_TYPE_LABELS[r.runType],
        formatPace(r.paceSecondsPerKm, unit),
        `RPE ${r.perceivedEffort}/10`,
      ];
      if (r.heartRateAvg) parts.push(`HR ${r.heartRateAvg}`);
      if (r.sleepHours != null) parts.push(`Sleep ${r.sleepHours}h`);
      if ((r.painLevel ?? 0) > 0) parts.push(`Pain ${r.painLevel}/10`);
      lines.push(parts.join(' | '));
    });
  }

  // Runner profile
  lines.push('');
  lines.push('=== RUNNER PROFILE ===');
  if (goal) {
    if (goal.currentGoal) {
      const daysOut = goal.raceDate ? daysUntil(goal.raceDate) : null;
      lines.push(
        `Goal: ${goal.currentGoal}${daysOut !== null ? ` (${daysOut} days out)` : ''}`,
      );
    }
    if (goal.currentPhase) lines.push(`Training phase: ${goal.currentPhase}`);
    if (goal.weeklyMileageGoalKm) lines.push(`Weekly target: ${goal.weeklyMileageGoalKm} km`);
    if (goal.targetFinishTime) lines.push(`Target finish time: ${goal.targetFinishTime}`);
    if (goal.longRunDay) lines.push(`Long run day: ${goal.longRunDay}`);
  }
  if (settings.injuryWatchAreas && settings.injuryWatchAreas.length > 0) {
    lines.push(`Injury watch areas: ${settings.injuryWatchAreas.join(', ')}`);
  }
  if (settings.runnerContext) lines.push(`Bio: ${settings.runnerContext}`);

  // Travel run mode
  if (run.tags.includes('travel_run')) {
    lines.push('');
    lines.push('NOTE: This was a travel run. Please include travel/environmental context in the cinematic story and acknowledge training reality while traveling in the training insight.');
  }

  return lines.join('\n');
}

const SYSTEM_PROMPT = `You are a personal running coach and sports writer. You analyze run data to provide specific, actionable, personalized coaching insights — not generic advice.

Your job is to help the runner:
1. Understand what the run meant for their training
2. Decide what to do next (rest? run easy? tempo?)
3. Preserve meaningful reflections for their journal

Be direct, specific, and reference the actual data. Flag injury risks early and clearly.

Respond ONLY with valid JSON matching this exact schema (no extra keys, no markdown):
{
  "summary": "2-3 sentence clean post-run summary",
  "trainingInsight": "2-3 sentences analyzing effort vs performance patterns from recent runs",
  "recoveryRecommendation": "1-2 sentences on recovery action for next 24-48 hours",
  "nextRunSuggestion": "1-2 sentences suggesting next workout type, distance, and target pace",
  "stravaCaption": "max 200 chars, punchy, conversational — no hashtags",
  "cinematicStory": "3-5 sentences, vivid first-person narrative of this run",
  "readinessScore": 7,
  "shouldRunTomorrow": "yes | maybe | no",
  "tomorrowRecommendation": "specific recommendation for tomorrow: what type, intensity, and rough distance",
  "targetPaceSuggestion": "optional: suggested target pace range for next similar run",
  "confidenceNotes": "optional: any caveats or uncertainties in the coaching (e.g. limited data)",
  "lessonsLearned": "optional: what to remember or apply next time",
  "watchNextTime": "optional: body signals or form cues to monitor on the next run",
  "mentalNote": "optional: mental or psychological observation about this run"
}`;

export async function generateInsights(
  run: Run,
  recentRuns: Run[],
  settings: AppSettings,
): Promise<AIInsights> {
  if (!settings.openaiApiKey) {
    throw new Error('No OpenAI API key configured. Go to Settings to add your key.');
  }

  const client = createOpenAIClient(settings.openaiApiKey);
  const userPrompt = buildRunContext(run, recentRuns, settings);

  const response = await client.chat.completions.create({
    model: settings.openaiModel || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_tokens: 1200,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Empty response from OpenAI');

  const parsed = JSON.parse(content);

  return {
    summary: parsed.summary ?? '',
    trainingInsight: parsed.trainingInsight ?? '',
    recoveryRecommendation: parsed.recoveryRecommendation ?? '',
    nextRunSuggestion: parsed.nextRunSuggestion ?? '',
    stravaCaption: parsed.stravaCaption ?? '',
    cinematicStory: parsed.cinematicStory ?? '',
    readinessScore: typeof parsed.readinessScore === 'number' ? parsed.readinessScore : 5,
    shouldRunTomorrow: parsed.shouldRunTomorrow ?? 'maybe',
    tomorrowRecommendation: parsed.tomorrowRecommendation ?? '',
    targetPaceSuggestion: parsed.targetPaceSuggestion,
    confidenceNotes: parsed.confidenceNotes,
    lessonsLearned: parsed.lessonsLearned,
    watchNextTime: parsed.watchNextTime,
    mentalNote: parsed.mentalNote,
    generatedAt: new Date().toISOString(),
    modelUsed: settings.openaiModel || 'gpt-4o-mini',
  };
}
