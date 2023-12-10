const fs = require('fs');

const readInputFile = (fileName) => {
  try {
    const data = fs.readFileSync(`./${fileName}.input`, 'utf-8');
    return data;
  } catch (err) {
    console.error(err);
    return;
  }
};

const splitByLine = (file) => file.split(/\r?\n/);

// Greatest Common Divisor
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

// Least Common Multiple
const lcm = (a, b) => (a * b) / gcd(a, b);

// LCM for array
const findLCM = (numbers) => {
  let result = 1;
  for (let i = 0; i < numbers.length; i++) {
    result = lcm(result, numbers[i]);
  }
  return result;
};

module.exports = { readInputFile, splitByLine, findLCM };
