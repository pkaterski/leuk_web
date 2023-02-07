import {
  BloodValues,
  generateHalthyBloodValues,
  checkNormalVals,
  Drug,
  RefValue,
  BloodValueRefs,
} from "./initHealthy";
import { TreatmentCourse } from "./treatment";

export { checkNormalVals };

const initBVs: BloodValues = generateHalthyBloodValues();

function introduceLeukemia(bvsIn: BloodValues): BloodValues {
  const bvs = { ...bvsIn };

  const amtToAdd = 1 * 10 ** 3;

  bvs.aggressiveLeukemiaCells += amtToAdd;
  bvs.nonAggressiveLeukemiaCells += amtToAdd;

  return bvs;
}

export const beginBVs = introduceLeukemia(initBVs);

export const CRITICAL_TIME = 30000;

export function getDrugWareOffTime(drug: Drug): number {
  switch (drug) {
    case "Alexan":
      return 1000;
    case "Oncaspar":
      return 15000;
    case "Methotrexate":
      return 15000;
    case "Mercaptopurine":
      return 15000;
    default:
      return 0;
  }
}

// modifies bvs
function handleDrugAction(bvs: BloodValues, timePassed: number) {
  // handle drug wareoff
  if (bvs.drug !== null) {
    const wareOffTime = getDrugWareOffTime(bvs.drug.type);

    const t0 = bvs.drug.introductionTime;
    const t1 = timePassed;
    const d = t1 - t0;

    if (d >= wareOffTime) {
      bvs.drug = null;
    }

    // handle drug action
    bvs.redBloodCells *= 0.8;
    bvs.whiteBloodCells *= 0.8;
    bvs.thrombocytes *= 0.8;
    bvs.aggressiveLeukemiaCells *= 0.6;
    bvs.nonAggressiveLeukemiaCells *= 0.8;
  }
}

function normalizeBloodCells(bvs: BloodValues, checkRefs: BloodValueRefs) {
  // handle normalization
  const normalFactor = (r: RefValue) => (r == "high" ? -1 : r == "low" ? 1 : 0);
  // bvs.redBloodCells   += 100000;
  // bvs.whiteBloodCells += 1000;
  // bvs.thrombocytes    += 10000;
  bvs.redBloodCells *= 1 + normalFactor(checkRefs.redBloodCells) * 0.05;
  bvs.whiteBloodCells *= 1 + normalFactor(checkRefs.whiteBloodCells) * 0.05;
  bvs.thrombocytes *= 1 + normalFactor(checkRefs.thrombocytes) * 0.05;
}

function handleCriticalCondition(
  bvs: BloodValues,
  checkRefs: BloodValueRefs,
  timePassed: number
) {
  const hasCritical = !Object.values(checkRefs).every((v) => v === "normal");

  if (bvs.criticalTimeStart === null) {
    if (hasCritical) bvs.criticalTimeStart = timePassed;
  } else {
    if (!hasCritical) bvs.criticalTimeStart = null;
    else if (timePassed - bvs.criticalTimeStart > CRITICAL_TIME)
      bvs.alive = false;
  }
}

export function handleIter(
  bvsIn: BloodValues,
  timePassed: number,
  treatmentCourse: TreatmentCourse[] = []
): BloodValues {
  if (!bvsIn.alive) return bvsIn;

  const bvs = { ...bvsIn };

  // leukemic growth
  bvs.nonAggressiveLeukemiaCells *= 1.01;
  bvs.aggressiveLeukemiaCells *= 1.005;

  // leukemic cells kill normal ones
  bvs.redBloodCells = Math.max(
    0,
    bvs.redBloodCells - bvs.aggressiveLeukemiaCells * 0.2
  );
  bvs.whiteBloodCells = Math.max(
    0,
    bvs.whiteBloodCells - bvs.aggressiveLeukemiaCells * 0.2
  );
  bvs.thrombocytes = Math.max(
    0,
    bvs.thrombocytes - bvs.aggressiveLeukemiaCells * 0.2
  );

  let checkRefs = checkNormalVals(bvs);

  // administer drugs
  console.log({ treatmentCourse, timePassed });
  const index = treatmentCourse.findIndex((i) => i.atTime === timePassed);
  if (index !== -1) {
    console.log(`drug administered at ${timePassed}`);
    bvs.drug = {
      type: treatmentCourse[index].drug,
      introductionTime: timePassed,
    };
  }

  handleDrugAction(bvs, timePassed);
  normalizeBloodCells(bvs, checkRefs);

  checkRefs = checkNormalVals(bvs);
  handleCriticalCondition(bvs, checkRefs, timePassed);

  return bvs;
}
