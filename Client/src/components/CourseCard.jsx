export default function CourseCard({ course, onAdd, isSelected }) {
  return (
    <div className="card" style={{ padding: 12 }}>
      <div className="row">
        <div>
          <div style={{ fontWeight: 800 }}>
            {course.id} — {course.title}
          </div>
          <div className="muted">
            Dept: {course.dept} • Credits: {course.credits} • {course.day}{" "}
            {course.time}
          </div>
        </div>

        <div className="spacer" />

        <button onClick={onAdd} disabled={isSelected} aria-disabled={isSelected}>
          {isSelected ? "Added" : "Add"}
        </button>
      </div>
    </div>
  );
}
