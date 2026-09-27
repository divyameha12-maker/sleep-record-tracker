import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const savedRecords =
      JSON.parse(localStorage.getItem("sleepRecords")) || [];

    setRecords(savedRecords);
  }, []);

  // Sort newest records first
  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Latest 7 sleep records
  const weeklyRecords = sortedRecords.slice(0, 7);

  // Most recent sleep record
  const latestRecord =
    sortedRecords.length > 0 ? sortedRecords[0] : null;

  // Weekly total
  const totalSleep = weeklyRecords.reduce(
    (total, record) => total + record.duration.decimal,
    0
  );

  // Weekly average
  const averageSleep =
    weeklyRecords.length > 0
      ? totalSleep / weeklyRecords.length
      : 0;

  // Most common sleep quality
  const getMostCommonQuality = () => {
    if (weeklyRecords.length === 0) {
      return "No Data";
    }

    const qualityCount = {};

    weeklyRecords.forEach((record) => {
      qualityCount[record.quality] =
        (qualityCount[record.quality] || 0) + 1;
    });

    return Object.keys(qualityCount).reduce((a, b) =>
      qualityCount[a] >= qualityCount[b] ? a : b
    );
  };

  const formatHours = (decimalHours) => {
    const totalMinutes = Math.round(decimalHours * 60);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="page dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Good Evening 🌙</h1>
          <p>
            Track your sleep and understand your weekly sleep
            pattern.
          </p>
        </div>

        <Link to="/records" className="dashboard-add-button">
          + Add Sleep Record
        </Link>
      </div>

      {records.length === 0 ? (
        <div className="dashboard-empty">
          <div className="dashboard-empty-icon">😴</div>

          <h2>Start Tracking Your Sleep</h2>

          <p>
            Add your first sleep record to view your sleep
            statistics and weekly progress.
          </p>

          <Link to="/records" className="dashboard-start-button">
            Add Your First Record
          </Link>
        </div>
      ) : (
        <>
          <div className="dashboard-cards">
            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon">🌙</div>

              <div>
                <p>Latest Sleep</p>

                <h2>
                  {latestRecord
                    ? `${latestRecord.duration.hours}h ${latestRecord.duration.minutes}m`
                    : "0h 0m"}
                </h2>

                <span>
                  {latestRecord
                    ? formatDate(latestRecord.date)
                    : "No record"}
                </span>
              </div>
            </div>

            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon">⏱️</div>

              <div>
                <p>Weekly Average</p>

                <h2>{formatHours(averageSleep)}</h2>

                <span>
                  Based on {weeklyRecords.length} record
                  {weeklyRecords.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon">📅</div>

              <div>
                <p>Total Records</p>

                <h2>{records.length}</h2>

                <span>Sleep entries saved</span>
              </div>
            </div>

            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon">✨</div>

              <div>
                <p>Common Quality</p>

                <h2>{getMostCommonQuality()}</h2>

                <span>Latest 7 records</span>
              </div>
            </div>
          </div>

          <div className="dashboard-bottom-grid">
            <div className="recent-records-card">
              <div className="dashboard-section-heading">
                <div>
                  <h2>Recent Sleep Records</h2>
                  <p>Your latest sleep activity</p>
                </div>

                <Link to="/records">View All →</Link>
              </div>

              <div className="recent-record-list">
                {sortedRecords.slice(0, 5).map((record) => (
                  <div
                    className="recent-record-item"
                    key={record.id}
                  >
                    <div className="recent-date">
                      <div className="recent-moon">🌙</div>

                      <div>
                        <strong>
                          {formatDate(record.date)}
                        </strong>

                        <p>
                          {record.bedtime} → {record.wakeTime}
                        </p>
                      </div>
                    </div>

                    <div className="recent-result">
                      <strong>
                        {record.duration.hours}h{" "}
                        {record.duration.minutes}m
                      </strong>

                      <span>{record.quality}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-overview-card">
              <h2>Weekly Overview</h2>

              <p className="overview-description">
                Summary of your latest sleep records.
              </p>

              <div className="overview-row">
                <span>🌙 Total Sleep</span>
                <strong>{formatHours(totalSleep)}</strong>
              </div>

              <div className="overview-row">
                <span>⏱️ Average Sleep</span>
                <strong>{formatHours(averageSleep)}</strong>
              </div>

              <div className="overview-row">
                <span>📊 Records This Week</span>
                <strong>{weeklyRecords.length}</strong>
              </div>

              <div className="overview-row">
                <span>✨ Common Quality</span>
                <strong>{getMostCommonQuality()}</strong>
              </div>

              <Link
                to="/summary"
                className="view-summary-button"
              >
                View Weekly Summary
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;