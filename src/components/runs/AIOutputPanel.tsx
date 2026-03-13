import { useState } from 'react';
import type { AIInsights } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';

interface AIOutputPanelProps {
  insights: AIInsights | undefined;
  onGenerate: () => void;
  isLoading: boolean;
  error: string | null;
  hasApiKey: boolean;
}

const TABS = [
  { id: 'summary', label: 'Summary', key: 'summary' as keyof AIInsights },
  { id: 'insight', label: 'Insight', key: 'trainingInsight' as keyof AIInsights },
  { id: 'recovery', label: 'Recovery', key: 'recoveryRecommendation' as keyof AIInsights },
  { id: 'next', label: 'Next Run', key: 'nextRunSuggestion' as keyof AIInsights },
  { id: 'strava', label: 'Strava', key: 'stravaCaption' as keyof AIInsights },
  { id: 'story', label: 'Story', key: 'cinematicStory' as keyof AIInsights },
] as const;

const JOURNAL_FIELDS = [
  { label: 'Lessons learned', key: 'lessonsLearned' as keyof AIInsights },
  { label: 'Watch next time', key: 'watchNextTime' as keyof AIInsights },
  { label: 'Mental note', key: 'mentalNote' as keyof AIInsights },
  { label: 'Target pace suggestion', key: 'targetPaceSuggestion' as keyof AIInsights },
  { label: 'Confidence notes', key: 'confidenceNotes' as keyof AIInsights },
];

function ReadinessIndicator({ score, shouldRun }: { score: number; shouldRun: 'yes' | 'maybe' | 'no' }) {
  const color =
    shouldRun === 'yes' ? 'bg-green-500' :
    shouldRun === 'maybe' ? 'bg-amber-500' : 'bg-red-500';
  const label = shouldRun === 'yes' ? 'Run tomorrow' : shouldRun === 'maybe' ? 'Maybe tomorrow' : 'Rest tomorrow';

  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
      <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-white font-bold text-lg`}>
        {score}
      </div>
      <div>
        <p className="text-xs text-slate-500">Readiness score</p>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
      </div>
    </div>
  );
}

export function AIOutputPanel({ insights, onGenerate, isLoading, error, hasApiKey }: AIOutputPanelProps) {
  const [activeTab, setActiveTab] = useState<string>('summary');

  if (!hasApiKey) {
    return (
      <Card>
        <div className="text-center py-6">
          <p className="text-slate-500 text-sm mb-3">Add your OpenAI API key in Settings to generate coaching insights.</p>
          <a href="/settings" className="text-indigo-600 text-sm font-medium hover:underline">Go to Settings →</a>
        </div>
      </Card>
    );
  }

  if (!insights) {
    return (
      <Card>
        <div className="text-center py-6 space-y-3">
          {isLoading ? (
            <>
              <Spinner className="mx-auto" />
              <p className="text-sm text-slate-500">Generating your coaching insights…</p>
            </>
          ) : (
            <>
              <p className="text-slate-600 text-sm">Ready to generate your AI coaching report for this run.</p>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <Button onClick={onGenerate} isLoading={isLoading}>
                ✦ Generate Insights
              </Button>
            </>
          )}
        </div>
      </Card>
    );
  }

  const activeContent = TABS.find((t) => t.id === activeTab);

  return (
    <div className="space-y-3">
      <ReadinessIndicator score={insights.readinessScore} shouldRun={insights.shouldRunTomorrow} />

      {/* Tomorrow recommendation */}
      <Card padding="sm">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Tomorrow</p>
        <p className="text-sm text-slate-700">{insights.tomorrowRecommendation}</p>
      </Card>

      {/* Tabbed outputs */}
      <div>
        <div className="flex overflow-x-auto gap-1 pb-1 mb-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <Card>
          {activeTab === 'strava' ? (
            <div>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{String(insights[activeContent!.key] ?? '')}</p>
              <button
                onClick={() => navigator.clipboard.writeText(String(insights[activeContent!.key] ?? ''))}
                className="mt-3 text-xs text-indigo-600 hover:underline"
              >
                Copy to clipboard
              </button>
            </div>
          ) : (
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {String(insights[activeContent!.key] ?? '')}
            </p>
          )}
        </Card>
      </div>

      {/* Journal fields */}
      {JOURNAL_FIELDS.some((f) => insights[f.key]) && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Journal notes</p>
          {JOURNAL_FIELDS.filter((f) => insights[f.key]).map((f) => (
            <Card key={f.key} padding="sm">
              <p className="text-xs font-semibold text-slate-400 mb-1">{f.label}</p>
              <p className="text-sm text-slate-700">{String(insights[f.key])}</p>
            </Card>
          ))}
        </div>
      )}

      <div className="text-right">
        <button onClick={onGenerate} className="text-xs text-slate-400 hover:text-slate-600">
          Regenerate
        </button>
      </div>
    </div>
  );
}
