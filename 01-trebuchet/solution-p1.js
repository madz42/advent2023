const { readInputFile, splitByLine } = require('../utils');

const file = splitByLine(readInputFile('data'));

const stripped = file.map((line) => {
  return line
    .split('')
    .map((el) => {
      return '123456789'.includes(el) ? el : '';
    })
    .filter((x) => x !== '');
});

const sum = stripped.map((el) => {
  if (el.length >= 2) {
    return parseInt(`${el[0]}${el[el.length - 1]}`);
  } else return parseInt(`${el}${el}`);
});

console.log(sum.reduce((x, a) => x + a));
