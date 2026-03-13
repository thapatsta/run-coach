import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import { getCurrentWeekDailyKm } from '../../lib/dateUtils';
import type { Run } from '../../types';

interface WeeklyMileageChartProps {
  runs: Run[];
  goalKm?: number;
}

export function WeeklyMileageChart({ runs, goalKm }: WeeklyMileageChartProps) {
  const data = getCurrentWeekDailyKm(runs);
  const totalKm = data.reduce((s, d) => s + d.km, 0);

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-slate-700">This Week</h3>
        <span className="text-sm font-bold text-indigo-600">{totalKm.toFixed(1)} km</span>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
            formatter={(v) => [`${Number(v).toFixed(1)} km`, 'Distance']}
          />
          <Bar dataKey="km" fill="#6366f1" radius={[4, 4, 0, 0]} />
          {goalKm && (
            <ReferenceLine
              y={goalKm / 7}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              label={{ value: 'Daily avg target', fontSize: 10, fill: '#f59e0b', position: 'right' }}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
