import { useEffect, useRef, useState } from 'react'
import './App.css'
import { BloodValueRefs, BloodValues, checkNormalVals } from './leukLogic/initHealthy';
import { beginBVs, getDrugWareOffTime, handleIter, SimulationParameters } from './leukLogic/leuk';
import { generateEvenlySpread, TreatmentCourse } from './leukLogic/treatment';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import TreatmentCoursesMenu from './components/TreatmentCoursesPopup';
import Parameters from './components/Parameters';

const initSimParams: SimulationParameters = {
  growthFactors: {
    leukemicAggressive: 1.01,
    leukemicNonAggressive: 1.005,
  },
  leukemicKillFactor: {
    redBloodCells: 0.2,
    whiteBloodCells: 0.2,
    thrombocytes: 0.2,
  },
  drugActions: [
    {
      name: "Alexan",
      wareOffTime: 1000,
      killFactor: {
        redbloodcells: 0.8,
        whitebloodcells: 0.8,
        thrombocytes: 0.8,
        aggressiveleukemiacells: 0.6,
        nonAggressiveLeukemiaCells: 0.8,
      }
    },
    {
      name: "Oncaspar",
      wareOffTime: 15000,
      killFactor: {
        redbloodcells: 0.8,
        whitebloodcells: 0.8,
        thrombocytes: 0.8,
        aggressiveleukemiacells: 0.6,
        nonAggressiveLeukemiaCells: 0.8,
      }
    },
    {
      name: "Methotrexate",
      wareOffTime: 15000,
      killFactor: {
        redbloodcells: 0.8,
        whitebloodcells: 0.8,
        thrombocytes: 0.8,
        aggressiveleukemiacells: 0.6,
        nonAggressiveLeukemiaCells: 0.8,
      }
    },
    {
      name: "Mercaptopurine",
      wareOffTime: 15000,
      killFactor: {
        redbloodcells: 0.8,
        whitebloodcells: 0.8,
        thrombocytes: 0.8,
        aggressiveleukemiacells: 0.6,
        nonAggressiveLeukemiaCells: 0.8,
      }
    },
  ],
  normalizationFactor: {
    redBloodCells: 0.05,
    whiteBloodCells: 0.05,
    thrombocytes: 0.05,
  },
  criticalTime: 30000,
}

