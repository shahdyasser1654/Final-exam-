import React from "react";
import CourseList from "./CourseList";

export default function CourseCatalog({
  courses,
  query,
  setQuery,
  dept,
  setDept,
  onAdd,
  selectedIds,
}) {
  return (
    <section className="card" aria-label="Course catalog">
      <h2 style={{ marginTop: 0 }}>Course Catalog</h2>

      <div className="row" style={{ marginBottom: 12 }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <label htmlFor="search">Search</label>
          <input
            id="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by course ID or title"
            style={{ width: "100%", marginTop: 6 }}
          />
        </div>

        <div style={{ minWidth: 160 }}>
          <label htmlFor="dept">Department</label>
          <select
            id="dept"
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            style={{ width: "100%", marginTop: 6 }}
          >
            <option value="ALL">All</option>
            <option value="CS">CS</option>
            <option value="MATH">MATH</option>
            <option value="ENG">ENG</option>
            <option value="CHEM">CHEM</option>
          </select>
        </div>
      </div>

      <CourseList courses={courses} onAdd={onAdd} selectedIds={selectedIds} />
    </section>
  );
}
