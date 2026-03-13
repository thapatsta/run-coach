import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import type { Run, DistanceUnit } from '../../types';
import { formatPace } from '../../lib/pace';
import { formatDateShort } from '../../lib/dateUtils';

interface PaceTrendChartProps {
  runs: Run[];
  unit: DistanceUnit;
}

export function PaceTrendChart({ runs, unit }: PaceTrendChartProps) {
  const data = [...runs]
    .filter((r) => r.paceSecondsPerKm > 0)
    .slice(0, 10)
    .reverse()
    .map((r) => ({
      date: formatDateShort(r.date),
      pace: Math.round(r.paceSecondsPerKm),
      rpe: r.perceivedEffort,
      type: r.runType,
    }));

  if (data.length < 2) return null;

  const formatYAxis = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Pace Trend (last 10)</h3>
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={data} margin={{ top: 4, right: 0, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={formatYAxis} axisLine={false} tickLine={false} reversed />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
            formatter={(v) => [formatPace(Number(v), unit), 'Pace']}
          />
          <Line
            type="monotone"
            dataKey="pace"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ r: 3, fill: '#6366f1' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
