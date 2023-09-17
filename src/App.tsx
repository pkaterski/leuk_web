import { useEffect, useRef, useState } from "react";
import "./App.css";
import {
  BloodValueRefs,
  PatientState,
  checkNormalVals,
  DRUGS,
  Drug,
  NORMAL_REFERENCES,
} from "./leukLogic/initHealthy";
import {
  beginBVs,
  getDrugWareOffTime,
  handleIter,
  SimulationParameters,
} from "./leukLogic/leuk";
import { generateEvenlySpread, TreatmentCourse } from "./leukLogic/treatment";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import TreatmentCoursesMenu from "./components/TreatmentCoursesPopup";
import Parameters from "./components/Parameters";
import PlotComponent from "./components/PlotComponent";
import HelpInformation from "./components/HelpInformation";

const initSimParams: SimulationParameters = {
  initialConditions: {
    redBloodCells: beginBVs.redBloodCells,
    whiteBloodCells: beginBVs.whiteBloodCells,
    thrombocytes: beginBVs.thrombocytes,
    stemCells: beginBVs.stemCells,
    leukemicAggressive: beginBVs.aggressiveLeukemiaCells,
    leukemicNonAggressive: beginBVs.nonAggressiveLeukemiaCells,
  },
  growthFactors: {
    leukemicAggressive: 1.01,
    leukemicNonAggressive: 1.005,
  },
  conversionFactors: {
    leukemicAggressiveToNonAggressive: 0.01,
    leukemicNonAggressiveToAggressive: 0.01,
  },
  leukemicKillFactor: {
    redBloodCells: 0.01,
    whiteBloodCells: 0.01,
    thrombocytes: 0.01,
    stemCells: 0.01,
  },
  drugActions: new Map([
    [
      "Alexan",
      {
        wareOffTime: 1000,
        encounterToResistance: 8,
        killFactor: {
          redbloodcells: 0.2,
          whitebloodcells: 0.2,
          thrombocytes: 0.2,
          stemCells: 0.1,
          aggressiveleukemiacells: 0.4,
          nonAggressiveLeukemiaCells: 0.2,
        },
        avgDose: 75,
        liverDamage: 10,
        heartDamage: 0,
        kidneyDamage: 0,
      }
    ],
    [
      "Oncaspar",
      {
        wareOffTime: 15000,
        encounterToResistance: 8,
        killFactor: {
          redbloodcells: 0.8,
          whitebloodcells: 0.8,
          thrombocytes: 0.8,
          stemCells: 0.8,
          aggressiveleukemiacells: 0.6,
          nonAggressiveLeukemiaCells: 0.8,
        },
        avgDose: 100,
        liverDamage: 0,
        heartDamage: 0,
        kidneyDamage: 0,
      }
    ],
    [
      "Methotrexate",
      {
        wareOffTime: 15000,
        encounterToResistance: 8,
        killFactor: {
          redbloodcells: 0.8,
          whitebloodcells: 0.8,
          thrombocytes: 0.8,
          stemCells: 0.8,
          aggressiveleukemiacells: 0.6,
          nonAggressiveLeukemiaCells: 0.8,
        },
        avgDose: 100,
        liverDamage: 0,
        heartDamage: 0,
        kidneyDamage: 0,
      }
    ],
    [
      "Mercaptopurine",
      {
        wareOffTime: 15000,
        encounterToResistance: 8,
        killFactor: {
          redbloodcells: 0.8,
          whitebloodcells: 0.8,
          thrombocytes: 0.8,
          stemCells: 0.8,
          aggressiveleukemiacells: 0.6,
          nonAggressiveLeukemiaCells: 0.8,
        },
        avgDose: 100,
        liverDamage: 0,
        heartDamage: 0,
        kidneyDamage: 0,
      }
    ],
    [
      "Vincristine",
      {
        wareOffTime: 15000,
        encounterToResistance: 8,
        killFactor: {
          redbloodcells: 0.8,
          whitebloodcells: 0.8,
          thrombocytes: 0.8,
          stemCells: 0.8,
          aggressiveleukemiacells: 0.6,
          nonAggressiveLeukemiaCells: 0.8,
        },
        avgDose: 100,
        liverDamage: 0,
        heartDamage: 0,
        kidneyDamage: 0,
      }
    ],
    [
      "Farmorubicin",
      {
        wareOffTime: 15000,
        encounterToResistance: 8,
        killFactor: {
          redbloodcells: 0.8,
          whitebloodcells: 0.8,
          thrombocytes: 0.8,
          stemCells: 0.8,
          aggressiveleukemiacells: 0.6,
          nonAggressiveLeukemiaCells: 0.8,
        },
        avgDose: 100,
        liverDamage: 0,
        heartDamage: 0,
        kidneyDamage: 0,
      }
    ],
    [
      "Endoxan",
      {
        wareOffTime: 15000,
        encounterToResistance: 8,
        killFactor: {
          redbloodcells: 0.8,
          whitebloodcells: 0.8,
          thrombocytes: 0.8,
          stemCells: 0.8,
          aggressiveleukemiacells: 0.6,
          nonAggressiveLeukemiaCells: 0.8,
        },
        avgDose: 100,
        liverDamage: 0,
        heartDamage: 0,
        kidneyDamage: 0,
      }
    ],
    [
      "Urbason",
      {
        wareOffTime: 15000,
        encounterToResistance: 8,
        killFactor: {
          redbloodcells: 0.8,
          whitebloodcells: 0.8,
          thrombocytes: 0.8,
          stemCells: 0.8,
          aggressiveleukemiacells: 0.6,
          nonAggressiveLeukemiaCells: 0.8,
        },
        avgDose: 100,
        liverDamage: 0,
        heartDamage: 0,
        kidneyDamage: 0,
      }
    ],
  ]),
  normalizationFactor: {
    redBloodCells: 235000 / 5,
    whiteBloodCells: 225 / 5,
    thrombocytes: 7500 / 5,
    stemCells: 2500 / 5,
  },
  criticalTime: 30000,
};

