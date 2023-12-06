const { readInputFile, splitByLine } = require('../utils');

const file = splitByLine(readInputFile('data'));

const strLen = file[0].length;
const numsArr = [];

const isDigit = (char) => {
  return '0123456789'.includes(char);
};

const hasStar = (char) => {
  return char === '*';
};

const checkForSpecialCharAround = (iCur, jCur) => {
  let foundChar = null;
  for (let i = Math.max(iCur - 1, 0); i <= Math.min(iCur + 1, file.length - 1); i++) {
    for (let j = Math.max(jCur - 1, 0); j <= Math.min(jCur + 1, strLen - 1); j++) {
      if (hasStar(file[i][j])) foundChar = [i, j];
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

const checkedArr = numsArr
  .map((num) => {
    return {
      ...num,
      star: num.position.map((pos) => checkForSpecialCharAround(pos[0], pos[1])).filter((x) => x !== null),
    };
  })
  .filter((x) => x.star.length > 0);

const preSum = checkedArr.map((x) => {
  return { value: parseInt(x.value), star: x.star[0], counted: false };
});

let sum = 0;
for (let i = 0; i < preSum.length - 1; i++) {
  for (let j = i + 1; j < preSum.length; j++) {
    if (
      preSum[i].star[0] === preSum[j].star[0] &&
      preSum[i].star[1] === preSum[j].star[1] &&
      preSum[i].counted === false &&
      preSum[j].counted === false
    ) {
      preSum[i].counted = true;
      preSum[j].counted = true;
      sum += preSum[i].value * preSum[j].value;
    }
  }
}
console.log(sum);
