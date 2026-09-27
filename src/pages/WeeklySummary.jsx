import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function WeeklySummary() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const savedRecords =
      JSON.parse(localStorage.getItem("sleepRecords")) || [];

    setRecords(savedRecords);
  }, []);

  // Sort newest records first and take the latest 7
  const weeklyRecords = [...records]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 7)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartData = weeklyRecords.map((record) => {
    const date = new Date(record.date + "T00:00:00");

    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      fullDate: record.date,
      hours: record.duration.decimal,
    };
  });

  const totalSleep = weeklyRecords.reduce(
    (total, record) => total + record.duration.decimal,
    0
  );

  const averageSleep =
    weeklyRecords.length > 0
      ? totalSleep / weeklyRecords.length
      : 0;

  const longestSleep =
    weeklyRecords.length > 0
      ? Math.max(
          ...weeklyRecords.map(
            (record) => record.duration.decimal
          )
        )
      : 0;

  const shortestSleep =
    weeklyRecords.length > 0
      ? Math.min(
          ...weeklyRecords.map(
            (record) => record.duration.decimal
          )
        )
      : 0;

  const formatHours = (decimalHours) => {
    const totalMinutes = Math.round(decimalHours * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="page">
      <h1>Weekly Summary</h1>

      <p>
        View your sleep duration and weekly sleep statistics.
      </p>

      {weeklyRecords.length === 0 ? (
        <div className="no-summary">
          <span>🌙</span>

          <h2>No sleep data available</h2>

          <p>
            Add sleep records to view your weekly summary.
          </p>
        </div>
      ) : (
        <>
          <div className="summary-cards">
            <div className="summary-card">
              <span className="summary-icon">⏱️</span>

              <div>
                <p>Average Sleep</p>
                <h2>{formatHours(averageSleep)}</h2>
              </div>
            </div>

            <div className="summary-card">
              <span className="summary-icon">🌙</span>

              <div>
                <p>Total Sleep</p>
                <h2>{formatHours(totalSleep)}</h2>
              </div>
            </div>

            <div className="summary-card">
              <span className="summary-icon">😴</span>

              <div>
                <p>Longest Sleep</p>
                <h2>{formatHours(longestSleep)}</h2>
              </div>
            </div>

            <div className="summary-card">
              <span className="summary-icon">☀️</span>

              <div>
                <p>Shortest Sleep</p>
                <h2>{formatHours(shortestSleep)}</h2>
              </div>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-heading">
              <div>
                <h2>7-Day Sleep Duration</h2>
                <p>Hours of sleep recorded each day</p>
              </div>

              <span className="chart-badge">
                Last {weeklyRecords.length} Days
              </span>
            </div>

            <div className="sleep-chart">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis dataKey="date" />

                  <YAxis
                    domain={[0, 12]}
                    label={{
                      value: "Hours",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />

                  <Tooltip
                    formatter={(value) => [
                      formatHours(value),
                      "Sleep",
                    ]}
                  />

                  <Bar
                    dataKey="hours"
                    fill="#6558d3"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="weekly-details-card">
            <h2>Daily Breakdown</h2>

            <div className="weekly-details">
              {weeklyRecords.map((record) => (
                <div
                  className="daily-sleep"
                  key={record.id}
                >
                  <div>
                    <strong>{record.date}</strong>
                    <p>{record.quality} sleep</p>
                  </div>

                  <span>
                    {record.duration.hours}h{" "}
                    {record.duration.minutes}m
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default WeeklySummary;