const { readInputFile, splitByLine, findLCM } = require('../utils');

const [route, file] = readInputFile('data').split(/\n\n/);

const nodes = {};
splitByLine(file).forEach((line) => {
  const [left, right] = line.split(' = ')[1].split(', ');
  nodes[line.split(' = ')[0]] = { L: left.replace('(', ''), R: right.replace(')', '') };
});

const checkStart = (node) => node[2] === 'A';
const checkFinish = (node) => node[2] === 'Z';

const start = [];

for (const [key, _] of Object.entries(nodes)) {
  if (checkStart(key)) start.push(key);
}
const firstFinish = new Array(start.length).fill(null);

let step = 0;
let currentNode = [...start];
let finished = false;
do {
  currentNode = currentNode.map((node) => nodes[node][route[step % route.length]]);
  currentNode.forEach((n, i) => {
    if (checkFinish(n)) firstFinish[i] = step + 1;
  });
  if (firstFinish.every((x) => x !== null)) {
    finished = true;
  }
  step++;
} while (!finished);

console.log(findLCM(firstFinish));
