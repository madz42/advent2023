const { readInputFile, splitByLine } = require('../utils');

const file = splitByLine(readInputFile('data'));

const strLen = file[0].length;
const numsArr = [];

const isDigit = (char) => {
  return '0123456789'.includes(char);
};

const notEmpty = (char) => {
  return !'.1234567890'.includes(char);
};

const checkForSpecialCharAround = (iCur, jCur) => {
  let foundChar = false;
  for (let i = Math.max(iCur - 1, 0); i <= Math.min(iCur + 1, file.length - 1); i++) {
    for (let j = Math.max(jCur - 1, 0); j <= Math.min(jCur + 1, strLen - 1); j++) {
      if (notEmpty(file[i][j])) foundChar = true;
    }
  }
  return foundChar;
};

const checkLineForNumbers = (string, i) => {
  let num = { value: '', position: [] };
  for (let j = 0; j < strLen; j++) {
    if (isDigit(string[j])) {
      num = { value: `${num.value}${string[j]}`, position: [...num.position, [i, j]] };
    } else {
      if (num.value !== '') {
        numsArr.push(num);
        num = { value: '', position: [] };
      }
    }
  }
  if (num.value !== '') numsArr.push(num);
};

file.forEach((line, i) => checkLineForNumbers(line, i));

const checkedArr = numsArr.map((num) => {
  return {
    ...num,
    valid: num.position.map((pos) => checkForSpecialCharAround(pos[0], pos[1])).some((x) => x === true),
  };
});

console.log(checkedArr.reduce((acc, x) => (acc += x.valid === true ? parseInt(x.value) : 0), 0));
