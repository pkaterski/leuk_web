import { initSimParams } from "../src/initParams";
import { PatientState } from "../src/leukLogic/initHealthy";
import { beginBVs, handleIter } from "../src/leukLogic/leuk";

import * as fs from 'fs'
import { TreatmentCourse } from "../src/leukLogic/treatment";

const DAYS_TO_MS = 1000

let treatmentCourse: TreatmentCourse[] = [
  {
    drug: "Alexan",
    atTime: 1 * DAYS_TO_MS,
    doseMg: 75
  },
  {
    drug: "Alexan",
    atTime: 2 * DAYS_TO_MS,
    doseMg: 75
  },
  {
    drug: "Alexan",
    atTime: 3 * DAYS_TO_MS,
    doseMg: 75
  },
  {
    drug: "Alexan",
    atTime: 4 * DAYS_TO_MS,
    doseMg: 75
  },
  {
    drug: "Alexan",
    atTime: 8 * DAYS_TO_MS,
    doseMg: 75
  },
  {
    drug: "Alexan",
    atTime: 9 * DAYS_TO_MS,
    doseMg: 75
  },
  {
    drug: "Alexan",
    atTime: 10 * DAYS_TO_MS,
    doseMg: 75
  },
  {
    drug: "Alexan",
    atTime: 11 * DAYS_TO_MS,
    doseMg: 75
  },
]

const TIME_INTERVAL = 100 // ms

let bvss: PatientState[] = []
let ts: number[] = []
let currentTime = 0
let currentBvs = beginBVs

for (let i = 0; i < 500; i++) {
  currentTime = i * TIME_INTERVAL
  const result = handleIter(currentBvs, currentTime, treatmentCourse, initSimParams)
  currentBvs = result

  bvss.push(result)
  ts.push(currentTime)
}

let data = ''
data += bvss.map(bvs => bvs.whiteBloodCells + bvs.aggressiveLeukemiaCells + bvs.nonAggressiveLeukemiaCells).join(',')
data += '\n'
data += bvss.map(bvs => bvs.whiteBloodCells).join(',')
data += '\n'
data += bvss.map(bvs => bvs.stemCells).join(',')
data += '\n'
data += bvss.map(bvs => bvs.aggressiveLeukemiaCells).join(',')
data += '\n'
data += bvss.map(bvs => bvs.nonAggressiveLeukemiaCells).join(',')
data += '\n'

fs.writeFileSync('out/test.csv', data)