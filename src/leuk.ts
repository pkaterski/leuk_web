import { BloodValues, generateHalthyBloodValues, checkNormalVals, Drug } from './initHealthy';

export { checkNormalVals };

const initBVs: BloodValues = generateHalthyBloodValues();

function introduceLeukemia(bvsIn: BloodValues): BloodValues {
  const bvs = { ...bvsIn };

  const amtToAdd = 1 * 10 ** 3;

  bvs.aggressiveLeukemiaCells += amtToAdd;
  bvs.nonAggressiveLeukemiaCells += amtToAdd;


  return bvs
}

export const beginBVs = introduceLeukemia(initBVs);

export const CRITICAL_TIME = 30000;

function criticalValues(bvs: BloodValues): Boolean {
  const check = Object.values(checkNormalVals(bvs));
  return !check.every(Boolean);
}

export function getDrugWareOffTime(drug: Drug): number {
  switch (drug) {
    case "Alexan": return 10000;
    case "Oncaspar": return 15000;
    case "Methotrexate": return 15000;
    case "Mercaptopurine": return 15000;
    default: return 0;
  }
}

export function handleIter(bvsIn: BloodValues, timePassed: number): BloodValues {
  if (!bvsIn.alive)
    return bvsIn;

  const bvs = { ...bvsIn };

  // leukemic growth
  bvs.nonAggressiveLeukemiaCells *= 1.01;
  bvs.aggressiveLeukemiaCells *= 1.005;

  // leukemic cells kill normal ones
  bvs.redBloodCells = Math.max(0, bvs.redBloodCells - bvs.aggressiveLeukemiaCells * 0.2);
  bvs.whiteBloodCells = Math.max(0, bvs.whiteBloodCells - bvs.aggressiveLeukemiaCells * 0.2);
  bvs.thrombocytes = Math.max(0, bvs.thrombocytes - bvs.aggressiveLeukemiaCells * 0.2);

  if (bvs.criticalTimeStart === null) {
    if (criticalValues(bvs))
      bvs.criticalTimeStart = timePassed;
  } else if (timePassed - bvs.criticalTimeStart > CRITICAL_TIME) {
    bvs.alive = false;
  }

  // handle drug wareoff
  if (bvs.drug !== null) {
    const wareOffTime = getDrugWareOffTime(bvs.drug.type);

    const t0 = bvs.drug.introductionTime;
    const t1 = timePassed;
    const d = t1 - t0;

    if (d >= wareOffTime) {
      bvs.drug = null;
    }
  }

  return bvs;
}

