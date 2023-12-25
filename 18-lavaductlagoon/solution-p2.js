const { readInputFile, splitByLine } = require('../utils');

let digPoints = [[0, 0]];
let directions = { U: [-1, 0], D: [1, 0], L: [0, -1], R: [0, 1] };

let trenchLength = 0;

const file = readInputFile(!!process.argv[2] ? process.argv[2] : 'data');

let input = file;
splitByLine(input).forEach((line) => {
  let hex = line.split(' ').reverse()[0];
  hex = hex.slice(2, -1);
  let direction = directions['RDLU'[parseInt(hex[hex.length - 1], 10)]];
  let steps = parseInt(hex.slice(0, -1), 16);
  trenchLength += steps;
  let [r, c] = digPoints[digPoints.length - 1];
  digPoints.push([r + direction[0] * steps, c + direction[1] * steps]);
});

let volume =
  Math.abs(
    digPoints.reduce((acc, _, i) => {
      let prev = digPoints[i - 1] || digPoints[digPoints.length - 1];
      let next = digPoints[(i + 1) % digPoints.length];
      return acc + digPoints[i][0] * (prev[1] - next[1]);
    }, 0)
  ) / 2;

let innerVolume = volume - trenchLength / 2 + 1;

console.log(innerVolume + trenchLength);
