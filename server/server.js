import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const dataDir = path.join(process.cwd(), "data");
const coursesPath = path.join(dataDir, "courses.json");
const registrationsPath = path.join(dataDir, "registrations.json");

const readJSON = (p) => JSON.parse(fs.readFileSync(p, "utf-8"));
const writeJSON = (p, obj) => fs.writeFileSync(p, JSON.stringify(obj, null, 2));

function parseTimeRange(timeRange) {
  const [startStr, endStr] = timeRange.split("-");
  const toMinutes = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  return [toMinutes(startStr), toMinutes(endStr)];
}

function overlaps(a, b) {
  if (a.day !== b.day) return false;
  const [aS, aE] = parseTimeRange(a.time);
  const [bS, bE] = parseTimeRange(b.time);
  return aS < bE && bS < aE;
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Server is running" });
});

app.get("/api/courses", (req, res) => {
  res.json(readJSON(coursesPath));
});

app.post("/api/register", (req, res) => {
  const { studentId, courseIds } = req.body;
  const errors = [];

  if (!studentId || !studentId.trim()) errors.push("Student ID is required.");
  if (!Array.isArray(courseIds) || courseIds.length === 0)
    errors.push("courseIds must be a non-empty array.");

  if (errors.length) return res.status(400).json({ errors });

  const courses = readJSON(coursesPath);
  const selected = courseIds.map((id) => courses.find((c) => c.id === id));

  if (selected.some((c) => !c))
    return res.status(400).json({ errors: ["One or more courseIds are invalid."] });

  if (new Set(courseIds).size !== courseIds.length)
    errors.push("Duplicate course selection is not allowed.");

  const CREDIT_LIMIT = 18;
  const totalCredits = selected.reduce((s, c) => s + c.credits, 0);
  if (totalCredits > CREDIT_LIMIT)
    errors.push(`Credit limit exceeded. Max allowed is ${CREDIT_LIMIT}.`);

  for (let i = 0; i < selected.length; i++) {
    for (let j = i + 1; j < selected.length; j++) {
      if (overlaps(selected[i], selected[j])) {
        errors.push(
          `Time conflict: ${selected[i].id} overlaps with ${selected[j].id} on ${selected[i].day}.`
        );
      }
    }
  }

  if (errors.length) return res.status(400).json({ errors });

  const registrations = readJSON(registrationsPath);
  registrations[studentId.trim()] = {
    studentId: studentId.trim(),
    courseIds,
    totalCredits,
    timestamp: new Date().toISOString()
  };
  writeJSON(registrationsPath, registrations);

  res.json({ message: "Registration successful.", registration: registrations[studentId.trim()] });
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
