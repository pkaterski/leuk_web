import {
  PatientState,
  generateHalthyBloodValues,
  checkNormalVals,
  Drug,
  BloodValueRefs,
} from "./initHealthy";
import { TreatmentCourse } from "./treatment";

export { checkNormalVals };

const initBVs: PatientState = generateHalthyBloodValues();

function introduceLeukemia(bvsIn: PatientState): PatientState {
  const bvs = { ...bvsIn };
  // return bvsIn;

  const amtToAdd = 1 * 10 ** 3;

  bvs.aggressiveLeukemiaCells += amtToAdd;
  bvs.nonAggressiveLeukemiaCells += amtToAdd;

  return bvs;
}

export const beginBVs = introduceLeukemia(initBVs);

// export const CRITICAL_TIME = 30000;

export function getDrugWareOffTime(drug: Drug, drugActions: Map<Drug,DrugAction>): number {
  const result = drugActions.get(drug)?.wareOffTime;
  if (result === undefined) {
    throw new Error("Drug's action not described");
  };
  return result;
}

function handleOrganDamage(bvs: PatientState, drugAction: DrugAction, tpmtMultiplier: number) {
  bvs.heartHealth -= drugAction.heartDamage * tpmtMultiplier;
  bvs.liverHealth -= drugAction.liverDamage / tpmtMultiplier;
  bvs.kidneyHealth -= drugAction.kidneyDamage * tpmtMultiplier;
  bvs.neurologicalHealth -= drugAction.neurologicalDamage * tpmtMultiplier;
  bvs.endocrinologicalHealth -= drugAction.endocrinologicalDamage * tpmtMultiplier;

  // cap negative values at 0
  bvs.heartHealth *= bvs.heartHealth < 0 ? 0 : 1;
  bvs.liverHealth *= bvs.liverHealth < 0 ? 0 : 1;
  bvs.kidneyHealth *= bvs.kidneyHealth < 0 ? 0 : 1;
  bvs.neurologicalHealth *= bvs.neurologicalHealth < 0 ? 0 : 1;
  bvs.endocrinologicalHealth *= bvs.endocrinologicalHealth < 0 ? 0 : 1;
  if (bvs.heartHealth <= 0
    || bvs.liverHealth <= 0
    || bvs.kidneyHealth <= 0
    || bvs.neurologicalHealth <= 0
    || bvs.endocrinologicalHealth <= 0) {
    bvs.alive = false;
  }
}

// modifies bvs
function handleDrugAction(
  bvs: PatientState,
  timePassed: number,
  parameters: SimulationParameters,
) {
  const drugActions = parameters.drugActions;
  for (let n = 0; n < bvs.drugs.length; n++) {
    const drug = bvs.drugs[n];
    let resistance = bvs.resistance.find(i => i.drug === drug.type);
    // first time drug is detected befere we consire it's ware-off period
    let firstItter = false;
    const drugName = drug.type;
    const drugAction = drugActions.get(drugName);
    if (drugAction === undefined) throw new Error("Itter error: drug's action not listed");

    if (resistance === undefined) {
      resistance = {
        drug: drug.type,
        resistance: false,
        encounters: drug.doseMg / drugAction.avgDose,
      };
      bvs.resistance.push(resistance);
      drug.countStarted = true;
      firstItter = true;
    } else if (!drug.countStarted) {
      resistance.encounters += drug.doseMg / drugAction.avgDose;
      drug.countStarted = true;
      firstItter = true;
    }
  
    // handle drug wareoff  
    const encounterToResistance = drugAction.encounterToResistance;

    const tpmtMultiplier = (() => {
      if (drug.type === "Mercaptopurine") {
        if (parameters.tpmtGene === "TPMT*1/*1") {
          return 1;
        } else if (parameters.tpmtGene === "TPMT*1/*3A") {
          return 2;
        } else if (parameters.tpmtGene === "TPMT*3A/*3A") {
          return 10;
        } else {
          throw new Error("DOSE FACTOR: Unknow TPMT gene");
        }
      } else {
        return 1;
      }
    })();

    if (firstItter) {
      handleOrganDamage(bvs, drugAction, tpmtMultiplier);
    }

    if (resistance !== undefined
      && !resistance.resistance
      && encounterToResistance < Math.round(resistance.encounters * tpmtMultiplier)) {
      resistance.resistance = true;
    }
  
    const wareOffTime = drugAction.wareOffTime; // getDrugWareOffTime(bvs.drug.type);

    const doseFactor = (() => {
      const factorRatio = drug.doseMg / drugAction.avgDose;
      return factorRatio * tpmtMultiplier;
    })();

    const t0 = drug.introductionTime;
    const t1 = timePassed;
    const d = t1 - t0;
  
    if (d >= wareOffTime) {
      drug.countStarted = false; // line can be removed
      bvs.drugs.splice(n, 1);
    }
  
    // handle drug action
    bvs.redBloodCells *= 1 - Math.min(drugAction.killFactor.redbloodcells * doseFactor, 1);
    bvs.whiteBloodCells *= 1 - Math.min(drugAction.killFactor.whitebloodcells * doseFactor, 1);
    bvs.thrombocytes *= 1 - Math.min(drugAction.killFactor.thrombocytes * doseFactor, 1);
    bvs.stemCells *= 1 - Math.min(drugAction.killFactor.stemCells * doseFactor, 1);
  
    if (!resistance.resistance) {
      bvs.aggressiveLeukemiaCells *=
        1 - Math.min(drugAction.killFactor.aggressiveleukemiacells * doseFactor, 1);
      bvs.nonAggressiveLeukemiaCells *=
        1 - Math.min(drugAction.killFactor.nonAggressiveLeukemiaCells * doseFactor, 1);
    }
  }

}

