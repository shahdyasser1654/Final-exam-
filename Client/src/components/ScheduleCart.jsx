import React from "react";
export default function ScheduleCart({
  selectedCourses,
  totalCredits,
  onRemove,
  onSubmit,
  canSubmit,
}) {
  return (
    <aside className="card" aria-label="Selected courses">
      <h2 style={{ marginTop: 0 }}>My Schedule</h2>

      {selectedCourses.length === 0 ? (
        <p className="muted">No courses selected yet.</p>
      ) : (
        <table className="table" aria-label="Selected courses table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Credits</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {selectedCourses.map((c) => (
              <tr key={c.id}>
                <td>
                  <div style={{ fontWeight: 800 }}>{c.id}</div>
                  <div className="muted">
                    {c.day} {c.time}
                  </div>
                </td>
                <td>{c.credits}</td>
                <td>
                  <button className="secondary" onClick={() => onRemove(c.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="row" style={{ marginTop: 12 }}>
        <div className="muted">
          Total Credits: <strong>{totalCredits}</strong>
        </div>
        <div className="spacer" />
        <button onClick={onSubmit} disabled={!canSubmit}>
          Submit Registration
        </button>
      </div>

      <p className="muted" style={{ marginBottom: 0, marginTop: 10 }}>
        Tip: Add courses from the catalog, then submit.
      </p>
    </aside>
  );
}
