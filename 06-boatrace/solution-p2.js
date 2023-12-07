const { readInputFile, splitByLine } = require('../utils');

let [time, distance] = splitByLine(readInputFile('data'))
  .map((x) => x.split(':'))
  .map((x) => x[1])
  .map((x) => x.replaceAll(' ', ''))
  .map((y) => parseInt(y));

const record = { time, distance };

console.log(record);

let waysToWin = 0;
for (let waitTime = 1; waitTime <= record.time; waitTime++) {
  if ((record.time - waitTime) * waitTime > record.distance) waysToWin++;
}

console.log(waysToWin);