function normalizeBloodCells(
  bvs: PatientState,
  checkRefs: BloodValueRefs,
  normalizationFactor: NormalizationFactor
) {
  const stemCellFactor = bvs.stemCells / 125000; // middle of refs 50000 - 200000

  // r but with threshold [-1, 1]
  const normalFactor = (r: number) => (r < -1 ? -1 : r > 1 ? 1 : r);

  const nfRBC = normalFactor(checkRefs.redBloodCells);
  const redBloodCellsAmount =
    nfRBC
    * normalizationFactor.redBloodCells;
    // * (nfRBC >= 0 ? stemCellFactor : 1);

  bvs.redBloodCells += redBloodCellsAmount;

  const nfWBC = normalFactor(checkRefs.whiteBloodCells);
  const whiteBloodCellsAmount =
  nfWBC
    * normalizationFactor.whiteBloodCells
    * (nfWBC >= 0 ? stemCellFactor : 1);

  bvs.whiteBloodCells += whiteBloodCellsAmount;

  const nfT = normalFactor(checkRefs.thrombocytes)
  const thrombocytesAmount =
    nfT
    * normalizationFactor.thrombocytes;
    // * (nfT >= 0 ? stemCellFactor : 1);

  bvs.thrombocytes += thrombocytesAmount;

  bvs.stemCells +=
    normalFactor(checkRefs.stemCells) * normalizationFactor.stemCells
    // - Math.max(redBloodCellsAmount, 0)
    // - Math.max(thrombocytesAmount, 0)
    - Math.max(whiteBloodCellsAmount, 0);
  
  bvs.stemCells = bvs.stemCells > 0 ? bvs.stemCells : 0;
  // bvs.stemCells *=
  //   1 + normalFactor(checkRefs.stemCells) * normalizationFactor.stemCells;
}

function handleCriticalCondition(
  bvs: PatientState,
  checkRefs: BloodValueRefs,
  timePassed: number,
  criticalTime: number
) {
  const hasCritical = Math.abs(checkRefs.whiteBloodCells) > 1;

  if (bvs.criticalTimeStart === null) {
    if (hasCritical) bvs.criticalTimeStart = timePassed;
  } else {
    if (!hasCritical) bvs.criticalTimeStart = null;
    else if (timePassed - bvs.criticalTimeStart > criticalTime)
      bvs.alive = false;
  }
}

