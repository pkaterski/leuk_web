// get html elements
const elements = {};
elements.redBloodCellCount = document.getElementById("red-blood-cell-count");
elements.whiteBloodCellCount = document.getElementById("white-blood-cell-count");
elements.thrombocytesCount = document.getElementById("thrombocytes-count");
elements.aggressiveLeukemiaCellCount = document.getElementById("aggressive-leukemia-cell-count");
elements.nonAggressiveLeukemiaCellCount = document.getElementById("non-aggressive-leukemia-cell-count");
elements.drugInAction = document.getElementById("drug-in-action");
elements.isAlive = document.getElementById("is-alive");
elements.criticalTime = document.getElementById("critical-time");


let bvs = beginBVs;
let timePassed = 0;
let criticalCondition = false;
const TIME_INTERVAL_MS = 500;

const updateCellCounts = () => {

  // could be optimized by attaching metadata in leuk...
  const areNormal = checkNormalVals(bvs);

  elements.whiteBloodCellCount.innerHTML = bvs.whiteBloodCells.toFixed();
  if (!areNormal.whiteBloodCells)
    elements.whiteBloodCellCount.classList.add("critical");
  else
    elements.whiteBloodCellCount.classList.remove("critical");

  elements.redBloodCellCount.innerHTML = bvs.redBloodCells.toFixed();
  if (!areNormal.redBloodCells)
    elements.redBloodCellCount.classList.add("critical");
  else
    elements.redBloodCellCount.classList.remove("critical");

  elements.thrombocytesCount.innerHTML = bvs.thrombocytes.toFixed();
  if (!areNormal.thrombocytes)
    elements.thrombocytesCount.classList.add("critical");
  else
    elements.thrombocytesCount.classList.remove("critical");

  // leukemic cells
  elements.aggressiveLeukemiaCellCount.innerHTML = bvs.aggressiveLeukemiaCells.toFixed();
  elements.nonAggressiveLeukemiaCellCount.innerHTML = bvs.nonAggressiveLeukemiaCells.toFixed();
}

const handleCriticalTime = () => {
  if (bvs.criticalTimeStart !== null) {
    elements.criticalTime.innerHTML = ((timePassed - bvs.criticalTimeStart) / 1000).toFixed(1) + " units";
    elements.criticalTime.classList.add("critical");
  } else {
    elements.criticalTime.innerHTML = 0;
    elements.criticalTime.classList.remove("critical");
  }
}

// reads global vars
const updateHTMLValues = () => {
  if (!bvs.alive) {
    elements.isAlive.innerHTML = bvs.alive;
    elements.isAlive.classList.add("critical");
    return;
  }

  updateCellCounts();
  elements.drugInAction.innerHTML = bvs.drug;
  elements.isAlive.innerHTML = bvs.alive;

  handleCriticalTime();
};

updateHTMLValues(bvs);

setInterval(() => {
  timePassed += TIME_INTERVAL_MS
  bvs = handleIter(bvs, timePassed)

  updateHTMLValues(bvs);
}, TIME_INTERVAL_MS)
