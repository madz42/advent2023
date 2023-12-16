const { readInputFile, splitByLine } = require('../utils');

const file = readInputFile(!!process.argv[2] ? process.argv[2] : 'data')
  .split('\n\n')
  .map((x) => splitByLine(x));

const compareStringsByChar = (strA, strB) => {
  let mismatches = 0;
  for (let i = 0; i < strA.length; i++) {
    if (strA[i] !== strB[i]) mismatches++;
  }
  return mismatches;
};

const compareLines = (matrix, a, b) => {
  if (a < 0 || a >= matrix.length || b < 0 || b >= matrix.length) return 0;
  return compareStringsByChar(matrix[a], matrix[b]) + compareLines(matrix, a - 1, b + 1);
};

const compareRows = (matrix, a, b) => {
  if (a < 0 || a >= matrix[0].length || b < 0 || b >= matrix[0].length) return 0;
  let [rowA, rowB] = [[], []];
  for (let i = 0; i < matrix.length; i++) {
    rowA.push(matrix[i][a]);
    rowB.push(matrix[i][b]);
  }
  [rowA, rowB] = [rowA.join(''), rowB.join('')];
  return compareStringsByChar(rowA, rowB) + compareRows(matrix, a - 1, b + 1);
};

const checkLines = (matrix) => {
  const checkedLines = Array(matrix.length - 1)
    .fill(0)
    .map((_, i) => compareLines(matrix, i, i + 1));
  return checkedLines;
};

const checkRows = (matrix) => {
  const checkedRows = Array(matrix[0].length - 1)
    .fill(0)
    .map((_, i) => compareRows(matrix, i, i + 1));
  return checkedRows;
};

const findMirror = (matrix) => {
  return [checkLines(matrix), checkRows(matrix)];
};

const calculateSum = (smudges, mirrors) => {
  return mirrors
    .map((set) => {
      const vertical = set[0].includes(smudges) ? set[0].findIndex((x) => x === smudges) + 1 : 0;
      const horizontal = set[1].includes(smudges) ? set[1].findIndex((x) => x === smudges) + 1 : 0;
      return vertical * 100 + horizontal;
    })
    .reduce((acc, x) => acc + x, 0);
};

const mirrors = file.map((matrix) => findMirror(matrix));

console.log('PART1:', calculateSum(0, mirrors));
console.log('PART2:', calculateSum(1, mirrors));
