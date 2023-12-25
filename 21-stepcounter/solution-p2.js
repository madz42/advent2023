const { readInputFile, splitByLine } = require('../utils');

const file = splitByLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data'));

let initStartPoint = null;
const garden = file.map((line, i) => {
  if (line.includes('S')) {
    initStartPoint = [i, line.indexOf('S')];
    return line.replace('S', '.');
  } else {
    return line;
  }
});

const checkAround = (i, j) => {
  const possibleSteps = [];
  if (i - 1 >= 0 && garden[i - 1] && garden[i - 1][j] !== undefined && garden[i - 1][j] === '.')
    possibleSteps.push([i - 1, j]);
  if (i + 1 < garden.length && garden[i + 1] && garden[i + 1][j] !== undefined && garden[i + 1][j] === '.')
    possibleSteps.push([i + 1, j]);
  if (j - 1 >= 0 && garden[i] && garden[i][j - 1] !== undefined && garden[i][j - 1] === '.')
    possibleSteps.push([i, j - 1]);
  if (garden[i] && j + 1 < garden[i].length && garden[i][j + 1] !== undefined && garden[i][j + 1] === '.')
    possibleSteps.push([i, j + 1]);
  return possibleSteps.map((step) => step.join(':'));
};

const walkGarden = (startPoint, steps) => {
  let stepsQueue = [startPoint.join(':')];
  for (let i = 0; i < steps; i++) {
    let nextQueue = [];
    for (const step of stepsQueue) {
      const newSteps = checkAround(...step.split(':').map((x) => parseInt(x)));
      for (const nStep of newSteps) {
        if (!nextQueue.includes(nStep)) nextQueue.push(nStep);
      }
    }
    stepsQueue = [...nextQueue];
  }
  return stepsQueue.length;
};

// fullTile, 3quatersTR, 3quatersTL,3quatersBR, 3quatersBL, 1quaterTR, 1quaterTL, 1quaterBR, 1quaterBL, cornerT, cornerR, cornerL, cornerB
const gardenSize = garden.length;
const totalSteps = 26501365;
const maxTileNum = Math.floor(totalSteps / gardenSize);
const stepsLeftFor1Q = (totalSteps % gardenSize) - 1;
const stepsLeftFor3Q = (totalSteps % gardenSize) + gardenSize - 1;
const stepsLeftForC = totalSteps - (maxTileNum - 1) * gardenSize - (gardenSize - 1) / 2 - 1;

const fullTileOdd = walkGarden(initStartPoint, gardenSize);
const fullTileEven = walkGarden(initStartPoint, gardenSize + 1);
// console.log('fulls:', fullTileOdd, fullTileEven);

const cornerT = walkGarden([gardenSize - 1, initStartPoint[1]], stepsLeftForC);
const cornerB = walkGarden([0, initStartPoint[1]], stepsLeftForC);
const cornerR = walkGarden([initStartPoint[0], 0], stepsLeftForC);
const cornerL = walkGarden([initStartPoint[0], gardenSize - 1], stepsLeftForC);
// console.log('corners:', cornerT, cornerR, cornerB, cornerL);

const tile3quatersTR = walkGarden([gardenSize - 1, 0], stepsLeftFor3Q);
const tile3quatersTL = walkGarden([gardenSize - 1, gardenSize - 1], stepsLeftFor3Q);
const tile3quatersBR = walkGarden([0, 0], stepsLeftFor3Q);
const tile3quatersBL = walkGarden([0, gardenSize - 1], stepsLeftFor3Q);
// console.log('3/4:', stepsLeftFor3Q, tile3quatersTR, tile3quatersTL, tile3quatersBR, tile3quatersBL);

const tile1quaterTR = walkGarden([gardenSize - 1, 0], stepsLeftFor1Q);
const tile1quaterTL = walkGarden([gardenSize - 1, gardenSize - 1], stepsLeftFor1Q);
const tile1quaterBR = walkGarden([0, 0], stepsLeftFor1Q);
const tile1quaterBL = walkGarden([0, gardenSize - 1], stepsLeftFor1Q);
// console.log('1/4:', tile1quaterTR, tile1quaterTL, tile1quaterBR, tile1quaterBL);

let [totEven, totOdds] = [Math.ceil((maxTileNum * 2 - 1) / 2), Math.floor((maxTileNum * 2 - 1) / 2)];
for (let i = totOdds - 1; i > 0; i--) totOdds += i * 2;
for (let i = totEven - 1; i > 0; i--) totEven += i * 2;
// console.log('odds/even num', totOdds, totEven);

console.log(
  maxTileNum * (tile1quaterBL + tile1quaterBR + tile1quaterTL + tile1quaterTR) +
    (maxTileNum - 1) * (tile3quatersBL + tile3quatersBR + tile3quatersTL + tile3quatersTR) +
    cornerB +
    cornerL +
    cornerR +
    cornerT +
    totEven * fullTileEven +
    totOdds * fullTileOdd
);
