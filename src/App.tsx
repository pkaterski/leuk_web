import { useEffect, useRef, useState } from 'react'
import './App.css'
import { BloodValueRefs, BloodValues, checkNormalVals } from './leukLogic/initHealthy';
import { beginBVs, handleIter } from './leukLogic/leuk';
import { generateEvenlySpread } from './leukLogic/treatment';

function App() {
  const TIME_INTERVAL_MS = 100;
  const terapyCourses = generateEvenlySpread("Alexan", 10000, 4);

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

  useEffect(() => {

    const intervalId = setInterval(() => {
      if (pauseStateRef.current) {
        return;
      }

      setTimePassed(t => t + TIME_INTERVAL_MS);
      setBvs(handleIter(bvsRef.current,
                        timePassedRef.current,
                        terapyCourses));

      setAreNormalVals(checkNormalVals(bvsRef.current));
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

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
        <li>drug in action: <span id="drug-in-action">none</span></li>

        {/* status */}
        <li>is alive: <span id="is-alive" className={bvs.alive ? "" : "critical"}>{bvs.alive + ''}</span></li>

        {/* metadata */}
        <li>
          (metadata) time since in critical condition:
          <span id="critical-time">0</span>
        </li>
      </ul>

      {/* buttons */}
      <button type="button" id="pause-btn" onClick={() => {setPauseState(i => !i); setStarted(true)}}>
        {!started ? "start" : pauseState ? "resume" : "pause"}
      </button>
      <button type="button" id="alexan-btn">Introduce Alexan</button>
    </div>
    </div>
  )
}

export default App
