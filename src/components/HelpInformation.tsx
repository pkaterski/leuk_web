import React from "react";
import { useEffect, useState } from "react";
import { DRUGS } from "../leukLogic/initHealthy";
import { DrugAction, SimulationParameters } from "../leukLogic/leuk";

type HelpInformationProps = {
  closeFn: () => void;
};

const HelpInformation: React.FC<HelpInformationProps> = (
  props: HelpInformationProps
) => {
  return (
    <div>
      <p>
        Уеб базиран прототип на симулация на левкемия, който позволява промяна
        на дефинираните модулируеми параметри и задаване на броят и моментите
        във времето на прилагането на курсове химиотерапия чрез интерфейс, както
        и генериране на графики на стойностите на отделните видове кръвни
        клетки.
      </p>
      <p>
        Бутонът <b>start</b> дава старт на симулацията. <b>pause</b> - пауза,
        <b> resume</b> - продължаване
      </p>
      <p>
        Бутонът <b>Therapy course</b> позволява за задаване на различни
        цитостатични курсове, като се избира от списъка с цитостатици кога във
        времето да бъде приложен.
      </p>
      <p>
        Бутонът <b>Parameters</b> позволява за промяна на различните модулируеми
        параметри - при натискане на бутона се показва списък с тях, както и
        стойностите, които са зададени и които могат да бъдат променени.
      </p>
      <button onClick={props.closeFn}>close</button>
    </div>
  );
};

export default HelpInformation;
