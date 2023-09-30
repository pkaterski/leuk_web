import { SimulationParameters, beginBVs } from "./leukLogic/leuk";

export const initSimParams: SimulationParameters = {
  initialConditions: {
    redBloodCells: beginBVs.redBloodCells,
    whiteBloodCells: beginBVs.whiteBloodCells,
    thrombocytes: beginBVs.thrombocytes,
    stemCells: beginBVs.stemCells,
    leukemicAggressive: beginBVs.aggressiveLeukemiaCells,
    leukemicNonAggressive: beginBVs.nonAggressiveLeukemiaCells,
  },
  growthFactors: {
    leukemicAggressive: 1.01,
    leukemicNonAggressive: 1.005,
  },
  conversionFactors: {
    leukemicAggressiveToNonAggressive: 0.005,
    leukemicNonAggressiveToAggressive: 0.005,
  },
  leukemicKillFactor: {
    redBloodCells: 0.01,
    whiteBloodCells: 0.01,
    thrombocytes: 0.01,
    stemCells: 0.01,
  },
  tpmtGene: "TPMT*1/*1",
  drugActions: new Map([
    [
      "Alexan",
      {
        wareOffTime: 3500,
        encounterToResistance: 20,
        killFactor: {
          redbloodcells: 0.02,
          whitebloodcells: 0.01,
          thrombocytes: 0.02,
          stemCells: 0.007,
          aggressiveleukemiacells: 0.04,
          nonAggressiveLeukemiaCells: 0.02,
        },
        avgDose: 75,
        liverDamage: 3,
        heartDamage: 0,
        kidneyDamage: 0,
        neurologicalDamage: 0,
        endocrinologicalDamage: 0,
      }
    ],
    [
      "Oncaspar",
      {
        wareOffTime: 1000,
        encounterToResistance: 8,
        killFactor: {
          redbloodcells: 0.2,
          whitebloodcells: 0.2,
          thrombocytes: 0.2,
          stemCells: 0.2,
          aggressiveleukemiacells: 0.2,
          nonAggressiveLeukemiaCells: 0.2,
        },
        avgDose: 2500,
        liverDamage: 0,
        heartDamage: 0,
        kidneyDamage: 0,
        neurologicalDamage: 0,
        endocrinologicalDamage: 0,
      }
    ],
    [
      "Methotrexate",
      {
        wareOffTime: 1000,
        encounterToResistance: 8,
        killFactor: {
          redbloodcells: 0.2,
          whitebloodcells: 0.2,
          thrombocytes: 0.2,
          stemCells: 0.2,
          aggressiveleukemiacells: 0.2,
          nonAggressiveLeukemiaCells: 0.2,
        },
        avgDose: 5000,
        liverDamage: 0,
        heartDamage: 0,
        kidneyDamage: 0,
        neurologicalDamage: 0,
        endocrinologicalDamage: 0,
      }
    ],
    [
      "Mercaptopurine",
      {
        wareOffTime: 1000,
        encounterToResistance: 8,
        killFactor: {
          redbloodcells: 0.2,
          whitebloodcells: 0.2,
          thrombocytes: 0.2,
          stemCells: 0.2,
          aggressiveleukemiacells: 0.2,
          nonAggressiveLeukemiaCells: 0.2,
        },
        avgDose: 50,
        liverDamage: 0,
        heartDamage: 0,
        kidneyDamage: 0,
        neurologicalDamage: 0,
        endocrinologicalDamage: 0,
      }
    ],
    [
      "Vincristine",
      {
        wareOffTime: 1000,
        encounterToResistance: 8,
        killFactor: {
          redbloodcells: 0.2,
          whitebloodcells: 0.2,
          thrombocytes: 0.2,
          stemCells: 0.2,
          aggressiveleukemiacells: 0.2,
          nonAggressiveLeukemiaCells: 0.2,
        },
        avgDose: 1.5,
        liverDamage: 0,
        heartDamage: 0,
        kidneyDamage: 0,
        neurologicalDamage: 0,
        endocrinologicalDamage: 0,
      }
    ],
    [
      "Farmorubicin",
      {
        wareOffTime: 1000,
        encounterToResistance: 8,
        killFactor: {
          redbloodcells: 0.2,
          whitebloodcells: 0.2,
          thrombocytes: 0.2,
          stemCells: 0.2,
          aggressiveleukemiacells: 0.2,
          nonAggressiveLeukemiaCells: 0.2,
        },
        avgDose: 30,
        liverDamage: 0,
        heartDamage: 0,
        kidneyDamage: 0,
        neurologicalDamage: 0,
        endocrinologicalDamage: 0,
      }
    ],
    [
      "Endoxan",
      {
        wareOffTime: 1000,
        encounterToResistance: 8,
        killFactor: {
          redbloodcells: 0.2,
          whitebloodcells: 0.2,
          thrombocytes: 0.2,
          stemCells: 0.2,
          aggressiveleukemiacells: 0.2,
          nonAggressiveLeukemiaCells: 0.2,
        },
        avgDose: 1000,
        liverDamage: 0,
        heartDamage: 0,
        kidneyDamage: 0,
        neurologicalDamage: 0,
        endocrinologicalDamage: 0,
      }
    ],
    [
      "Urbason",
      {
        wareOffTime: 1000,
        encounterToResistance: 8,
        killFactor: {
          redbloodcells: 0.2,
          whitebloodcells: 0.2,
          thrombocytes: 0.2,
          stemCells: 0.2,
          aggressiveleukemiacells: 0.2,
          nonAggressiveLeukemiaCells: 0.2,
        },
        avgDose: 60,
        liverDamage: 0,
        heartDamage: 0,
        kidneyDamage: 0,
        neurologicalDamage: 0,
        endocrinologicalDamage: 0,
      }
    ],
  ]),
  normalizationFactor: {
    redBloodCells: 235000 / 5,
    whiteBloodCells: 225 / 5 * 1.6,
    thrombocytes: 7500 / 5,
    stemCells: 2500 / 5 * 2,
  },
  criticalTime: 50000,
};
