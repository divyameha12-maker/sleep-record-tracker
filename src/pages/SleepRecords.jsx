import { useEffect, useState } from "react";

function SleepRecords() {
  const [formData, setFormData] = useState({
    date: "",
    bedtime: "",
    wakeTime: "",
    quality: "Good",
  });

  // Load saved records from localStorage
  const [records, setRecords] = useState(() => {
    const savedRecords = localStorage.getItem("sleepRecords");

    return savedRecords ? JSON.parse(savedRecords) : [];
  });

  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Search and filter states
  const [searchDate, setSearchDate] = useState("");
  const [qualityFilter, setQualityFilter] = useState("All");

  // Save records to localStorage whenever records change
  useEffect(() => {
    localStorage.setItem(
      "sleepRecords",
      JSON.stringify(records)
    );
  }, [records]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  // Calculate sleep duration
  const calculateDuration = (bedtime, wakeTime) => {
    const [bedHour, bedMinute] = bedtime
      .split(":")
      .map(Number);

    const [wakeHour, wakeMinute] = wakeTime
      .split(":")
      .map(Number);

    const bedMinutes = bedHour * 60 + bedMinute;

    let wakeMinutes = wakeHour * 60 + wakeMinute;

    // If wake-up time is earlier than bedtime,
    // wake-up is considered to be on the next day.
    if (wakeMinutes <= bedMinutes) {
      wakeMinutes += 24 * 60;
    }

    const difference = wakeMinutes - bedMinutes;

    const hours = Math.floor(difference / 60);
    const minutes = difference % 60;

    return {
      hours,
      minutes,
      decimal: Number((difference / 60).toFixed(2)),
    };
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      date: "",
      bedtime: "",
      wakeTime: "",
      quality: "Good",
    });

    setEditingId(null);
    setError("");
  };

  // Add or update record
  const handleSubmit = (e) => {
    e.preventDefault();

    // Required field validation
    if (
      !formData.date ||
      !formData.bedtime ||
      !formData.wakeTime
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    // Prevent duplicate dates
    const duplicateDate = records.some(
      (record) =>
        record.date === formData.date &&
        record.id !== editingId
    );

    if (duplicateDate) {
      setError(
        "A sleep record already exists for this date."
      );
      return;
    }

    // Calculate sleep duration
    const duration = calculateDuration(
      formData.bedtime,
      formData.wakeTime
    );

    // Duration validation
    if (duration.decimal > 16) {
      setError(
        "Sleep duration cannot be more than 16 hours."
      );
      return;
    }

    if (editingId !== null) {
      // Update existing record
      const updatedRecords = records.map((record) =>
        record.id === editingId
          ? {
              ...record,
              ...formData,
              duration,
            }
          : record
      );

      setRecords(updatedRecords);
    } else {
      // Add new record
      const newRecord = {
        id: Date.now(),
        ...formData,
        duration,
      };

      setRecords([...records, newRecord]);
    }

    resetForm();
  };

  // Edit record
  const editRecord = (record) => {
    setFormData({
      date: record.date,
      bedtime: record.bedtime,
      wakeTime: record.wakeTime,
      quality: record.quality,
    });

    setEditingId(record.id);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete record
  const deleteRecord = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this sleep record?"
    );

    if (confirmed) {
      setRecords(
        records.filter((record) => record.id !== id)
      );

      if (editingId === id) {
        resetForm();
      }
    }
  };

  // Search and filter records
  const filteredRecords = records.filter((record) => {
    const matchesDate =
      searchDate === "" ||
      record.date === searchDate;

    const matchesQuality =
      qualityFilter === "All" ||
      record.quality === qualityFilter;

    return matchesDate && matchesQuality;
  });

  // Sort newest records first
  const displayedRecords = [...filteredRecords].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Clear filters
  const clearFilters = () => {
    setSearchDate("");
    setQualityFilter("All");
  };

  return (
    <div className="page">
      <h1>Sleep Records</h1>

      <p>
        Add, edit, search and manage your daily sleep
        records.
      </p>

      <div className="record-layout">
        {/* ADD / EDIT FORM */}

        <div className="form-card">
          <h2>
            {editingId !== null
              ? "✏️ Edit Sleep Record"
              : "🌙 Add Sleep Record"}
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Date */}

            <div className="form-group">
              <label>Date</label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            {/* Bedtime */}

            <div className="form-group">
              <label>Bedtime</label>

              <input
                type="time"
                name="bedtime"
                value={formData.bedtime}
                onChange={handleChange}
              />
            </div>

            {/* Wake-up Time */}

            <div className="form-group">
              <label>Wake-up Time</label>

              <input
                type="time"
                name="wakeTime"
                value={formData.wakeTime}
                onChange={handleChange}
              />
            </div>

            {/* Sleep Quality */}

            <div className="form-group">
              <label>Sleep Quality</label>

              <select
                name="quality"
                value={formData.quality}
                onChange={handleChange}
              >
                <option value="Excellent">
                  Excellent
                </option>

                <option value="Good">
                  Good
                </option>

                <option value="Average">
                  Average
                </option>

                <option value="Poor">
                  Poor
                </option>
              </select>
            </div>

            {/* Error Message */}

            {error && (
              <p className="error-message">
                {error}
              </p>
            )}

            {/* Add / Update Button */}

            <button
              type="submit"
              className="add-button"
            >
              {editingId !== null
                ? "✓ Update Sleep Record"
                : "+ Add Sleep Record"}
            </button>

            {/* Cancel Edit */}

            {editingId !== null && (
              <button
                type="button"
                className="cancel-button"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        {/* RECORDS SECTION */}

        <div className="records-card">
          <h2>My Sleep Records</h2>

          {/* SEARCH AND FILTER */}

          <div className="record-filters">
            <div className="filter-group">
              <label>Search by Date</label>

              <input
                type="date"
                value={searchDate}
                onChange={(e) =>
                  setSearchDate(e.target.value)
                }
              />
            </div>

            <div className="filter-group">
              <label>Sleep Quality</label>

              <select
                value={qualityFilter}
                onChange={(e) =>
                  setQualityFilter(e.target.value)
                }
              >
                <option value="All">
                  All
                </option>

                <option value="Excellent">
                  Excellent
                </option>

                <option value="Good">
                  Good
                </option>

                <option value="Average">
                  Average
                </option>

                <option value="Poor">
                  Poor
                </option>
              </select>
            </div>

            <button
              type="button"
              className="clear-filter-button"
              onClick={clearFilters}
            >
              Clear
            </button>
          </div>

          {/* Number of Records */}

          {records.length > 0 && (
            <p className="record-count">
              Showing {displayedRecords.length} of{" "}
              {records.length} record
              {records.length !== 1 ? "s" : ""}
            </p>
          )}

          {/* NO RECORDS AT ALL */}

          {records.length === 0 ? (
            <div className="empty-records">
              <span>😴</span>

              <h3>No sleep records yet</h3>

              <p>
                Add your first sleep record to get
                started.
              </p>
            </div>
          ) : displayedRecords.length === 0 ? (
            /* NO FILTER RESULTS */

            <div className="empty-records">
              <span>🔍</span>

              <h3>No matching records</h3>

              <p>
                Try changing the date or sleep quality
                filter.
              </p>

              <button
                type="button"
                className="clear-filter-button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            /* RECORD TABLE */

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Bedtime</th>
                    <th>Wake Up</th>
                    <th>Duration</th>
                    <th>Quality</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {displayedRecords.map((record) => (
                    <tr key={record.id}>
                      <td>{record.date}</td>

                      <td>{record.bedtime}</td>

                      <td>{record.wakeTime}</td>

                      <td>
                        {record.duration.hours}h{" "}
                        {record.duration.minutes}m
                      </td>

                      <td>
                        {record.quality}
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="edit-button"
                            onClick={() =>
                              editRecord(record)
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-button"
                            onClick={() =>
                              deleteRecord(record.id)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SleepRecords;