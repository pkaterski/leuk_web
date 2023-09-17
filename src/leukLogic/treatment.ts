import { Drug } from "./initHealthy";

export type TreatmentCourse = {
  drug: Drug;
  atTime: number;
  doseMg: number;
};

export function generateEvenlySpread(
  drug: Drug,
  totalTimeSpan: number,
  numberOfAdministrations: number,
  drugDose: number,
): TreatmentCourse[] {
  const courses: TreatmentCourse[] = [];
  const timeInterval = totalTimeSpan / numberOfAdministrations;
  for (let i = 1; i <= numberOfAdministrations; i++) {
    courses.push({
      drug,
      atTime: timeInterval * i,
      doseMg: drugDose,
    });
  }
  return courses;
}
