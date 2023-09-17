import { AVG_DOSE, Drug } from "./initHealthy";

export type TreatmentCourse = {
  drug: Drug;
  atTime: number;
  doseMg: number;
};

export function generateEvenlySpread(
  drug: Drug,
  totalTimeSpan: number,
  numberOfAdministrations: number
): TreatmentCourse[] {
  const courses: TreatmentCourse[] = [];
  const timeInterval = totalTimeSpan / numberOfAdministrations;
  const avgDose = AVG_DOSE.get(drug);
  if (avgDose === undefined) throw new Error("Cannot get AVG DOSE -  unlisted");
  for (let i = 1; i <= numberOfAdministrations; i++) {
    courses.push({
      drug,
      atTime: timeInterval * i,
      doseMg: avgDose,
    });
  }
  return courses;
}
