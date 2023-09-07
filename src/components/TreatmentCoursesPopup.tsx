import React, { ChangeEvent, useEffect, useState } from "react";
import { Drug, DRUGS } from "../leukLogic/initHealthy";
import { TreatmentCourse } from "../leukLogic/treatment";
type TreatmentCoursesPopupProps = {
  closeFn: () => void;
  initialTreatmentCourses: TreatmentCourse[];
  onTreatmentCoursesChange: (newTcs: TreatmentCourse[]) => void;
};

const TreatmentCoursesMenu: React.FC<TreatmentCoursesPopupProps> = (
  props: TreatmentCoursesPopupProps
) => {
  const [treatmentCourses, setTreatmentCourses] = useState<TreatmentCourse[]>(
    []
  );
  const [selectedDrug, setSelectedDrug] = useState<Drug>("Alexan");
  const [selectedTime, setSelectedTime] = useState(100);
  const [lastedTime, setLatestTime] = useState(100);

  useEffect(() => {
    const initTcs = props.initialTreatmentCourses;
    initTcs.sort((a, b) => a.atTime - b.atTime);
    setTreatmentCourses(initTcs);
    const lastTcs = initTcs.slice(-1)[0];
    if (lastTcs !== undefined) {
      setLatestTime(lastTcs.atTime);
      setSelectedTime(lastTcs.atTime + 100);
    }
  }, []);

  const handleAddCourse = () => {
    const newTcs = [
      ...treatmentCourses,
      { drug: selectedDrug, atTime: selectedTime },
    ];
    setTreatmentCourses(newTcs);
    setLatestTime(selectedTime);
    setSelectedTime((i) => i + 100);
    props.onTreatmentCoursesChange(newTcs);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(+e.target.value);
  };

  const handleDrugChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedDrug(e.target.value as Drug);
  };

  const handleRemove = (index: number) => {
    const tcLen = treatmentCourses.length;
    // handle llatest time
    if (index === tcLen - 1) {
      if (tcLen === 1) {
        setLatestTime(100);
        setSelectedTime(100);
      } else {
        const prevTime = treatmentCourses[tcLen - 2].atTime;
        setLatestTime(prevTime);
        setSelectedTime(prevTime + 100);
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
      <input
        type="number"
        id="drugAtTimeInput"
        min={lastedTime + 100}
        step={100}
        value={selectedTime}
        onChange={handleTimeChange}
      />
      <button onClick={handleAddCourse}>add</button>
      <hr />
      <div style={{ maxHeight: "50vh", overflow: "auto" }}>
        {treatmentCourses.map((tc, index) => {
          return (
            <p style={{ textAlign: "right" }} key={index}>
              {tc.drug} at time: {tc.atTime} ms
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
