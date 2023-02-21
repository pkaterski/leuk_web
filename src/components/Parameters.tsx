import { useState } from "react";
import { DRUGS } from "../leukLogic/initHealthy";
import { DrugAction } from "../leukLogic/leuk";

type ParametersProps = {
    closeFn: () => void;
}

const Parameters: React.FC<ParametersProps> = (props: ParametersProps) => {
    const [leukemicAggressiveGrowth, setLeukemicAggressiveGrowth] = useState(0);
    const [leukemicNonAggressiveGrowth, setLeukemicNonAggressiveGrowth] = useState(0);
    const [killRBC, setKillRBC] = useState(0);
    const [killWBC, setKillWBC] = useState(0);
    const [killT, setKillT] = useState(0);

    const initDrugActions = DRUGS.map(drugName => { return {
        name: drugName,
        wareOffTime: 0,
        killFactor: {
            redbloodcells: 0,
            whitebloodcells: 0,
            thrombocytes: 0,
            aggressiveleukemiacells: 0,
            nonAggressiveLeukemiaCells: 0,
        }
    }});

    const [drugActions, setDrugActions] = useState<DrugAction[]>(initDrugActions);

    const [rbcNormalization, setRbcNormalization] = useState(0);
    const [wbcNormalization, setWbcNormalization] = useState(0);
    const [tNormalization, setTNormalization] = useState(0);

    const [criticalTime, setCriticalTime] = useState(0);

    return (
        <div style={{maxHeight: "50vh", overflow: "auto"}}>
            <label>Leukemic Aggressive Cells Growth Factor:</label>
            <input type="number" min="0" />
            <br/ >

            <label>Leukemic Non-Aggressive Cells Growth Factor:</label>
            <input type="number" min="0" />
            <hr />

            <label>Leukemic Kill Rates:</label>
            <br/ >

            <label>Of Red Blood Cells: </label>
            <input type="number" min="0" />
            <br/ >
            <label>Of White Blood Cells: </label>
            <input type="number" min="0" />
            <br/ >
            <label>Of Thrombocytes: </label>
            <input type="number" min="0" />
            <hr />

            {DRUGS.map(drugName => {
                return (
                    <div key={drugName}>
                        <label>{drugName} parameters:</label>
                        <br />

                        <label>Ware-Off Time: </label>
                        <input type="number" min="0" />
                        <br />

                        <label>Kill Factors for: (surviving percantage)</label>
                        <br />

                        <label>Red Blood Cells: </label>
                        <input type="number" min="0" />
                        <br />

                        <label>White Blood Cells: </label>
                        <input type="number" min="0" />
                        <br />

                        <label>Thrombocytes: </label>
                        <input type="number" min="0" />
                        <hr />
                    </div>
                )
            })}

            <label>Red Blood Cell Normalization Factor: </label>
            <input type="number" min="0" />
            <hr />

            <label>White Blood Cell Normalization Factor: </label>
            <input type="number" min="0" />
            <hr />

            <label>Thrombocytes Normalization Factor: </label>
            <input type="number" min="0" />
            <hr />

            <label>Critical Time Until Death: </label>
            <input type="number" min="0" />
            <hr />

            <button>save</button>
            <button>reset</button>
            <hr />

            <button onClick={props.closeFn}>close</button>
        </div>
    )
}

export default Parameters;
