const { readInputFile, splitByLine } = require('../utils');

const file = splitByLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data'));

const bricks = file
  .map((line) => line.split('~').map((part) => part.split(',').map((x) => parseInt(x))))
  .sort((a, b) => a[0][2] - b[0][2]);

const checkIfUnder = (brickA, brickB) => {
  return !(
    brickA[1][0] < brickB[0][0] ||
    brickB[1][0] < brickA[0][0] ||
    brickA[1][1] < brickB[0][1] ||
    brickB[1][1] < brickA[0][1]
  );
};

const dropBrick = (brick, num) => {
  brick[0][2] -= num;
  brick[1][2] -= num;
};

//fall
for (let i = 0; i < bricks.length; i++) {
  const curBrick = bricks[i];
  let levelToFall = 1;
  if (i === 0) {
    if (curBrick[0][2] !== 1) dropBrick(curBrick, curBrick[0][2] - 1);
  } else {
    for (let j = i - 1; j >= 0; j--) {
      if (checkIfUnder(curBrick, bricks[j])) {
        levelToFall = Math.max(levelToFall, bricks[j][1][2]);
      }
    }
    dropBrick(curBrick, curBrick[0][2] - levelToFall - 1);
  }
}

bricks.sort((a, b) => (a[0][2] !== b[0][2] ? a[0][2] - b[0][2] : a[1][2] - b[1][2]));

let laysOn = Array(bricks.length)
  .fill(0)
  .map((x) => []);
let supports = Array(bricks.length)
  .fill(0)
  .map((x) => []);

for (let i = 0; i < bricks.length - 1; i++) {
  for (let j = i + 1; j < bricks.length; j++) {
    if (checkIfUnder(bricks[j], bricks[i]) && bricks[j][0][2] === bricks[i][1][2] + 1) {
      laysOn[j].push(i);
      supports[i].push(j);
    }
  }
}

// console.log(laysOn);
// console.log(supports);

let countBricks = 0;
for (let i = 0; i < supports.length; i++) {
  if (supports[i].length === 0 || supports[i].every((i) => laysOn[i].length >= 2)) countBricks++;
}

console.log('PART1:', countBricks);

// chain reaction
const chains = [];

const chainIt = (num) => {
  const fallQueue = [];
  supports[num].forEach((sup) => {
    if (laysOn[sup].length === 1) fallQueue.push(sup);
  });
  for (let j = 0; j < fallQueue.length; j++) {
    const id = fallQueue[j];
    supports[id].forEach((x) => {
      if (laysOn[x].every((y) => fallQueue.includes(y)) && !fallQueue.includes(x)) {
        fallQueue.push(x);
      }
    });
  }
  return fallQueue.length;
};

for (let i = 0; i < supports.length; i++) chains.push(chainIt(i));

console.log(
  'PART2:',
  chains.reduce((acc, val) => acc + val, 0)
);
