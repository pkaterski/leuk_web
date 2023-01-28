export const DRUGS = ["none", "Mercaptopurine", "Oncaspar", "Methotrexate", "Alexan"] as const;
export type Drug = typeof DRUGS[number];

export type BloodValues = {
  whiteBloodCells: number,
  redBloodCells: number,
  thrombocytes: number,
  aggressiveLeukemiaCells: number,
  nonAggressiveLeukemiaCells: number,
  drug: Drug,
  alive: Boolean,
  criticalTimeStart: number | null,
}

const bloodValuesZero: BloodValues = {
  whiteBloodCells: 0, // 4,500 to 11,000 WBCs per microliter
  redBloodCells: 0,   // 4.7 to 6.1 million cells per microliter
  thrombocytes: 0,    // 150,000 to 450,000 platelets per microliter
  aggressiveLeukemiaCells: 0,
  nonAggressiveLeukemiaCells: 0,
  drug: "none",
  alive: true,
  criticalTimeStart: null,
}

const initNormalBloodVals = (bvsIn: BloodValues) => {
  const bvs = { ...bvsIn };
  const r = Math.random;

  const wbc = (r() * (11 - 4.5) + 4.5) * 10 ** 3;
  const rbc = (r() * (6.1 - 4.7) + 4.7) * 10 ** 6;
  const t = (r() * (4.5 - 1.5) + 1.5) * 10 ** 5;

  bvs.whiteBloodCells = wbc;
  bvs.redBloodCells = rbc;
  bvs.thrombocytes = t;

  return bvs;
}

export const checkNormalVals = (bvs: BloodValues) => {
  const res = {
    whiteBloodCells: false,
    redBloodCells: false,
    thrombocytes: false
  };

  if (bvs.whiteBloodCells >= 4500 && bvs.whiteBloodCells <= 11000)
    res.whiteBloodCells = true;
  if (bvs.redBloodCells >= 4700000 && bvs.redBloodCells <= 6100000)
    res.redBloodCells = true;
  if (bvs.thrombocytes >= 150000 && bvs.thrombocytes <= 450000)
    res.thrombocytes = true;

  return res;
}

export const generateHalthyBloodValues: () => BloodValues = () => {
  // generate blood values within normal range
  const vals = initNormalBloodVals(bloodValuesZero)

  // initiate empty leukemic cells
  vals.aggressiveLeukemiaCells = 0;
  vals.nonAggressiveLeukemiaCells = 0;

  return vals;
}

//
// for (let i = 0; i < 10000; i++) {
//   const bvs = initNormalBloodVals(bloodValuesZero)
//   const checkBvs = checkNormalVals(bvs)
//   const vals = Object.values(checkBvs)
//   if (!vals.every(p => p)) {
//     log(vals)
//   }
// }
