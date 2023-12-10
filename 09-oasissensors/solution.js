const { readInputFile, splitByLine } = require('../utils');

const file = splitByLine(readInputFile('data')).map((line) => line.split(' ').map((n) => parseInt(n)));

const buildDiffArr = (arr) => {
  const diffArr = [];
  for (let i = 1; i < arr.length; i++) {
    diffArr.push(arr[i] - arr[i - 1]);
  }
  return diffArr;
};

const extrapolateData = (data, reverse = false) => {
  const resultExtrapolation = [];
  data.forEach((line) => {
    let allElements = [];
    reverse ? allElements.push(line.reverse()) : allElements.push(line);
    while (allElements[allElements.length - 1].some((n) => n !== 0)) {
      const newDiffLine = buildDiffArr(allElements[allElements.length - 1]);
      allElements.push(newDiffLine);
    }
    let lastElements = allElements.map((n) => n[n.length - 1]).reverse();
    for (let i = 1; i < lastElements.length; i++) {
      lastElements[i] += lastElements[i - 1];
    }
    resultExtrapolation.push(lastElements[lastElements.length - 1]);
  });
  return resultExtrapolation;
};

console.log(
  'PART1:',
  extrapolateData(file).reduce((acc, n) => acc + n, 0)
);
console.log(
  'PART2:',
  extrapolateData(file, true).reduce((acc, n) => acc + n, 0)
);
