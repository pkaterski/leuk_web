import {
  PatientState,
  generateHalthyBloodValues,
  checkNormalVals,
  Drug,
  RefValue,
  BloodValueRefs,
} from "./initHealthy";
import { TreatmentCourse } from "./treatment";

export { checkNormalVals };

const initBVs: PatientState = generateHalthyBloodValues();

function introduceLeukemia(bvsIn: PatientState): PatientState {
  const bvs = { ...bvsIn };
  return bvsIn;

  const amtToAdd = 1 * 10 ** 3;

  bvs.aggressiveLeukemiaCells += amtToAdd;
  bvs.nonAggressiveLeukemiaCells += amtToAdd;

  return bvs;
}

export const beginBVs = introduceLeukemia(initBVs);

// export const CRITICAL_TIME = 30000;

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
function handleDrugAction(
  bvs: PatientState,
  timePassed: number,
  drugActions: DrugAction[]
) {
  // handle drug wareoff
  if (bvs.drug !== null) {
    const drugName = bvs.drug.type;
    const drugIndex = drugActions.findIndex((drug) => drug.name === drugName);
    if (drugIndex === -1) throw new Error("Unknown drug used");

    const wareOffTime = drugActions[drugIndex].wareOffTime; // getDrugWareOffTime(bvs.drug.type);

    const t0 = bvs.drug.introductionTime;
    const t1 = timePassed;
    const d = t1 - t0;

    if (d >= wareOffTime) {
      bvs.drug = null;
    }

    // handle drug action
    bvs.redBloodCells *= 1 - drugActions[drugIndex].killFactor.redbloodcells;
    bvs.whiteBloodCells *= 1 - drugActions[drugIndex].killFactor.whitebloodcells;
    bvs.thrombocytes *= 1 - drugActions[drugIndex].killFactor.thrombocytes;
    bvs.stemCells *= 1 - drugActions[drugIndex].killFactor.stemCells;
    bvs.aggressiveLeukemiaCells *=
      1 - drugActions[drugIndex].killFactor.aggressiveleukemiacells;
    bvs.nonAggressiveLeukemiaCells *=
      1 - drugActions[drugIndex].killFactor.nonAggressiveLeukemiaCells;
  }
}

function normalizeBloodCells(
  bvs: PatientState,
  checkRefs: BloodValueRefs,
  normalizationFactor: NormalizationFactor
) {
  const stemCellFactor = bvs.stemCells / 125000; // middle of refs 50000 - 200000

  const normalFactor = (r: RefValue) => (r == "high" ? -1 : r == "low" ? 1 : 0);

  bvs.redBloodCells +=
    normalFactor(checkRefs.redBloodCells)
    * normalizationFactor.redBloodCells
    * stemCellFactor;

  bvs.whiteBloodCells +=
    normalFactor(checkRefs.whiteBloodCells)
    * normalizationFactor.whiteBloodCells
    * stemCellFactor;

  bvs.thrombocytes +=
    normalFactor(checkRefs.thrombocytes)
    * normalizationFactor.thrombocytes
    * stemCellFactor;

  bvs.stemCells +=
    normalFactor(checkRefs.stemCells) * normalizationFactor.stemCells;
}

function handleCriticalCondition(
  bvs: PatientState,
  checkRefs: BloodValueRefs,
  timePassed: number,
  criticalTime: number
) {
  const hasCritical = !Object.values(checkRefs).every((v) => v === "normal");

  if (bvs.criticalTimeStart === null) {
    if (hasCritical) bvs.criticalTimeStart = timePassed;
  } else {
    if (!hasCritical) bvs.criticalTimeStart = null;
    else if (timePassed - bvs.criticalTimeStart > criticalTime)
      bvs.alive = false;
  }
}

export type DrugAction = {
  name: Drug;
  wareOffTime: number;
  killFactor: {
    redbloodcells: number;
    whitebloodcells: number;
    thrombocytes: number;
    stemCells: number;
    aggressiveleukemiacells: number;
    nonAggressiveLeukemiaCells: number;
  };
};

export type NormalizationFactor = {
  redBloodCells: number;
  whiteBloodCells: number;
  thrombocytes: number;
  stemCells: number;
};

export type SimulationParameters = {
  growthFactors: {
    leukemicAggressive: number;
    leukemicNonAggressive: number;
  };
  leukemicKillFactor: {
    redBloodCells: number;
    whiteBloodCells: number;
    thrombocytes: number;
    stemCells: number;
  };
  drugActions: DrugAction[];
  normalizationFactor: NormalizationFactor;
  criticalTime: number;
};

export function handleIter(
  bvsIn: PatientState,
  timePassed: number,
  treatmentCourse: TreatmentCourse[] = [],
  parameters: SimulationParameters
): PatientState {
  if (!bvsIn.alive) return bvsIn;

  const bvs = { ...bvsIn };

  // normal cells die
  bvs.whiteBloodCells *= 0.999;
  bvs.redBloodCells *= 0.999;
  bvs.thrombocytes *= 0.999;
  bvs.aggressiveLeukemiaCells *= 0.999;
  bvs.nonAggressiveLeukemiaCells *= 0.999;

  // leukemic growth
  bvs.nonAggressiveLeukemiaCells *=
    parameters.growthFactors.leukemicNonAggressive;
  bvs.aggressiveLeukemiaCells *= parameters.growthFactors.leukemicAggressive;

  // leukemic cells kill normal ones
  bvs.redBloodCells = Math.max(
    0,
    bvs.redBloodCells -
      bvs.aggressiveLeukemiaCells * parameters.leukemicKillFactor.redBloodCells // 0.2
  );
  bvs.whiteBloodCells = Math.max(
    0,
    bvs.whiteBloodCells -
      bvs.aggressiveLeukemiaCells *
        parameters.leukemicKillFactor.whiteBloodCells // 0.2
  );
  bvs.thrombocytes = Math.max(
    0,
    bvs.thrombocytes -
      bvs.aggressiveLeukemiaCells * parameters.leukemicKillFactor.thrombocytes // 0.2
  );
  bvs.stemCells = Math.max(
    0,
    bvs.stemCells -
      bvs.aggressiveLeukemiaCells * parameters.leukemicKillFactor.stemCells
  );

  let checkRefs = checkNormalVals(bvs);

  // administer drugs
  const index = treatmentCourse.findIndex((i) => i.atTime === timePassed);
  if (index !== -1) {
    console.log(`drug administered at ${timePassed}`);
    bvs.drug = {
      type: treatmentCourse[index].drug,
      introductionTime: timePassed,
    };
  }

  handleDrugAction(bvs, timePassed, parameters.drugActions);
  normalizeBloodCells(bvs, checkRefs, parameters.normalizationFactor);

  checkRefs = checkNormalVals(bvs);
  handleCriticalCondition(bvs, checkRefs, timePassed, parameters.criticalTime);

  // only use whole numbers as values
  bvs.whiteBloodCells = Math.floor(bvs.whiteBloodCells)
  bvs.redBloodCells = Math.floor(bvs.redBloodCells)
  bvs.thrombocytes = Math.floor(bvs.thrombocytes)
  bvs.aggressiveLeukemiaCells = Math.floor(bvs.aggressiveLeukemiaCells)
  bvs.nonAggressiveLeukemiaCells = Math.floor(bvs.nonAggressiveLeukemiaCells)

  bvs.stemCells = Math.floor(bvs.stemCells)

  return bvs;
}
