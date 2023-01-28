
const mySpan = document.getElementById("data");
let bvs = beginBVs;
let timePassed = 0;
const TIME_INTERVAL_MS = 500;

setInterval(() => {
  timePassed += TIME_INTERVAL_MS
  bvs = handleIter(bvs, timePassed)
  mySpan.innerHTML = JSON.stringify(bvs, null, 2)
}, TIME_INTERVAL_MS)

console.log()
