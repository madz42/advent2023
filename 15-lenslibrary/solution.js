const { readInputFile } = require('../utils');

const file = readInputFile(!!process.argv[2] ? process.argv[2] : 'data').split(',');

const hashIt = (num, char) => {
  return ((num + char.charCodeAt(0)) * 17) % 256;
};

const hashLine = (line) => {
  return line.split('').reduce((acc, char) => hashIt(acc, char), 0);
};

let boxes = Array(256)
  .fill(0)
  .map((x) => []);

// apply HASHMAP steps
file.forEach((step) => {
  let label, focal, boxNum;
  if (step.includes('=')) {
    //add lens
    [label, focal] = step.split('=');
    focal = parseInt(focal);
    boxNum = hashLine(label);
    if (boxes[boxNum].some((lens) => lens.label === label)) {
      //replace
      boxes[boxNum] = boxes[boxNum].map((lens) => {
        if (lens.label === label) return { ...lens, focal };
        return lens;
      });
    } else {
      //add
      boxes[boxNum].push({ label, focal });
    }
  } else {
    //remove lens
    label = step.split('-')[0];
    boxNum = hashLine(label);
    boxes[boxNum] = boxes[boxNum]
      .map((lens) => {
        if (lens.label === label) return null;
        return lens;
      })
      .filter((lens) => lens !== null);
  }
});

const calculateFocusingPower = () => {
  let sum = 0;
  boxes.forEach((box, bi) => {
    box.forEach((lens, li) => {
      sum += lens.focal * (li + 1) * (bi + 1);
    });
  });
  return sum;
};

console.log(
  'PART1:',
  file.map((line) => hashLine(line)).reduce((acc, x) => acc + x, 0)
);
console.log('PART2:', calculateFocusingPower());
