import React, { ChangeEvent, useEffect, useState } from "react";
import { Drug, DRUGS } from "../leukLogic/initHealthy";
import { TreatmentCourse } from "../leukLogic/treatment";
import { SimulationParameters } from "../leukLogic/leuk";
type TreatmentCoursesPopupProps = {
  closeFn: () => void;
  initialTreatmentCourses: TreatmentCourse[];
  onTreatmentCoursesChange: (newTcs: TreatmentCourse[]) => void;
  simulationParameters: SimulationParameters;
  msToDays: number;
};

const TreatmentCoursesMenu: React.FC<TreatmentCoursesPopupProps> = (
  props: TreatmentCoursesPopupProps
) => {
  const [treatmentCourses, setTreatmentCourses] = useState<TreatmentCourse[]>(
    []
  );
  const [selectedDrug, setSelectedDrug] = useState<Drug>("Alexan");
  const [selectedTime, setSelectedTime] = useState(1);
  const [lastedTime, setLatestTime] = useState(1);
  const [selectedDose, setSelectedDose] = useState(100);

  useEffect(() => {
    const initTcs = props.initialTreatmentCourses;
    initTcs.sort((a, b) => a.atTime - b.atTime);
    setTreatmentCourses(initTcs);
    const lastTcs = initTcs.slice(-1)[0];
    if (lastTcs !== undefined) {
      setLatestTime(lastTcs.atTime / props.msToDays);
      setSelectedTime(lastTcs.atTime / props.msToDays);
    }
    setAvgDoseOnSelectedDrug(selectedDrug);
  }, []);

  const handleAddCourse = () => {
    const newTcs = [
      ...treatmentCourses,
      { drug: selectedDrug, atTime: selectedTime * props.msToDays, doseMg: selectedDose },
    ];
    setTreatmentCourses(newTcs);
    setLatestTime(selectedTime);
    setSelectedTime((i) => i + 1);
    props.onTreatmentCoursesChange(newTcs);
  };

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(+e.target.value);
  };

  const setAvgDoseOnSelectedDrug = (drugInput: Drug) => {
    const dose = props.simulationParameters.drugActions.get(drugInput)?.avgDose;
    if (dose !== undefined)
      setSelectedDose(dose);
  };

  const handleDrugChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const drugInput = e.target.value as Drug;
    setAvgDoseOnSelectedDrug(drugInput);
    setSelectedDrug(drugInput);
  };

  const handleDoseChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedDose(+e.target.value);
  };

  const handleRemove = (index: number) => {
    const tcLen = treatmentCourses.length;
    // handle llatest time
    if (index === tcLen - 1) {
      if (tcLen === 1) {
        setLatestTime(1);
        setSelectedTime(1);
      } else {
        const prevTime = treatmentCourses[tcLen - 2].atTime;
        setLatestTime(prevTime);
        setSelectedTime(prevTime);
      }
    }

    const newTcs = [...treatmentCourses];
    newTcs.splice(index, 1);

    setTreatmentCourses(newTcs);
    props.onTreatmentCoursesChange(newTcs);
  };

  return (
    <>
      <div>Treatment Courses</div>
      <select
        name="drug"
        id="drugSelect"
        value={selectedDrug}
        onChange={handleDrugChange}
      >
        {DRUGS.map((drug) => (
          <option key={drug} value={drug}>
            {drug}
          </option>
        ))}
      </select>
      <label htmlFor="drugAtTimeInput">&nbsp;&nbsp;at day: </label>
      <input
        type="number"
        id="drugAtTimeInput"
        min={lastedTime}
        step={1}
        value={selectedTime}
        onChange={handleTimeChange}
      />
      <label htmlFor="drugDoseInput">&nbsp;&nbsp;dose in mg: </label>
      <input
        type="number"
        id="drugDoseInput"
        min={0}
        step={5}
        value={selectedDose}
        onChange={handleDoseChange}
      />
      <button onClick={handleAddCourse}>add</button>
      <hr />
      <div style={{ maxHeight: "50vh", overflow: "auto" }}>
        {treatmentCourses.map((tc, index) => {
          return (
            <p style={{ textAlign: "right" }} key={index}>
              {tc.drug} at day: {(tc.atTime / props.msToDays).toFixed()} day ({tc.doseMg}  mg)
              <button
                style={{ marginLeft: "20px" }}
                onClick={() => handleRemove(index)}
              >
                remove
              </button>
            </p>
          );
        })}
      </div>
      <hr />
      <button onClick={() => props.closeFn()}>close</button>
    </>
  );
};

export default TreatmentCoursesMenu;
