// Pure grade logic (no React) so it can be unit tested.

// WAEC WASSCE grading scale (West African Examinations Council): A1 is best, F9 is fail. Credit = A1–C6.
export const WASSCE_SCALE = [
  { grade: "A1", min: 75, points: 1, label: "Excellent" },
  { grade: "B2", min: 70, points: 2, label: "Very good" },
  { grade: "B3", min: 65, points: 3, label: "Good" },
  { grade: "C4", min: 60, points: 4, label: "Credit" },
  { grade: "C5", min: 55, points: 5, label: "Credit" },
  { grade: "C6", min: 50, points: 6, label: "Credit" },
  { grade: "D7", min: 45, points: 7, label: "Pass" },
  { grade: "E8", min: 40, points: 8, label: "Pass" },
  { grade: "F9", min: 0, points: 9, label: "Fail" },
] as const;

export function wassceGrade(score: number) {
  const s = Math.max(0, Math.min(100, score));
  return WASSCE_SCALE.find((g) => s >= g.min)!;
}
export function isCredit(grade: string) {
  const g = WASSCE_SCALE.find((x) => x.grade === grade);
  return !!g && g.points <= 6;
}

/** Number of credit passes (A1–C6) and the aggregate of the best N subjects (lower is better). */
export function wassceSummary(grades: string[], best = 6) {
  const points: number[] = [];
  for (const g of grades) {
    const found = WASSCE_SCALE.find((x) => x.grade === g);
    if (found) points.push(found.points);
  }
  points.sort((a, b) => a - b);
  return {
    credits: grades.filter(isCredit).length,
    aggregate: points.length >= best ? points.slice(0, best).reduce((a, b) => a + b, 0) : null,
    counted: Math.min(best, points.length),
  };
}

// University GPA/CGPA. Scales differ between institutions, so the points are editable in the UI.
export const DEFAULT_GPA_SCALE: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };

export interface Course {
  credits: number;
  grade: string;
}

export function gpa(courses: Course[], scale: Record<string, number> = DEFAULT_GPA_SCALE): number | null {
  const valid = courses.filter((c) => c.credits > 0 && c.grade in scale);
  const units = valid.reduce((n, c) => n + c.credits, 0);
  if (!units) return null;
  const pts = valid.reduce((n, c) => n + c.credits * scale[c.grade], 0);
  return Math.round((pts / units) * 100) / 100;
}

/** CGPA across several semesters, weighted by credit units. */
export function cgpa(semesters: Course[][], scale: Record<string, number> = DEFAULT_GPA_SCALE): number | null {
  return gpa(semesters.flat(), scale);
}

/** Percentage needed in the remaining part of a course to reach a target overall mark. */
export function neededScore(target: number, doneWeight: number, doneScore: number): number | null {
  const left = 100 - doneWeight;
  if (left <= 0) return null;
  return Math.round(((target - (doneScore * doneWeight) / 100) / left) * 10000) / 100;
}
