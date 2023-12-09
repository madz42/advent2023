const { readInputFile, splitByLine } = require('../utils');

const [route, file] = readInputFile('data').split(/\n\n/);

const nodes = {};
splitByLine(file).forEach((line) => {
  const [left, right] = line.split(' = ')[1].split(', ');
  nodes[line.split(' = ')[0]] = { L: left.replace('(', ''), R: right.replace(')', '') };
});

const [start, finish] = ['AAA', 'ZZZ'];

let step = 0;
let currentNode = start;
let finished = false;
do {
  currentNode = nodes[currentNode][route[step % route.length]];
  if (currentNode !== finish) {
    step++;
  } else {
    finished = true;
  }
} while (!finished);

console.log(step + 1);
