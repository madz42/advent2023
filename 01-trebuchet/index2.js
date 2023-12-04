const { readInputFile, splitByLine } = require('../utils');

const file = splitByLine(readInputFile('data'));

const nums = [
  ['one', 1],
  ['two', 2],
  ['three', 3],
  ['four', 4],
  ['five', 5],
  ['six', 6],
  ['seven', 7],
  ['eight', 8],
  ['nine', 9],
  ['1', 1],
  ['2', 2],
  ['3', 3],
  ['4', 4],
  ['5', 5],
  ['6', 6],
  ['7', 7],
  ['8', 8],
  ['9', 9],
];

const allNumbers = file.map((line) => {
  const lineCopy = line;
  const registeredNumbers = line.split('').map((x) => '');
  nums.forEach((num) => {
    line = lineCopy;
    while (line.includes(num[0])) {
      const place = line.indexOf(num[0]);
      registeredNumbers[place] = num[1];
      line = line.split('');
      line[place] = '.';
      line = line.join('');
    }
  });
  return registeredNumbers.filter((x) => x !== '');
});

const sum = allNumbers.map((el) => {
  if (el.length >= 2) {
    return parseInt(`${el[0]}${el[el.length - 1]}`);
  } else return parseInt(`${el}${el}`);
});
console.log(sum.reduce((x, a) => x + a));
