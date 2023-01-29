// get html elements
const elements = {};
elements.redBloodCellcount = document.getElementById("red-blood-cell-count");
elements.whiteBloodCellCount = document.getElementById("white-blood-cell-count");
elements.thrombocytesCount = document.getElementById("thrombocytes-count");
elements.aggressiveLeukemiaCellCount = document.getElementById("aggressive-leukemia-cell-count");
elements.nonAggressiveLeukemiaCellCount = document.getElementById("non-aggressive-leukemia-cell-count");
elements.drugInAction = document.getElementById("drug-in-action");
elements.isAlive = document.getElementById("is-alive");
elements.criticalTime = document.getElementById("critical-time");


let bvs = beginBVs;
let timePassed = 0;
const TIME_INTERVAL_MS = 500;

const updateHTMLValues = (bvs) => {
  elements.redBloodCellcount.innerHTML = bvs.whiteBloodCells;
  elements.whiteBloodCellCount.innerHTML = bvs.redBloodCells;
  elements.thrombocytesCount.innerHTML = bvs.thrombocytes;
  elements.aggressiveLeukemiaCellCount.innerHTML = bvs.aggressiveLeukemiaCells;
  elements.nonAggressiveLeukemiaCellCount.innerHTML = bvs.nonAggressiveLeukemiaCells;
  elements.drugInAction.innerHTML = bvs.drug;
  elements.isAlive.innerHTML = bvs.alive;
};

updateHTMLValues(bvs);

setInterval(() => {
  timePassed += TIME_INTERVAL_MS
  bvs = handleIter(bvs, timePassed)

  updateHTMLValues(bvs);
}, TIME_INTERVAL_MS)