export type DrugAction = {
  wareOffTime: number;
  encounterToResistance: number;
  killFactor: {
    redbloodcells: number;
    whitebloodcells: number;
    thrombocytes: number;
    stemCells: number;
    aggressiveleukemiacells: number;
    nonAggressiveLeukemiaCells: number;
  };
  avgDose: number,
  heartDamage: number;
  liverDamage: number;
  kidneyDamage: number;
  neurologicalDamage: number,
  endocrinologicalDamage: number,
};

export type NormalizationFactor = {
  redBloodCells: number;
  whiteBloodCells: number;
  thrombocytes: number;
  stemCells: number;
};

export const TpmtVals = [
  "TPMT*1/*1", "TPMT*1/*3A", "TPMT*3A/*3A"
] as const;
export type TPMT = typeof TpmtVals[number];

export type SimulationParameters = {
  initialConditions: {
    redBloodCells: number;
    whiteBloodCells: number;
    thrombocytes: number;
    stemCells: number;
    leukemicAggressive: number;
    leukemicNonAggressive: number;
  };
  growthFactors: {
    leukemicAggressive: number;
    leukemicNonAggressive: number;
  };
  conversionFactors: {
    leukemicAggressiveToNonAggressive: number;
    leukemicNonAggressiveToAggressive: number;
  };
  leukemicKillFactor: {
    redBloodCells: number;
    whiteBloodCells: number;
    thrombocytes: number;
    stemCells: number;
  };
  tpmtGene: TPMT;
  drugActions: Map<Drug,DrugAction>;
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

  // // normal cells die
  // bvs.whiteBloodCells *= 0.999;
  // bvs.redBloodCells *= 0.999;
  // bvs.thrombocytes *= 0.999;
  // bvs.aggressiveLeukemiaCells *= 0.999;
  // bvs.nonAggressiveLeukemiaCells *= 0.999;

  // leukemic growth
  if (bvs.drugs.length === 0) {
    bvs.nonAggressiveLeukemiaCells *=
      parameters.growthFactors.leukemicNonAggressive;
    bvs.aggressiveLeukemiaCells *= parameters.growthFactors.leukemicAggressive;

    // when population is low cells should devide
    if (bvs.aggressiveLeukemiaCells !== 0)
    bvs.aggressiveLeukemiaCells += 1

    if (bvs.nonAggressiveLeukemiaCells !== 0)
      bvs.nonAggressiveLeukemiaCells += 1

    if (bvs.stemCells !== 0)
      bvs.stemCells += 1
  }

  // non-aggressive can turn aggressive and vice versa
  bvs.aggressiveLeukemiaCells +=
    bvs.nonAggressiveLeukemiaCells
    * parameters.conversionFactors.leukemicNonAggressiveToAggressive;

  bvs.nonAggressiveLeukemiaCells +=
    bvs.aggressiveLeukemiaCells
    * parameters.conversionFactors.leukemicAggressiveToNonAggressive;

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
  const treatmentsToAdminister = treatmentCourse.filter((i) => i.atTime === timePassed);
  for (let treatment of treatmentsToAdminister) {
    bvs.drugs.push({
      type: treatment.drug,
      introductionTime: timePassed,
      doseMg: treatment.doseMg,
      countStarted: false,
    });
  }

  handleDrugAction(bvs, timePassed, parameters);
  normalizeBloodCells(bvs, checkRefs, parameters.normalizationFactor);

  checkRefs = checkNormalVals(bvs);
  handleCriticalCondition(bvs, checkRefs, timePassed, parameters.criticalTime);

  bvsMakeWhole(bvs);

  return bvs;
}

function bvsMakeWhole(bvs: PatientState) {
    // only use whole numbers as values
    bvs.whiteBloodCells = Math.floor(bvs.whiteBloodCells);
    bvs.redBloodCells = Math.floor(bvs.redBloodCells);
    bvs.thrombocytes = Math.floor(bvs.thrombocytes);
    bvs.aggressiveLeukemiaCells = Math.floor(bvs.aggressiveLeukemiaCells);
    bvs.nonAggressiveLeukemiaCells = Math.floor(bvs.nonAggressiveLeukemiaCells);
    bvs.stemCells = Math.floor(bvs.stemCells);
}
