const { readInputFile, splitByLine } = require('../utils');

let [times, distances] = splitByLine(readInputFile('data'))
  .map((x) => x.split(': '))
  .map((x) => x[1])
  .map((x) => x.split(' '))
  .map((x) => x.filter((y) => y !== ''))
  .map((x) => x.map((y) => parseInt(y)));

const records = times.map((x, i) => {
  return { time: x, distance: distances[i] };
});

console.log(records);

const waysToWin = records.map((rec) => {
  const possibleDistances = [];
  for (let waitTime = 1; waitTime <= rec.time; waitTime++) {
    possibleDistances.push((rec.time - waitTime) * waitTime);
  }
  return possibleDistances.filter((x) => x > rec.distance).length;
});

console.log(waysToWin);
console.log(waysToWin.reduce((acc, x) => acc * x, 1));
