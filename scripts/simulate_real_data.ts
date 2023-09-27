import { initSimParams } from "../src/initParams";
import { PatientState } from "../src/leukLogic/initHealthy";
import { beginBVs, handleIter } from "../src/leukLogic/leuk";

import * as fs from 'fs'
import { TreatmentCourse } from "../src/leukLogic/treatment";

function simulateRealCase(fileName: string) {
  const DAYS_TO_MS = 1000

  const inCsv = fs.readFileSync(
    `/Users/pkaterski/Desktop/leuk_data/conv/${fileName}`,
    { encoding: 'utf8', flag: 'r' },
  )
  
  const lines = inCsv.split('\n').map(l => l.split(','))
  
  const firstValue = parseFloat(lines[0][0]) * 1000
  const alexanDays = lines[1].map((i,idx) => i === 'A' ? [idx+1] : []).flat()
  const totalDays = lines[0].length
  
  
  let treatmentCourse: TreatmentCourse[] = alexanDays.map(i => {
    return {
      drug: "Alexan",
      doseMg: 75,
      atTime: (i - 1) * DAYS_TO_MS,
    }
  });
  
  const myBvs: PatientState = {
    ...beginBVs,
    whiteBloodCells: firstValue - 200,
    aggressiveLeukemiaCells: 0,
    nonAggressiveLeukemiaCells: 200,
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
  
  fs.writeFileSync(`out/test1.csv`, data)
}

const ff = 'FILE_NAME'

simulateRealCase(ff)