function App() {
  const TIME_INTERVAL_MS = 100;
  const [therapyCourses, setTerapyCourses] = useState<TreatmentCourse[]>(generateEvenlySpread("Alexan", 10000, 4))
  const therapyCoursesRef = useRef(therapyCourses)
  useEffect(() => {
    therapyCoursesRef.current = therapyCourses
  }, [therapyCourses])

  const [started, setStarted] = useState(false);
  const [pauseState, setPauseState] = useState(true);
  const pauseStateRef = useRef(pauseState);
  useEffect(() => {
    pauseStateRef.current = pauseState;
  }, [pauseState]);
  const [timePassed, setTimePassed] = useState(0);
  const timePassedRef = useRef(timePassed);
  useEffect(() => {
    timePassedRef.current = timePassed;
  }, [timePassed]);
  const [bvs, setBvs] = useState<BloodValues>(beginBVs);
  const bvsRef = useRef(bvs);
  useEffect(() => {
    bvsRef.current = bvs;
  }, [bvs]);
  const [areNormalVals, setAreNormalVals] = useState<BloodValueRefs>({
    whiteBloodCells: "normal",
    redBloodCells: "normal",
    thrombocytes: "normal"
  });
  const areNormalValsRef = useRef(areNormalVals);
  useEffect(() => {
    areNormalValsRef.current = areNormalVals;
  }, [areNormalVals]);
  const [drugWareOffTime, setDrugWareOffTime] = useState<number | null>(null);
  const drugWareOffTimeRef = useRef(drugWareOffTime);
  useEffect(() => {
    drugWareOffTimeRef.current = drugWareOffTime;
  }, [drugWareOffTime]);
  const [drugTimeRemaining, setDrugTimeRemaining] = useState('0');
  const [criticalTime, setCriticalTime] = useState<string | null>(null);

  const [simParams, setSimParams] = useState<SimulationParameters>(initSimParams);

  useEffect(() => {

    const intervalId = setInterval(() => {
      if (pauseStateRef.current) {
        return;
      }

      setTimePassed(t => t + TIME_INTERVAL_MS);
      setBvs(handleIter(
        bvsRef.current,
        timePassedRef.current,
        therapyCoursesRef.current,
        simParams,
      ));

      setAreNormalVals(checkNormalVals(bvsRef.current));

      if (bvsRef.current.drug !== null) {
        if (drugWareOffTimeRef.current !== null) {
          const drugTimePassed = timePassedRef.current - bvsRef.current.drug.introductionTime;
          const timeRemaining = drugWareOffTimeRef.current - drugTimePassed;
          console.log((timeRemaining / 1000).toFixed(1));
          setDrugTimeRemaining((timeRemaining / 1000).toFixed(1));
        } else {
          setDrugWareOffTime(getDrugWareOffTime(bvsRef.current.drug.type));
        }
      } else if (drugWareOffTimeRef.current !== null) {
        setDrugWareOffTime(null);
      }

      if (bvsRef.current.criticalTimeStart !== null) {
        setCriticalTime(((timePassedRef.current - bvsRef.current.criticalTimeStart) / 1000).toFixed(1) + " units")
      } else {
        setCriticalTime(null);
      }


    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  const onIntroduceAlexan = () => {
    setBvs((bvs) => {
      return { ...bvs, drug: {type: "Alexan", introductionTime: timePassed} }
    });
  };

  return (
    <div className="App">
      <div className="container">
      <h1>Leaukemia</h1>

      <h4>Blood values:</h4>

      {/* normal blood cells */}
      <ul>
        <li>
          Redbloodcells:
          <span id="red-blood-cell-count" className={areNormalVals.redBloodCells === 'normal' ? "" : "critical"}>
            {bvs.redBloodCells.toFixed()}
          </span>
        </li>
        <li>
          Whitebloodcells:
          <span id="white-blood-cell-count" className={areNormalVals.whiteBloodCells === 'normal' ? "" : "critical"}>
            {bvs.whiteBloodCells.toFixed()}
          </span>
        </li>
        <li>
          thrombocytes:
          <span id="thrombocytes-count" className={areNormalVals.thrombocytes === 'normal' ? "" : "critical"}>
            {bvs.thrombocytes.toFixed()}
          </span>
        </li>
      </ul>

      <ul>
        {/* leukemic cells */}
        <li>
          aggressive leukemia cells:
          <span id="aggressive-leukemia-cell-count">{bvs.aggressiveLeukemiaCells.toFixed()}</span>
        </li>
        <li>
          non-aggressive leukemia cells:
          <span id="non-aggressive-leukemia-cell-count">{bvs.nonAggressiveLeukemiaCells.toFixed()}</span>
        </li>
      </ul>

      <ul>
        {/* drug in action */}
        <li>
          drug in action:
          <span id="drug-in-action">
            {bvs.drug === null ? "none" : `${bvs.drug.type} (${drugTimeRemaining} s)`}
          </span>
        </li>

        {/* status */}
        <li>is alive: <span id="is-alive" className={bvs.alive ? "" : "critical"}>{bvs.alive + ''}</span></li>

        {/* metadata */}
        <li>
          (metadata) time since in critical condition:
          <span id="critical-time" className={criticalTime === null ? "" : "critical"}>
            {criticalTime !== null ? criticalTime : "0"}
          </span>
        </li>
      </ul>

      {/* buttons */}
      <button type="button" id="pause-btn" onClick={() => {setPauseState(i => !i); setStarted(true)}}>
        {!started ? "start" : pauseState ? "resume" : "pause"}
      </button>
      <button type="button" id="alexan-btn" onClick={onIntroduceAlexan}>Introduce Alexan</button>
      <br />
      <Popup trigger={<button>Therapy course</button>} modal closeOnDocumentClick={false}>
        {(close: any) => (
          <TreatmentCoursesMenu
            closeFn={close}
            initialTreatmentCourses={therapyCourses}
            onTreatmentCoursesChange={(tcs => setTerapyCourses(tcs))} />
        )}
      </Popup>
      <Popup trigger={<button>Parameters</button>} modal closeOnDocumentClick={false}>
        {(close: any) => (
          <Parameters closeFn={close}></Parameters>
        )}
      </Popup>
    </div>
    </div>
  )
}

export default App
