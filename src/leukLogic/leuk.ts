import {
  PatientState,
  generateHalthyBloodValues,
  checkNormalVals,
  Drug,
  BloodValueRefs,
  AVG_DOSE,
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
  // switch (drug) {
  //   case "Alexan":
  //     return drugActions[0].wareOffTime;
  //   case "Oncaspar":
  //     return drugActions[1].wareOffTime;
  //   case "Methotrexate":
  //     return drugActions[2].wareOffTime;
  //   case "Mercaptopurine":
  //     return drugActions[3].wareOffTime;
  //   default:
  //     throw new Error("Unknown drug");
  // }
}

function handleOrganDamage(bvs: PatientState, drugAction: DrugAction) {
  bvs.heartHealth -= drugAction.heartDamage;
  bvs.liverHealth -= drugAction.liverDamage;
  bvs.kidneyHealth -= drugAction.kidneyDamage;

  // cap negative values at 0
  bvs.heartHealth *= bvs.heartHealth < 0 ? 0 : 1;
  bvs.liverHealth *= bvs.liverHealth < 0 ? 0 : 1;
  bvs.kidneyHealth *= bvs.kidneyHealth < 0 ? 0 : 1;
  if (bvs.heartHealth <= 0 || bvs.liverHealth <= 0 || bvs.kidneyHealth <= 0) {
    bvs.alive = false;
  }
}

// modifies bvs
function handleDrugAction(
  bvs: PatientState,
  timePassed: number,
  drugActions: Map<Drug,DrugAction>,
) {
  for (let n = 0; n < bvs.drugs.length; n++) {
    const drug = bvs.drugs[n];
    let resistance = bvs.resistance.find(i => i.drug === drug.type);
    // first time drug is detected befere we consire it's ware-off period
    let firstItter = false;
    const avgDose = AVG_DOSE.get(drug.type);
    if (avgDose === undefined) throw new Error("ITTER: DRUG encounters: drug not listed");
    if (resistance === undefined) {
      resistance = {
        drug: drug.type,
        resistance: false,
        encounters: drug.doseMg / avgDose,
        countStarted: true,
      };
      bvs.resistance.push(resistance);
      firstItter = true;
    } else if (!resistance.countStarted) {
      const avgDose = AVG_DOSE.get(drug.type);
      if (avgDose === undefined) throw new Error("ITTER: DRUG encounters: drug not listed");
      resistance.encounters += drug.doseMg / avgDose;
      resistance.countStarted = true;
      firstItter = true;
    }
  
    // handle drug wareoff
    const drugName = drug.type;
    // const drugIndex = drugActions.findIndex((drug) => drug.name === drugName);
    // if (drugIndex === -1) throw new Error("Unknown drug used");
    const drugAction = drugActions.get(drugName);
    if (drugAction === undefined) throw new Error("Itter error: drug's action not listed");
  
    const encounterToResistance = drugAction.encounterToResistance;

    if (firstItter) {
      handleOrganDamage(bvs, drugAction);
    }
  
    if (resistance !== undefined
      && !resistance.resistance
      && encounterToResistance < Math.round(resistance.encounters)) {
      resistance.resistance = true;
    }
  
    const wareOffTime = drugAction.wareOffTime; // getDrugWareOffTime(bvs.drug.type);

    const doseFactor = drug.doseMg / drugAction.avgDose;

    const t0 = drug.introductionTime;
    const t1 = timePassed;
    const d = t1 - t0;
  
    if (d >= wareOffTime) {
      resistance.countStarted = false;
      bvs.drugs.splice(n, 1);
    }
  
    // handle drug action
    bvs.redBloodCells *= 1 - drugAction.killFactor.redbloodcells * doseFactor;
    bvs.whiteBloodCells *= 1 - drugAction.killFactor.whitebloodcells * doseFactor;
    bvs.thrombocytes *= 1 - drugAction.killFactor.thrombocytes * doseFactor;
    bvs.stemCells *= 1 - drugAction.killFactor.stemCells * doseFactor;
  
    if (!resistance.resistance) {
      bvs.aggressiveLeukemiaCells *=
        1 - drugAction.killFactor.aggressiveleukemiacells * doseFactor;
      bvs.nonAggressiveLeukemiaCells *=
        1 - drugAction.killFactor.nonAggressiveLeukemiaCells * doseFactor;
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
  // bvs.stemCells *=
  //   1 + normalFactor(checkRefs.stemCells) * normalizationFactor.stemCells;
}

function handleCriticalCondition(
  bvs: PatientState,
  checkRefs: BloodValueRefs,
  timePassed: number,
  criticalTime: number
) {
  const hasCritical = !Object.values(checkRefs).every((v) => Math.abs(v) <= 1);

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
};

export type NormalizationFactor = {
  redBloodCells: number;
  whiteBloodCells: number;
  thrombocytes: number;
  stemCells: number;
};

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

  // normal cells die
  bvs.whiteBloodCells *= 0.999;
  bvs.redBloodCells *= 0.999;
  bvs.thrombocytes *= 0.999;
  bvs.aggressiveLeukemiaCells *= 0.999;
  bvs.nonAggressiveLeukemiaCells *= 0.999;

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
    });
  }

  handleDrugAction(bvs, timePassed, parameters.drugActions);
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
