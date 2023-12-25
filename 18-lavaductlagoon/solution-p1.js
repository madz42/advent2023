const { readInputFile, splitByLine } = require('../utils');

const file = splitByLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data'));
const digPlan = file.map((line) => {
  const [dir, steps, color] = line.split(' ');
  return { direction: dir, steps: parseInt(steps), hexColor: color.slice(2, 8) };
});
let [curH, maxH, minH, curW, maxW, minW] = [0, 0, 0, 0, 0, 0];
for (const step of digPlan) {
  if (step.direction === 'R') curW += step.steps;
  if (step.direction === 'L') curW -= step.steps;
  if (step.direction === 'D') curH += step.steps;
  if (step.direction === 'U') curH -= step.steps;
  maxH = Math.max(curH, maxH);
  maxW = Math.max(curW, maxW);
  minH = Math.min(curH, minH);
  minW = Math.min(curW, minW);
}
// console.log(maxH, minH, maxW, minW);

let dirt = Array(maxH + 1 + Math.abs(minH))
  .fill(0)
  .map(() => Array(maxW + 1 + Math.abs(minW)).fill(0));
dirt = dirt.map((line) => line.map((x) => '.'));

// console.log(dirt);

// do digging
let digger = [Math.abs(minH), Math.abs(minW)];
for (const step of digPlan) {
  // console.log(digger, step);
  if (step.direction === 'R') {
    for (let i = 1; i <= step.steps; i++) dirt[digger[0]][digger[1] + i] = '#';
    digger[1] += step.steps;
  }
  if (step.direction === 'L') {
    for (let i = 1; i <= step.steps; i++) dirt[digger[0]][digger[1] - i] = '#';
    digger[1] -= step.steps;
  }
  if (step.direction === 'D') {
    for (let i = 1; i <= step.steps; i++) dirt[digger[0] + i][digger[1]] = '#';
    digger[0] += step.steps;
  }
  if (step.direction === 'U') {
    for (let i = 1; i <= step.steps; i++) dirt[digger[0] - i][digger[1]] = '#';
    digger[0] -= step.steps;
  }
  // console.log(dirt.map((line) => line.join('')).join('\n'));
  // console.log('---');
}

// console.log(dirt.map((line) => line.join('')).join('\n'));

//dig out rest
//remove outer dots, cast beams, marking outer space
dirt = dirt.map((line) => {
  //left to right
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '#') break;
    line[i] = line[i] === '.' ? ' ' : line[i];
  }
  //right to left
  for (let i = line.length - 1; i >= 0; i--) {
    if (line[i] === '#') break;
    line[i] = line[i] === '.' ? ' ' : line[i];
  }
  return line;
});
for (let j = 0; j < dirt[0].length; j++) {
  //top to bottom
  for (let i = 0; i < dirt.length; i++) {
    if (dirt[i][j] === '#') break;
    dirt[i][j] = dirt[i][j] === '.' ? ' ' : dirt[i][j];
  }
  //bottom to top
  for (let i = dirt.length - 1; i >= 0; i--) {
    if (dirt[i][j] === '#') break;
    dirt[i][j] = dirt[i][j] === '.' ? ' ' : dirt[i][j];
  }
}

const checkAroundForOuterSpace = (i, j) => {
  for (let ii = -1; ii < 2; ii++) {
    for (let jj = -1; jj < 2; jj++) {
      if (dirt[i + ii][j + jj] === ' ') return true;
    }
  }
  return false;
};

//find remaining tiles with connection to outer space
let foundNew = true;
while (foundNew) {
  foundNew = false;
  for (let i = 0; i < dirt.length; i++) {
    for (let j = 0; j < dirt[0].length; j++) {
      if (dirt[i][j] === '.' && checkAroundForOuterSpace(i, j)) {
        dirt[i][j] = ' ';
        foundNew = true;
      }
    }
  }
}

// console.log(dirt.map((line) => line.join('')).join('\n'));
console.log(dirt.reduce((acc, line) => acc + line.reduce((inAcc, cell) => inAcc + (cell !== ' ' ? 1 : 0), 0), 0));
