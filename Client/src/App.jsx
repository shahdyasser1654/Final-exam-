import { useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import CourseCatalog from "./components/CourseCatalog";
import ScheduleCart from "./components/ScheduleCart";
import Alert from "./components/Alert";

const CREDIT_LIMIT = 18;

export default function App() {
  const [studentId, setStudentId] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("ALL");

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [coursesError, setCoursesError] = useState(null);

  const [alert, setAlert] = useState(null); // { type, message }

  // Load courses from backend
  useEffect(() => {
    async function loadCourses() {
      try {
        setLoadingCourses(true);
        setCoursesError(null);

        const res = await fetch("/api/courses");
        if (!res.ok) throw new Error("Failed to load courses from server.");

        const data = await res.json();
        setCourses(data);
      } catch (err) {
        setCoursesError(err.message);
      } finally {
        setLoadingCourses(false);
      }
    }

    loadCourses();
  }, []);

  const selectedCourses = useMemo(() => {
    return courses.filter((c) => selectedIds.includes(c.id));
  }, [courses, selectedIds]);

  const totalCredits = useMemo(() => {
    return selectedCourses.reduce((sum, c) => sum + c.credits, 0);
  }, [selectedCourses]);

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();

    return courses.filter((c) => {
      const matchesDept = dept === "ALL" || c.dept === dept;
      const matchesQuery =
        !q || c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q);
      return matchesDept && matchesQuery;
    });
  }, [courses, query, dept]);

  function addCourse(courseId) {
    setAlert(null);

    if (selectedIds.includes(courseId)) {
      setAlert({ type: "error", message: "This course is already in your schedule." });
      return;
    }

    const next = [...selectedIds, courseId];
    const nextCredits = courses
      .filter((c) => next.includes(c.id))
      .reduce((s, c) => s + c.credits, 0);

    if (nextCredits > CREDIT_LIMIT) {
      setAlert({ type: "error", message: `Credit limit exceeded (${CREDIT_LIMIT} max).` });
      return;
    }

    setSelectedIds(next);
  }

  function removeCourse(courseId) {
    setAlert(null);
    setSelectedIds((prev) => prev.filter((id) => id !== courseId));
  }

  async function submitRegistration() {
    setAlert(null);

    if (!studentId.trim()) {
      setAlert({ type: "error", message: "Please enter your Student ID before submitting." });
      return;
    }

    if (selectedIds.length === 0) {
      setAlert({ type: "error", message: "Please add at least one course before submitting." });
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: studentId.trim(),
          courseIds: selectedIds,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data?.errors?.join(" ") || "Registration failed.";
        setAlert({ type: "error", message: msg });
        return;
      }

      setAlert({ type: "success", message: data.message || "Registration successful." });
    } catch {
      setAlert({ type: "error", message: "Network error: could not reach the server." });
    }
  }

  return (
    <>
      <Navbar />

      <main className="container" aria-label="Course registration system">
        {alert && <Alert type={alert.type} message={alert.message} />}
        {loadingCourses && <Alert type="success" message="Loading courses..." />}
        {coursesError && <Alert type="error" message={coursesError} />}

        <section className="card" aria-label="Student details" style={{ marginBottom: 16 }}>
          <div className="row">
            <div style={{ minWidth: 240 }}>
              <label htmlFor="studentId">Student ID</label>
              <input
                id="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g., 2025XXXX"
                style={{ width: "100%", marginTop: 6 }}
              />
            </div>

            <div className="spacer" />

            <div className="muted">
              Credit Limit: <strong>{CREDIT_LIMIT}</strong> | Selected:{" "}
              <strong>{totalCredits}</strong>
            </div>
          </div>
        </section>

        <div className="grid">
          <CourseCatalog
            courses={filteredCourses}
            query={query}
            setQuery={setQuery}
            dept={dept}
            setDept={setDept}
            onAdd={addCourse}
            selectedIds={selectedIds}
          />

          <ScheduleCart
            selectedCourses={selectedCourses}
            totalCredits={totalCredits}
            onRemove={removeCourse}
            onSubmit={submitRegistration}
            canSubmit={selectedIds.length > 0 && studentId.trim().length > 0}
          />
        </div>
      </main>
    </>
  );
}