function App() {
  const TIME_INTERVAL_MS = 100;
  // make sure that this const is a multiple of TIME_INTERVAL_MS,
  // otherwise dosing at specific times will not work
  const MS_TO_DAYS = 1000;
  const [simulationSpeed, setSimulationSpeed] = useState<number>(100);
  const simulationSpeedRef = useRef(simulationSpeed);
  useEffect(() => {
    simulationSpeedRef.current = simulationSpeed;
  }, [simulationSpeed]);
  const [currentInterval, setCurrentInterval] = useState<NodeJS.Timer | null>(null);
  const currentIntervalRef = useRef(currentInterval);
  useEffect(() => {
    currentIntervalRef.current = currentInterval;
  }, [currentInterval]);
  const [therapyCourses, setTerapyCourses] = useState<TreatmentCourse[]>(
    // generateEvenlySpread("Alexan", 10000, 4)
    []
  );
  const therapyCoursesRef = useRef(therapyCourses);
  useEffect(() => {
    therapyCoursesRef.current = therapyCourses;
  }, [therapyCourses]);

  const [started, setStarted] = useState(false);
  const startedRef = useRef(started);
  useEffect(() => {
    startedRef.current = started;
  }, [started]);
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
  const [initBvs, setInitBvs] = useState<PatientState>({ ...beginBVs });
  const initBvsRef = useRef(initBvs);
  useEffect(() => {
    initBvsRef.current = initBvs;
  }, [initBvs]);
  const [bvs, setBvs] = useState<PatientState>({ ...beginBVs });
  const bvsRef = useRef(bvs);
  useEffect(() => {
    bvsRef.current = bvs;
  }, [bvs]);
  const [areNormalVals, setAreNormalVals] = useState<BloodValueRefs>({
    whiteBloodCells: 0,
    redBloodCells: 0,
    thrombocytes: 0,
    stemCells: 0,
  });
  const areNormalValsRef = useRef(areNormalVals);
  useEffect(() => {
    areNormalValsRef.current = areNormalVals;
  }, [areNormalVals]);
  const [drugTimesRemaining, setDrugTimesRemaining] = useState<string[]>([]);
  const [criticalTime, setCriticalTime] = useState<string | null>(null);

  const [simParams, setSimParams] =
    useState<SimulationParameters>(initSimParams);
  const simParamsRef = useRef(simParams);
  useEffect(() => {
    simParamsRef.current = simParams;
    if (!startedRef.current) {
      const oldInitBvs = initBvsRef.current;
      const initParams = simParamsRef.current.initialConditions;
      const newInitBvs = {
        ...oldInitBvs,
        whiteBloodCells: initParams.whiteBloodCells,
        redBloodCells: initParams.redBloodCells,
        thrombocytes: initParams.thrombocytes,
        stemCells: initParams.stemCells,
        aggressiveLeukemiaCells: initParams.leukemicAggressive,
        nonAggressiveLeukemiaCells: initParams.leukemicNonAggressive,
      };
      setInitBvs(newInitBvs);
      setBvs(newInitBvs);
    }
  }, [simParams]);

  const [bvsAcc, setBvsAcc] = useState<PatientState[]>([]);
  const [timePassedAcc, setTimePassedAcc] = useState<number[]>([]);

  const simulationLoop = () => {
    if (pauseStateRef.current || !bvsRef.current.alive) {
      return;
    }

    const newTimePassed = timePassedRef.current + TIME_INTERVAL_MS;
    setTimePassed(newTimePassed);
    const newBvs = handleIter(
      bvsRef.current,
      timePassedRef.current,
      therapyCoursesRef.current,
      simParamsRef.current
    );
    setBvs(newBvs);

    setBvsAcc((bvss) => [...bvss, newBvs].slice(-600));
    setTimePassedAcc((ts) => [...ts, newTimePassed / MS_TO_DAYS].slice(-600));

    setAreNormalVals(checkNormalVals(bvsRef.current));

    const drugTimesRemaining = bvsRef.current.drugs.map(drug => {
      const drugTimePassed =
        timePassedRef.current - drug.introductionTime;
      const timeRemaining = getDrugWareOffTime(
        drug.type,
        simParamsRef.current.drugActions) - drugTimePassed;

      return `${drug.type}: ${(timeRemaining / MS_TO_DAYS).toFixed(1)} days`;
    });
    setDrugTimesRemaining(drugTimesRemaining);

    if (bvsRef.current.criticalTimeStart !== null) {
      setCriticalTime(
        (
          (timePassedRef.current - bvsRef.current.criticalTimeStart) /
          MS_TO_DAYS
        ).toFixed(1) + " days"
      );
    } else {
      setCriticalTime(null);
    }
  }

  useEffect(() => {
    if (currentIntervalRef.current !== null)
      clearInterval(currentIntervalRef.current);

    const intervalId = setInterval(simulationLoop, TIME_INTERVAL_MS / simulationSpeedRef.current * 100);
    setCurrentInterval(intervalId);

    return () => clearInterval(intervalId);
  }, [simulationSpeed]);

  const onIntroduceDrug = (drug: Drug) => {
    setBvs((bvs) => {
      // todo figure out why:
      // first time this run it causes a hick up in bvs values
      const dose = simParamsRef.current.drugActions.get(drug)?.avgDose;
      if (dose === undefined) throw new Error(`INTRO DRUG: AVG DOSE not listed for ${drug}`);
      return {
        ...bvs,
        drugs: bvs.drugs.concat({
          type: drug,
          introductionTime:
          timePassed,
          doseMg: dose,
          countStarted: false
        }),
      };
    });
  };

  const onReset = () => {
    setPauseState(true);
    setStarted(false);

    setBvs({
      ...initBvsRef.current,
      drugs: [], // active drugs reset
      resistance: [],
    });
    setBvsAcc([]);

    setAreNormalVals({
      whiteBloodCells: 0,
      redBloodCells: 0,
      thrombocytes: 0,
      stemCells: 0,
    });

    setTimePassed(0);
    setTimePassedAcc([]);

    setDrugTimesRemaining([]);

    setCriticalTime(null);
  };

  return (
    <div className="App">
      <div className="container">
        <div className="plot-grid">
          <div className="main-part">
            <h1>Computer Simulation for Leukemia Treatment</h1>

            <h4>Blood values at day {(timePassed / MS_TO_DAYS).toFixed(1)}:</h4>

            {/* normal blood cells */}
            <ul>
              <li>
                Red Blood Cells:
                <span
                  id="red-blood-cell-count"
                  className={
                    Math.abs(areNormalVals.redBloodCells) <= 1 ? "" : "critical"
                  }
                >
                  {bvs.redBloodCells.toFixed()}
                </span>
              </li>
              <li>
                White Blood Cells:
                <span
                  id="white-blood-cell-count"
                  className={
                    Math.abs(areNormalVals.whiteBloodCells) <= 1 ? "" : "critical"
                  }
                >
                  {bvs.whiteBloodCells.toFixed()}
                </span>
              </li>
              <li>
                Thrombocytes:
                <span
                  id="thrombocytes-count"
                  className={
                    Math.abs(areNormalVals.thrombocytes) <= 1 ? "" : "critical"
                  }
                >
                  {bvs.thrombocytes.toFixed()}
                </span>
              </li>
              <li>
                Stem Cells:
                <span
                  id="stem-cells-count"
                  className={
                    Math.abs(areNormalVals.stemCells) <= 1 ? "" : "critical"
                  }
                >
                  {bvs.stemCells.toFixed()}
                </span>
              </li>
            </ul>

            <ul>
              {/* leukemic cells */}
              <li>
                aggressive leukemia cells:
                <span id="aggressive-leukemia-cell-count">
                  {bvs.aggressiveLeukemiaCells.toFixed()}
                </span>
              </li>
              <li>
                non-aggressive leukemia cells:
                <span id="non-aggressive-leukemia-cell-count">
                  {bvs.nonAggressiveLeukemiaCells.toFixed()}
                </span>
              </li>
            </ul>

            <ul>
              <li>
                Heart Health:
                <span
                  id="heart-health"
                >
                  {bvs.heartHealth.toFixed()}
                </span>
              </li>
              <li>
                Liver Health:
                <span
                  id="liver-health"
                >
                  {bvs.liverHealth.toFixed()}
                </span>
              </li>
              <li>
                kidney Health:
                <span
                  id="kidney-health"
                >
                  {bvs.kidneyHealth.toFixed()}
                </span>
              </li>
            </ul>

            <ul>
              {/* drug in action */}
              <li>
                drugs in action:
                <span id="drug-in-action">
                  {bvs.drugs.length === 0
                    ? "none"
                    : drugTimesRemaining.join(', ')}
                </span>
              </li>

              {/* status */}
              <li>
                is alive:{" "}
                <span id="is-alive" className={bvs.alive ? "" : "critical"}>
                  {bvs.alive + ""}
                </span>
              </li>

              {/* metadata */}
              <li>
                (metadata) time since in critical condition:
                <span
                  id="critical-time"
                  className={criticalTime === null ? "" : "critical"}
                >
                  {criticalTime !== null ? criticalTime : "0"}
                </span>
              </li>
            </ul>

            {/* buttons */}
            <button
              type="button"
              id="pause-btn"
              onClick={() => {
                setPauseState((i) => !i);
                setStarted(true);
              }}
            >
              {!started ? "start" : pauseState ? "resume" : "pause"}
            </button>

            {/* empty spaces */}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

            <label>Simulation Speed:</label>
            <input
              type="number"
              min="1"
              value={simulationSpeed}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSimulationSpeed(+e.target.value)
              }
            />

            {/* empty spaces */}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

            <button type="button" id="reset-btn" onClick={onReset}>
              Reset
            </button>

            <hr />
            <Popup
              trigger={<button>Therapy course</button>}
              modal
              closeOnDocumentClick={false}
            >
              {/*
              // @ts-ignore */}
              {(close: any) => (
                <TreatmentCoursesMenu
                  closeFn={close}
                  initialTreatmentCourses={therapyCourses}
                  onTreatmentCoursesChange={(tcs) => setTerapyCourses(tcs)}
                  simulationParameters={simParams}
                  msToDays={MS_TO_DAYS}
                />
              )}
            </Popup>
            <Popup
              trigger={<button>Parameters</button>}
              modal
              closeOnDocumentClick={false}
            >
              {/*
              // @ts-ignore */}
              {(close: any) => (
                <Parameters
                  closeFn={close}
                  initParams={simParams}
                  originalParams={initSimParams}
                  onParamChange={(newParams: SimulationParameters) =>
                    setSimParams(newParams)
                  }
                  msToDays={MS_TO_DAYS}
                />
              )}
            </Popup>
            <Popup
              trigger={<button>Help Information</button>}
              modal
              closeOnDocumentClick={false}
            >
              {/*
              // @ts-ignore */}
              {(close: any) => <HelpInformation closeFn={close} />}
            </Popup>
            <hr />

            {DRUGS.map((drugName) => {
              return (<>
                <button
                  type="button"
                  id="alexan-btn"
                  onClick={() => onIntroduceDrug(drugName)}>

                  {drugName}

                </button>
              </>)
            })}
            
          </div>
          {/* <PlotComponent
            xs={timePassedAcc}
            ys={bvsAcc.map((bvs) => bvs.redBloodCells)}
            title="Red Blood Cells"
          ></PlotComponent> */}
          <PlotComponent
            xs={timePassedAcc}
            ys={bvsAcc.map((bvs) =>
              bvs.whiteBloodCells + bvs.aggressiveLeukemiaCells + bvs.nonAggressiveLeukemiaCells
              )}
            title="Total WBC Count"
            widthFactor={2}
            heightFactor={2}
            highLowRefs={{ high: NORMAL_REFERENCES.whiteBloodCells.high, low: NORMAL_REFERENCES.whiteBloodCells.low }}
          ></PlotComponent>
          <PlotComponent
            xs={timePassedAcc}
            ys={bvsAcc.map((bvs) => bvs.whiteBloodCells)}
            title="Healthy White Blood Cells"
            highLowRefs={{ high: NORMAL_REFERENCES.whiteBloodCells.high, low: NORMAL_REFERENCES.whiteBloodCells.low }}
          ></PlotComponent>
          <PlotComponent
            xs={timePassedAcc}
            ys={bvsAcc.map((bvs) => bvs.stemCells)}
            title="Stem Cells"
            highLowRefs={{ high: NORMAL_REFERENCES.stemCells.high, low: NORMAL_REFERENCES.stemCells.low }}
          ></PlotComponent>
          {/* <PlotComponent
            xs={timePassedAcc}
            ys={bvsAcc.map((bvs) => bvs.thrombocytes)}
            title="Thrombocytes"
          ></PlotComponent> */}
          <PlotComponent
            xs={timePassedAcc}
            ys={bvsAcc.map((bvs) => bvs.aggressiveLeukemiaCells)}
            title="Aggressive Leukemia Cells"
          ></PlotComponent>
          <PlotComponent
            xs={timePassedAcc}
            ys={bvsAcc.map((bvs) => bvs.nonAggressiveLeukemiaCells)}
            title="Non-Aggressive Leukemia Cells"
          ></PlotComponent>
        </div>
      </div>
      <div className="footer">
        <p>Software prototype created by Parashkev Katerski 2021-2023</p>
      </div>
    </div>
  );
}

export default App;
