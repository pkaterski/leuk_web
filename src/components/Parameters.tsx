import React from "react";
import { useEffect, useState } from "react";
import { DRUGS, Drug } from "../leukLogic/initHealthy";
import { DrugAction, SimulationParameters } from "../leukLogic/leuk";

type ParametersProps = {
  closeFn: () => void;
  initParams: SimulationParameters;
  onParamChange: (newParams: SimulationParameters) => void;
};

const Parameters: React.FC<ParametersProps> = (props: ParametersProps) => {
  const [initRedBloodCells, setInitRedBloodCells] = useState(0);
  const [initWhiteBloodCells, setInitWhiteBloodCells] = useState(0);
  const [initThrombocytes, setInitThrombocytes] = useState(0);
  const [initStemCells, setInitStemCells] = useState(0);
  const [initLeukemicAggressive, setInitLeukemicAggressive] = useState(0);
  const [initLeukemicNonAggressive, setInitLeukemicNonAggressive] = useState(0);

  const [leukemicAggressiveGrowth, setLeukemicAggressiveGrowth] = useState(0);
  const [leukemicNonAggressiveGrowth, setLeukemicNonAggressiveGrowth] =
    useState(0);

  const [conversionLAtoLNA, setConversionLAtoLNA] = useState(0);
  const [conversionLNAtoLA, setConversionLNAtoLA] = useState(0);

  const [killRBC, setKillRBC] = useState(0);
  const [killWBC, setKillWBC] = useState(0);
  const [killT, setKillT] = useState(0);
  const [killStem, setKillSteam] = useState(0);

  const initDrugActions = new Map<Drug,DrugAction>(DRUGS.map((drugName) => {
    return [
      drugName,
      {
        name: drugName,
        wareOffTime: 0,
        encounterToResistance: 0,
        killFactor: {
          redbloodcells: 0,
          whitebloodcells: 0,
          thrombocytes: 0,
          stemCells: 0,
          aggressiveleukemiacells: 0,
          nonAggressiveLeukemiaCells: 0,
        },
        avgDose: 0,
        heartDamage: 0,
        liverDamage: 0,
        kidneyDamage: 0,
      }
    ];
  }));

  const [drugActions, setDrugActions] = useState<Map<Drug,DrugAction>>(initDrugActions);

  const [rbcNormalization, setRbcNormalization] = useState(0);
  const [wbcNormalization, setWbcNormalization] = useState(0);
  const [tNormalization, setTNormalization] = useState(0);
  const [stemNormalization, setStemNormalization] = useState(0);

  const [criticalTime, setCriticalTime] = useState(0);

  const setToInitialParams = () => {
    setInitRedBloodCells(props.initParams.initialConditions.redBloodCells);
    setInitWhiteBloodCells(props.initParams.initialConditions.whiteBloodCells);
    setInitThrombocytes(props.initParams.initialConditions.thrombocytes);
    setInitStemCells(props.initParams.initialConditions.stemCells);
    setInitLeukemicAggressive(props.initParams.initialConditions.leukemicAggressive);
    setInitLeukemicNonAggressive(props.initParams.initialConditions.leukemicNonAggressive);

    setLeukemicAggressiveGrowth(
      props.initParams.growthFactors.leukemicAggressive
    );
    setLeukemicNonAggressiveGrowth(
      props.initParams.growthFactors.leukemicNonAggressive
    );
    setConversionLAtoLNA(
      props.initParams.conversionFactors.leukemicAggressiveToNonAggressive
    );
    setConversionLNAtoLA(
      props.initParams.conversionFactors.leukemicNonAggressiveToAggressive
    );
    setKillRBC(props.initParams.leukemicKillFactor.redBloodCells);
    setKillWBC(props.initParams.leukemicKillFactor.whiteBloodCells);
    setKillT(props.initParams.leukemicKillFactor.thrombocytes);
    setKillSteam(props.initParams.leukemicKillFactor.stemCells);
    setDrugActions(props.initParams.drugActions);
    setRbcNormalization(props.initParams.normalizationFactor.redBloodCells);
    setWbcNormalization(props.initParams.normalizationFactor.whiteBloodCells);
    setTNormalization(props.initParams.normalizationFactor.thrombocytes);
    setStemNormalization(props.initParams.normalizationFactor.stemCells);
    setCriticalTime(props.initParams.criticalTime);
  };

  useEffect(() => {
    setToInitialParams();
  }, []);

  const handleSave = () => {
    const newParams: SimulationParameters = {
      initialConditions: {
        redBloodCells: initRedBloodCells,
        whiteBloodCells: initWhiteBloodCells,
        thrombocytes: initThrombocytes,
        stemCells: initStemCells,
        leukemicAggressive: initLeukemicAggressive,
        leukemicNonAggressive: initLeukemicNonAggressive,
      },
      growthFactors: {
        leukemicAggressive: leukemicAggressiveGrowth,
        leukemicNonAggressive: leukemicNonAggressiveGrowth,
      },
      conversionFactors: {
        leukemicAggressiveToNonAggressive: conversionLAtoLNA,
        leukemicNonAggressiveToAggressive: conversionLNAtoLA,
      },
      leukemicKillFactor: {
        redBloodCells: killRBC,
        whiteBloodCells: killWBC,
        thrombocytes: killT,
        stemCells: killStem,
      },
      drugActions,
      normalizationFactor: {
        redBloodCells: rbcNormalization,
        whiteBloodCells: wbcNormalization,
        thrombocytes: tNormalization,
        stemCells: stemNormalization,
      },
      criticalTime,
    };

    alert("Saved!");
    props.onParamChange(newParams);
  };

  return (
    <div style={{ maxHeight: "50vh", overflow: "auto" }}>
      <h2>Simulation Parameters</h2>
      <hr />

      <h4>Initial Counts:</h4>
      <label>Red Blood Cells:</label>
      <input
        type="number"
        min="0"
        value={initRedBloodCells}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setInitRedBloodCells(+e.target.value)
        }
      />
      <br />
      <label>White Blood Cells:</label>
      <input
        type="number"
        min="0"
        value={initWhiteBloodCells}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setInitWhiteBloodCells(+e.target.value)
        }
      />
      <br />
      <label>Thrombocytes:</label>
      <input
        type="number"
        min="0"
        value={initThrombocytes}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setInitThrombocytes(+e.target.value)
        }
      />
      <br />
      <label>Stem Cells:</label>
      <input
        type="number"
        min="0"
        value={initStemCells}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setInitStemCells(+e.target.value)
        }
      />
      <br />
      <label>Aggressive Leukemia Cells:</label>
      <input
        type="number"
        min="0"
        value={initLeukemicAggressive}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setInitLeukemicAggressive(+e.target.value)
        }
      />
      <br />
      <label>Non-Aggressive Leukemia Cells:</label>
      <input
        type="number"
        min="0"
        value={initLeukemicNonAggressive}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setInitLeukemicNonAggressive(+e.target.value)
        }
      />
      <hr />

      <h4>Growth factors</h4>
      <label>Leukemic Aggressive Cells Growth Factor:</label>
      <input
        type="number"
        min="0"
        value={leukemicAggressiveGrowth}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setLeukemicAggressiveGrowth(+e.target.value)
        }
      />
      <br />

      <label>Leukemic Non-Aggressive Cells Growth Factor:</label>
      <input
        type="number"
        min="0"
        value={leukemicNonAggressiveGrowth}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setLeukemicNonAggressiveGrowth(+e.target.value)
        }
      />
      <hr />

      <h4>Leukemic Conversion Factors:</h4>
      <br />
      <label>Of Non-Aggressive to Aggressive: </label>
      <input
        type="number"
        min="0"
        value={conversionLNAtoLA}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setConversionLNAtoLA(+e.target.value)
        }
      />
      <br />
      <label>Of Aggressive to Non-Aggressive: </label>
      <input
        type="number"
        min="0"
        value={conversionLAtoLNA}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setConversionLAtoLNA(+e.target.value)
        }
      />
      <hr />

      <h4>Leukemic Kill Rates:</h4>
      <br />

      <label>Of Red Blood Cells: </label>
      <input
        type="number"
        min="0"
        value={killRBC}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setKillRBC(+e.target.value)
        }
      />
      <br />
      <label>Of White Blood Cells: </label>
      <input
        type="number"
        min="0"
        value={killWBC}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setKillWBC(+e.target.value)
        }
      />
      <br />
      <label>Of Thrombocytes: </label>
      <input
        type="number"
        min="0"
        value={killT}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setKillT(+e.target.value)
        }
      />
      <br />
      <label>Of Stem Cells: </label>
      <input
        type="number"
        min="0"
        value={killStem}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setKillSteam(+e.target.value)
        }
      />
      <br />
      <hr />

      {DRUGS.map((drugName) => {
        return (
          <div key={drugName}>
            <h4>{drugName} parameters:</h4>
            <br />

            <label>Ware-Off Time: </label>
            <input
              type="number"
              min="0"
              value={drugActions.get(drugName)?.wareOffTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDrugActions((ds) => {
                  const oldDrugAction =  ds.get(drugName);
                  if (oldDrugAction === undefined) return ds;
                  const newDrugAction: DrugAction = {
                    ...oldDrugAction,
                    wareOffTime: +e.target.value
                  };
                  return new Map([ ...ds.entries(), [drugName, newDrugAction] ])
                })
              }
            />
            <br />
            <label>Avarage Dose: </label>
            <input
              type="number"
              min="0"
              value={drugActions.get(drugName)?.avgDose}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDrugActions((ds) => {
                  const oldDrugAction =  ds.get(drugName);
                  if (oldDrugAction === undefined) return ds;
                  const newDrugAction: DrugAction = {
                    ...oldDrugAction,
                    avgDose: +e.target.value
                  };
                  return new Map([ ...ds.entries(), [drugName, newDrugAction] ])
                })
              }
            />
            <br />
            <label>Time to encounter before resistance: </label>
            <input
              type="number"
              min="0"
              value={drugActions.get(drugName)?.encounterToResistance}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDrugActions((ds) => {
                  const oldDrugAction =  ds.get(drugName);
                  if (oldDrugAction === undefined) return ds;
                  const newDrugAction: DrugAction = {
                    ...oldDrugAction,
                    encounterToResistance: +e.target.value
                  };
                  return new Map([ ...ds.entries(), [drugName, newDrugAction] ])
                })
              }
            />
            <br />
            <label>Heart Damage: </label>
            <input
              type="number"
              min="0"
              value={drugActions.get(drugName)?.heartDamage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDrugActions((ds) => {
                  const oldDrugAction =  ds.get(drugName);
                  if (oldDrugAction === undefined) return ds;
                  const newDrugAction: DrugAction = {
                    ...oldDrugAction,
                    heartDamage: +e.target.value
                  };
                  return new Map([ ...ds.entries(), [drugName, newDrugAction] ])
                })
              }
            />
            <br />
            <label>Liver Damage: </label>
            <input
              type="number"
              min="0"
              value={drugActions.get(drugName)?.liverDamage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDrugActions((ds) => {
                  const oldDrugAction =  ds.get(drugName);
                  if (oldDrugAction === undefined) return ds;
                  const newDrugAction: DrugAction = {
                    ...oldDrugAction,
                    liverDamage: +e.target.value
                  };
                  return new Map([ ...ds.entries(), [drugName, newDrugAction] ])
                })
              }
            />
            <br />
            <label>Kidney Damage: </label>
            <input
              type="number"
              min="0"
              value={drugActions.get(drugName)?.kidneyDamage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDrugActions((ds) => {
                  const oldDrugAction =  ds.get(drugName);
                  if (oldDrugAction === undefined) return ds;
                  const newDrugAction: DrugAction = {
                    ...oldDrugAction,
                    kidneyDamage: +e.target.value
                  };
                  return new Map([ ...ds.entries(), [drugName, newDrugAction] ])
                })
              }
            />
            <br />

            <label>Kill Factors for: (surviving percantage)</label>
            <br />

            <label>Red Blood Cells: </label>
            <input
              type="number"
              min="0"
              value={
                drugActions.get(drugName)?.killFactor
                  .redbloodcells
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDrugActions((ds) => {
                  const oldDrugAction =  ds.get(drugName);
                  if (oldDrugAction === undefined) return ds;
                  const newDrugAction: DrugAction = {
                    ...oldDrugAction,
                    killFactor: {
                      ...oldDrugAction.killFactor,
                      redbloodcells: +e.target.value,
                    }
                  };
                  return new Map([ ...ds.entries(), [drugName, newDrugAction] ])
                })
              }
            />
            <br />

            <label>White Blood Cells: </label>
            <input
              type="number"
              min="0"
              value={
                drugActions.get(drugName)?.killFactor
                  .whitebloodcells
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDrugActions((ds) => {
                  const oldDrugAction =  ds.get(drugName);
                  if (oldDrugAction === undefined) return ds;
                  const newDrugAction: DrugAction = {
                    ...oldDrugAction,
                    killFactor: {
                      ...oldDrugAction.killFactor,
                      whitebloodcells: +e.target.value,
                    }
                  };
                  return new Map([ ...ds.entries(), [drugName, newDrugAction] ])
                })
              }
            />
            <br />

            <label>Thrombocytes: </label>
            <input
              type="number"
              min="0"
              value={
                drugActions.get(drugName)?.killFactor
                  .thrombocytes
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDrugActions((ds) => {
                  const oldDrugAction =  ds.get(drugName);
                  if (oldDrugAction === undefined) return ds;
                  const newDrugAction: DrugAction = {
                    ...oldDrugAction,
                    killFactor: {
                      ...oldDrugAction.killFactor,
                      thrombocytes: +e.target.value,
                    }
                  };
                  return new Map([ ...ds.entries(), [drugName, newDrugAction] ])
                })
              }
            />
            <br />

            <label>Stem Cells: </label>
            <input
              type="number"
              min="0"
              value={
                drugActions.get(drugName)?.killFactor
                  .stemCells
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDrugActions((ds) => {
                  const oldDrugAction =  ds.get(drugName);
                  if (oldDrugAction === undefined) return ds;
                  const newDrugAction: DrugAction = {
                    ...oldDrugAction,
                    killFactor: {
                      ...oldDrugAction.killFactor,
                      stemCells: +e.target.value,
                    }
                  };
                  return new Map([ ...ds.entries(), [drugName, newDrugAction] ])
                })
              }
            />
            <br />

            <label>Aggressive Leukemic Cells: </label>
            <input
              type="number"
              min="0"
              value={
                drugActions.get(drugName)?.killFactor
                  .aggressiveleukemiacells
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDrugActions((ds) => {
                  const oldDrugAction =  ds.get(drugName);
                  if (oldDrugAction === undefined) return ds;
                  const newDrugAction: DrugAction = {
                    ...oldDrugAction,
                    killFactor: {
                      ...oldDrugAction.killFactor,
                      aggressiveleukemiacells: +e.target.value,
                    }
                  };
                  return new Map([ ...ds.entries(), [drugName, newDrugAction] ])
                })
              }
            />
            <br />

            <label>Non-Aggressive Leukemic Cells: </label>
            <input
              type="number"
              min="0"
              value={
                drugActions.get(drugName)?.killFactor
                  .nonAggressiveLeukemiaCells
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDrugActions((ds) => {
                  const oldDrugAction =  ds.get(drugName);
                  if (oldDrugAction === undefined) return ds;
                  const newDrugAction: DrugAction = {
                    ...oldDrugAction,
                    killFactor: {
                      ...oldDrugAction.killFactor,
                      nonAggressiveLeukemiaCells: +e.target.value,
                    }
                  };
                  return new Map([ ...ds.entries(), [drugName, newDrugAction] ])
                })
              }
            />
            <hr />
          </div>
        );
      })}

      <label>Red Blood Cell Normalization Factor: </label>
      <input
        type="number"
        min="0"
        value={rbcNormalization}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setRbcNormalization(+e.target.value)
        }
      />
      <hr />

      <label>White Blood Cell Normalization Factor: </label>
      <input
        type="number"
        min="0"
        value={wbcNormalization}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setWbcNormalization(+e.target.value)
        }
      />
      <hr />

      <label>Thrombocytes Normalization Factor: </label>
      <input
        type="number"
        min="0"
        value={tNormalization}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setTNormalization(+e.target.value)
        }
      />
      <hr />

      <label>Stem Cell Normalization Factor: </label>
      <input
        type="number"
        min="0"
        value={stemNormalization}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setStemNormalization(+e.target.value)
        }
      />
      <hr />

      <label>Critical Time Until Death: </label>
      <input
        type="number"
        min="0"
        value={criticalTime}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setCriticalTime(+e.target.value)
        }
      />
      <hr />

      <button onClick={handleSave}>save</button>
      <button onClick={setToInitialParams}>reset</button>
      <hr />

      <button onClick={props.closeFn}>close</button>
    </div>
  );
};

export default Parameters;
