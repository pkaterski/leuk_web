export const DRUGS = [
  "Mercaptopurine",
  "Oncaspar",
  "Methotrexate",
  "Alexan",
  "Vincristine",
  "Farmorubicin",
  "Endoxan",
  "Urbason",
  "Imatinib",
  "Nilotinib",
] as const;
export type Drug = typeof DRUGS[number];

export const NORMAL_REFERENCES = {
   // todo change - these are with 6-Mercaptopurine in mind
  whiteBloodCells: {
    high: 6000,
    low: 2000,
  },
  redBloodCells: {
    high: 6100000,
    low: 4700000,
  },
  thrombocytes: {
    high: 450000,
    low: 150000,
  },
  stemCells: {
    high: 200000,
    low: 50000,
  },
};

type privateRefCellType = "whiteBloodCells"
  | "redBloodCells"
  | "thrombocytes"
  | "stemCells";

const getRef = (refType: privateRefCellType) => {
  return NORMAL_REFERENCES[refType];
};

export type PatientState = {
  whiteBloodCells: number;
  redBloodCells: number;
  thrombocytes: number;
  aggressiveLeukemiaCells: number;
  nonAggressiveLeukemiaCells: number;
  stemCells: number;
  drugs: { type: Drug; introductionTime: number, doseMg: number; countStarted: boolean; }[];
  resistance: {
      drug: Drug;
      resistance: boolean;
      encounters: number;
  }[];
  heartHealth: number; // number between 0 - 100
  liverHealth: number;
  kidneyHealth: number;
  neurologicalHealth: number;
  endocrinologicalHealth: number;
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
  neurologicalHealth: 100,
  endocrinologicalHealth: 100,
  alive: true,
  criticalTimeStart: null,
};

const initNormalBloodVals = (bvsIn: PatientState) => {
  const bvs = { ...bvsIn };
  const r = Math.random;

  const wbcRef = getRef("whiteBloodCells");
  const rbcRef = getRef("redBloodCells");
  const tRef = getRef("thrombocytes");
  const stemRef = getRef("stemCells");

  const wbc = Math.floor(r() * (wbcRef.high - wbcRef.low) + wbcRef.low);
  const rbc = Math.floor(r() * (rbcRef.high - rbcRef.low) + rbcRef.low);
  const t = Math.floor(r() * (tRef.high - tRef.low) + tRef.low);

  const stemCells = Math.floor(r() * (stemRef.high - stemRef.low) + stemRef.low);

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

  const wbcRef = getRef("whiteBloodCells");
  res.whiteBloodCells =
    -(bvs.whiteBloodCells - (wbcRef.high + wbcRef.low) / 2) / ((wbcRef.high - wbcRef.low) / 2)

  const rbcRef = getRef("redBloodCells");
  res.redBloodCells =
    -(bvs.redBloodCells - (rbcRef.high + rbcRef.low) / 2) / ((rbcRef.high - 4700000) / 2)
  
  const tRef = getRef("thrombocytes");
  res.thrombocytes =
    -(bvs.thrombocytes - (tRef.high + tRef.low) / 2) / ((tRef.high - 150000) / 2)

  const stemRef = getRef("stemCells");
  res.stemCells =
    -(bvs.stemCells - (stemRef.high + stemRef.low) / 2) / ((stemRef.high - stemRef.low) / 2)

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
