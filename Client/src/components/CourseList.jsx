import React from "react";
import CourseCard from "./CourseCard";

export default function CourseList({ courses, onAdd, selectedIds }) {
  if (!courses || courses.length === 0) {
    return <p className="muted">No courses match your search/filter.</p>;
  }

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {courses.map((c) => (
        <CourseCard
          key={c.id}
          course={c}
          onAdd={() => onAdd(c.id)}
          isSelected={selectedIds.includes(c.id)}
        />
      ))}
    </div>
  );
}
