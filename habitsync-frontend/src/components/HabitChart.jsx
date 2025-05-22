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
  const frequencyLabel = habit.frequencyLabel || 'custom';

  // Normalize log dates to 'YYYY-MM-DD'
  const loggedDays = (habit.logs || []).map((log) =>
    new Date(log).toISOString().slice(0, 10)
  );

  // Utility: Get week start (Sunday) for a given date
  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 (Sun) to 6 (Sat)
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  };

  // Weekly frequency: map each log to its week start
  const weeklyChartData = () => {
    const data = [];

    const current = new Date(createdAt);
    current.setHours(0, 0, 0, 0);

    const end = new Date(today);
    end.setHours(0, 0, 0, 0);

    const weeks = {};

    // Mark which weeks have logs
    for (let log of loggedDays) {
      const week = getWeekStart(log);
      weeks[week] = true;
    }

    // Generate weeks between createdAt and today
    while (current <= end) {
      const weekStart = getWeekStart(current);
      if (!data.some(d => d.date === weekStart)) {
        data.push({
          date: weekStart,
          value: weeks[weekStart] ? 1 : 0,
        });
      }
      current.setDate(current.getDate() + 7);
    }

    return data;
  };

  // Daily/Custom frequencies
  const dailyChartData = () => {
    const generateAllDates = () => {
      const dates = [];
      let currentDate = new Date(createdAt);
      while (currentDate <= today) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    };

    const isDateValidByFrequency = (date) => {
      const frequency = habit.frequency || [];
      const dayName = date.toLocaleString('en-US', { weekday: 'long' });

      if (frequencyLabel === 'daily') return true;
      if (frequencyLabel === 'weekdays') return dayName !== 'Saturday' && dayName !== 'Sunday';
      if (frequencyLabel === 'weekends') return dayName === 'Saturday' || dayName === 'Sunday';
      if (Array.isArray(frequency)) return frequency.includes(dayName);
      return false;
    };

    return generateAllDates()
      .filter((date) => isDateValidByFrequency(date))
      .map((date) => {
        const iso = date.toISOString().slice(0, 10);
        return {
          date: iso,
          value: loggedDays.includes(iso) ? 1 : 0,
        };
      });
  };

  // Decide which data to use based on frequencyLabel
  const data =
    frequencyLabel === 'weekly' ? weeklyChartData() : dailyChartData();

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
            <YAxis domain={[0, 1]} tickFormatter={(val) => (val === 1 ? '✓' : '')} />
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


// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';

// export default function HabitChart({ habit }) {
//   const today = new Date();
//   const createdAt = new Date(habit.createdAt);

//   const frequency = habit.frequency || [];
//   const frequencyLabel = habit.frequencyLabel || 'custom';

//   // Generate all dates from habit creation to today
//   const generateAllDates = () => {
//     const dates = [];
//     let currentDate = new Date(createdAt);

//     while (currentDate <= today) {
//       dates.push(new Date(currentDate));
//       currentDate.setDate(currentDate.getDate() + 1);
//     }

//     return dates;
//   };

//   // Check if a date should be included based on frequency
//   const isDateValidByFrequency = (date) => {
//     const dayName = date.toLocaleString('en-US', { weekday: 'long' });

//     if (frequencyLabel === 'daily') return true;
//     if (frequencyLabel === 'weekdays') return dayName !== 'Saturday' && dayName !== 'Sunday';
//     if (frequencyLabel === 'weekends') return dayName === 'Saturday' || dayName === 'Sunday';
//     if (Array.isArray(frequency)) return frequency.includes(dayName);

//     return false;
//   };

//   // Generate full list of dates that match habit frequency
//   const allValidDates = generateAllDates()
//     .filter((date) => isDateValidByFrequency(date))
//     .map((date) => date.toISOString().slice(0, 10)); // format to YYYY-MM-DD

//   // Normalize log dates
//   const loggedDays = (habit.logs || []).map((log) =>
//     new Date(log).toISOString().slice(0, 10)
//   );

//   // Build chart data
//   const data = allValidDates.map((date) => ({
//     date,
//     value: loggedDays.includes(date) ? 1 : 0,
//   }));

//   return (
//     <div
//       style={{
//         width: '100%',
//         overflowX: 'auto', // Always scrollable horizontally if needed
//       }}
//     >
//       <div style={{ width: `${data.length * 60}px`, minWidth: '100%' }}>
//         <ResponsiveContainer width="100%" height={150}>
//           <LineChart data={data}>
//             <XAxis dataKey="date" fontSize={12} />
//             <YAxis domain={[0, 1]} tickFormatter={(val) => (val === 1 ? '✓' : '')} />
//             <Tooltip />
//             <Line
//               type="monotone"
//               dataKey="value"
//               stroke="#10b981"
//               strokeWidth={2}
//               dot={{ r: 4 }}
//               activeDot={{ r: 6 }}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }
