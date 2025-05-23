import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function HabitChart({ habit }) {
  const today = new Date();
  const createdAt = new Date(habit.createdAt);
  const loggedDays = (habit.logs || []).map((log) =>
    new Date(log).toISOString().slice(0, 10)
  );

  const frequencyLabel = (habit.frequencyLabel || 'custom').toLowerCase();

  const validDays = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
  ];

  // Convert ["1", "2", "4"] => ["Monday", "Tuesday", "Thursday"]
  const frequency = Array.isArray(habit.frequency)
  ? habit.frequency.filter(day => validDays.includes(day))
  : [];

  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  };

  const weeklyChartData = () => {
    const data = [];
    const weeks = {};

    for (let log of loggedDays) {
      const week = getWeekStart(log);
      weeks[week] = true;
    }

    const current = new Date(createdAt);
    const end = new Date(today);
    current.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    while (current <= end) {
      const weekStart = getWeekStart(current);
      if (!data.some((d) => d.date === weekStart)) {
        data.push({
          date: weekStart,
          value: weeks[weekStart] ? 1 : 0,
        });
      }
      current.setDate(current.getDate() + 7);
    }

    return data;
  };

  const dailyChartData = () => {
    const data = [];
    const current = new Date(createdAt);
    const end = new Date(today);

    while (current <= end) {
      const dayName = current.toLocaleDateString('en-US', { weekday: 'long' });
      const isoDate = current.toISOString().slice(0, 10);

      let include = false;

      switch (frequencyLabel) {
        case 'daily':
          include = true;
          break;
        case 'weekdays':
          include = !['Saturday', 'Sunday'].includes(dayName);
          break;
        case 'weekends':
          include = ['Saturday', 'Sunday'].includes(dayName);
          break;
        case 'custom':
          include = frequency.includes(dayName);
          break;
      }

      if (include) {
        data.push({
          date: isoDate,
          value: loggedDays.includes(isoDate) ? 1 : 0,
        });
      }

      current.setDate(current.getDate() + 1);
    }

    return data;
  };

  const data = frequencyLabel === 'weekly' ? weeklyChartData() : dailyChartData();

  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
      }}
    >
      <div style={{ width: `${data.length * 60}px`, minWidth: '100%' }}>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={data}>
            <XAxis
              dataKey="date"
              fontSize={12}
              tickFormatter={(date) =>
                frequencyLabel === 'weekly' ? `Week of ${date.slice(5)}` : date
              }
            />
            <YAxis
              domain={[0, 1]}
              tickFormatter={(val) => (val === 1 ? '✓' : '')}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}