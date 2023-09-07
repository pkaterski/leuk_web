export const DRUGS = [
  "Mercaptopurine",
  "Oncaspar",
  "Methotrexate",
  "Alexan",
] as const;
export type Drug = typeof DRUGS[number];

export type PatientState = {
  whiteBloodCells: number;
  redBloodCells: number;
  thrombocytes: number;
  aggressiveLeukemiaCells: number;
  nonAggressiveLeukemiaCells: number;
  stemCells: number;
  drug: { type: Drug; introductionTime: number } | null;
  alive: Boolean;
  criticalTimeStart: number | null;
};

const bloodValuesZero: PatientState = {
  whiteBloodCells: 0, // 4,500 to 11,000 WBCs per microliter
  redBloodCells: 0, // 4.7 to 6.1 million cells per microliter
  thrombocytes: 0, // 150,000 to 450,000 platelets per microliter
  stemCells: 0,
  aggressiveLeukemiaCells: 0,
  nonAggressiveLeukemiaCells: 0,
  drug: null,
  alive: true,
  criticalTimeStart: null,
};

const initNormalBloodVals = (bvsIn: PatientState) => {
  const bvs = { ...bvsIn };
  const r = Math.random;

  const wbc = (r() * (11 - 4.5) + 4.5) * 10 ** 3;
  const rbc = (r() * (6.1 - 4.7) + 4.7) * 10 ** 6;
  const t = (r() * (4.5 - 1.5) + 1.5) * 10 ** 5;

  const stemCells = (r() * (20 - 5) + 5) * 10 ** 4;

  bvs.whiteBloodCells = wbc;
  bvs.redBloodCells = rbc;
  bvs.thrombocytes = t;

  bvs.stemCells = stemCells;

  return bvs;
};

export type RefValue = "normal" | "high" | "low";

export type BloodValueRefs = {
  whiteBloodCells: RefValue;
  redBloodCells: RefValue;
  thrombocytes: RefValue;
  stemCells: RefValue;
};

export const checkNormalVals = (bvs: PatientState): BloodValueRefs => {
  const res: BloodValueRefs = {
    whiteBloodCells: "normal",
    redBloodCells: "normal",
    thrombocytes: "normal",
    stemCells: "normal",
  };

  if (bvs.whiteBloodCells < 4500) {
    res.whiteBloodCells = "low";
  } else if (bvs.whiteBloodCells > 11000) {
    res.whiteBloodCells = "high";
  }

  if (bvs.redBloodCells < 4700000) {
    res.redBloodCells = "low";
  } else if (bvs.redBloodCells > 6100000) {
    res.redBloodCells = "high";
  }

  if (bvs.thrombocytes < 150000) {
    res.thrombocytes = "low";
  } else if (bvs.thrombocytes > 450000) {
    res.thrombocytes = "high";
  }

  if (bvs.stemCells < 50000) {
    res.stemCells = "low";
  } else if (bvs.stemCells > 200000) {
    res.stemCells = "high";
  }

  return res;
};

export const generateHalthyBloodValues: () => PatientState = () => {
  // generate blood values within normal range
  const vals = initNormalBloodVals(bloodValuesZero);

  // initiate empty leukemic cells
  vals.aggressiveLeukemiaCells = 0;
  vals.nonAggressiveLeukemiaCells = 0;

  return vals;
};
