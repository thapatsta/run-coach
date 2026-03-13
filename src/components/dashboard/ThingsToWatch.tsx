import { Card } from '../ui/Card';

interface ThingsToWatchProps {
  flags: string[];
  injuryWatchAreas?: string[];
}

export function ThingsToWatch({ flags, injuryWatchAreas = [] }: ThingsToWatchProps) {
  const allItems = [
    ...injuryWatchAreas.map((area) => `Monitoring: ${area}`),
    ...flags,
  ];

  if (allItems.length === 0) return null;

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-700 mb-3">Things to Watch</h3>
      <ul className="space-y-2">
        {allItems.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}
