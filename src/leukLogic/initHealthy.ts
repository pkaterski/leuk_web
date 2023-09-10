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
  drugs: { type: Drug; introductionTime: number }[];
  resistance: {
      drug: Drug,
      resistance: boolean,
      encounters: number,
      countStarted: boolean,
  }[];
  heartHealth: number; // number between 0 - 100
  liverHealth: number;
  kidneyHealth: number;
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
  drugs: [],
  resistance: [],
  heartHealth: 100,
  liverHealth: 100,
  kidneyHealth: 100,
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

// export type RefValue = "normal" | "high" | "low";

export type BloodValueRefs = {
  whiteBloodCells: number; // RefValue;
  redBloodCells: number; // RefValue;
  thrombocytes: number; // RefValue;
  stemCells: number; // RefValue;
};

export const checkNormalVals = (bvs: PatientState): BloodValueRefs => {
  // 0 -> normal
  // < 0 low
  // > 0 high
  const res: BloodValueRefs = {
    whiteBloodCells: 0,
    redBloodCells: 0,
    thrombocytes: 0,
    stemCells: 0,
  };

  res.whiteBloodCells =
    -(bvs.whiteBloodCells - (11000 + 4500) / 2) / ((11000 - 4500) / 2)

  res.redBloodCells =
    -(bvs.redBloodCells - (6100000 + 4700000) / 2) / ((6100000 - 4700000) / 2)
  
  res.thrombocytes =
    -(bvs.thrombocytes - (450000 + 150000) / 2) / ((450000 - 150000) / 2)

  res.stemCells =
    -(bvs.stemCells - (200000 + 50000) / 2) / ((200000 - 50000) / 2)

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
