import { Drug } from "./initHealthy";

export type TreatmentCourse = {
  drug: Drug;
  atTime: number;
};

export function generateEvenlySpread(
  drug: Drug,
  totalTimeSpan: number,
  numberOfAdministrations: number
): TreatmentCourse[] {
  const courses: TreatmentCourse[] = [];
  const timeInterval = totalTimeSpan / numberOfAdministrations;
  for (let i = 1; i <= numberOfAdministrations; i++) {
    courses.push({
      drug,
      atTime: timeInterval * i,
    });
  }
  return courses;
}
