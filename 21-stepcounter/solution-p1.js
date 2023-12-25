const { readInputFile, splitByLine } = require('../utils');

const file = splitByLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data'));

let startPoint = null;
const garden = file.map((line, i) => {
  if (line.includes('S')) {
    startPoint = [i, line.indexOf('S')];
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

const steps = 64;
// const steps = 12;
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

let showGarden = [...garden].map((line) => line.split(''));
stepsQueue.forEach((step) => {
  const [i, j] = step.split(':').map((x) => parseInt(x));
  showGarden[i][j] = 'O';
});
// console.log(showGarden.map((line) => line.join('')).join('\n'));

console.log(stepsQueue.length);
