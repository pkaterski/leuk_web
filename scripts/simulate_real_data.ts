import { initSimParams } from "../src/initParams";
import { PatientState } from "../src/leukLogic/initHealthy";
import { beginBVs, handleIter } from "../src/leukLogic/leuk";

import * as fs from 'fs'
import { TreatmentCourse } from "../src/leukLogic/treatment";

function simulateRealCase(fileName: string) {
  const DAYS_TO_MS = 1000

  const inCsv = fs.readFileSync(
    `/Users/pkaterski/Desktop/leuk_data/conv_just_nums/${fileName}`,
    { encoding: 'utf8', flag: 'r' },
  )
  
  const lines = inCsv.split('\n').map(l => l.split(','))
  
  const firstValue = parseFloat(lines[0][0]) * 1000
  const alexanDays = lines[1].map((i,idx) => i === 'A' ? [idx+1] : []).flat()
  const dataDays = lines[0].map((i,idx) => i !== '' ? [idx+1] : []).flat()
  const totalDays = Math.max(alexanDays.slice(-1)[0], dataDays.slice(-1)[0])
  
  
  let treatmentCourse: TreatmentCourse[] = alexanDays.map(i => {
    return {
      drug: "Alexan",
      doseMg: 75,
      atTime: (i - 1) * DAYS_TO_MS,
    }
  });

  const initLeukemiaCells = 200
  
  const myBvs: PatientState = {
    ...beginBVs,
    whiteBloodCells: firstValue - initLeukemiaCells,
    aggressiveLeukemiaCells: 0,
    nonAggressiveLeukemiaCells: initLeukemiaCells,
    stemCells: 125000,
  }
  
  // process.exit()
  
  const TIME_INTERVAL = 100 // ms
  
  let bvss: PatientState[] = []
  let ts: number[] = []
  let currentTime = 0
  let currentBvs = myBvs
  bvss.push(currentBvs)
  ts.push(currentTime)
  
  for (let i = 0; i < totalDays * 10 - 9; i++) {
    const result = handleIter(currentBvs, currentTime, treatmentCourse, initSimParams)
  
    currentTime += TIME_INTERVAL
  
    currentBvs = result
  
    bvss.push(result)
    ts.push(currentTime)
  }
  
  let data = ''
  data += ts.map(t => t / DAYS_TO_MS + 1).join(',')
  data += '\n'
  data += bvss.map(bvs => (bvs.whiteBloodCells + bvs.aggressiveLeukemiaCells + bvs.nonAggressiveLeukemiaCells) / 1000).join(',')
  data += '\n'
  data += ts.map(t => treatmentCourse.findIndex(c => c.atTime === t) !== -1 ? 'A' : '').join(',')
  data += '\n'

  const endBvss = bvss.slice(-1)[0]
  const leukemiaCells = endBvss.aggressiveLeukemiaCells + endBvss.nonAggressiveLeukemiaCells
  console.log('-------------------------')
  console.log(`leukemia cells at end: ${leukemiaCells}`)
  console.log('-------------------------')
  
  fs.writeFileSync(`out/test1.csv`, data)
}

const ff = process.argv[2]

simulateRealCase(ff)