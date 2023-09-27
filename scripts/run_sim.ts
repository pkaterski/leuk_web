import { initSimParams } from "../src/initParams";
import { PatientState } from "../src/leukLogic/initHealthy";
import { beginBVs, handleIter } from "../src/leukLogic/leuk";

import * as fs from 'fs'

const TIME_INTERVAL = 100

let bvss: PatientState[] = []
let ts: number[] = []
let currentTime = 0
let currentBvs = beginBVs

for (let i = 0; i < 500; i++) {
  currentTime += i / TIME_INTERVAL
  const result = handleIter(currentBvs, currentTime, undefined, initSimParams)
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

fs.writeFileSync('test.csv', data)