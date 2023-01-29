import { BloodValues, generateHalthyBloodValues, checkNormalVals } from './initHealthy';

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

  return bvs;
}

