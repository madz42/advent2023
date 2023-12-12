const { readInputFile, splitByLine } = require('../utils');

const file = splitByLine(readInputFile('data'));

const dirSeq = 'URDL';
const pipeShapes = [
  ['F', '0110'],
  ['-', '0101'],
  ['7', '0011'],
  ['|', '1010'],
  ['J', '1001'],
  ['L', '1100'],
  ['S', '1111'],
  ['.', '0000'],
];

const checkEntrance = (entrance, map, point) => {
  const vector = getVector(entrance);
  const pipe = map[point[0] + vector[0]][point[1] + vector[1]];
  if (!!!pipe) return false;
  const checkDir = 'DLUR'[dirSeq.indexOf(entrance)];
  return pipeShapes.find((p) => p[0] === pipe)[1][dirSeq.indexOf(checkDir)] === '1';
};

const getExits = (pipe) => {
  const connections = pipeShapes.find((p) => p[0] === pipe)[1];
  return dirSeq
    .split('')
    .map((d, i) => (connections[i] === '1' ? d : ''))
    .join('');
};

const areWeBack = () => {
  return curPoint[0] === startPoint[0] && curPoint[1] === startPoint[1];
};
const cameFromThere = (direction) => {
  const vector = getVector(direction);
  return curPoint[0] + vector[0] === prevPoint[0] && curPoint[1] + vector[1] === prevPoint[1];
};

const isInBounds = (direction) => {
  const vector = getVector(direction);
  return (
    curPoint[0] + vector[0] >= 0 &&
    curPoint[0] + vector[0] <= file.length &&
    curPoint[1] + vector[1] >= 0 &&
    curPoint[1] + vector[1] <= file[0].length
  );
};

const getVector = (direction) => {
  switch (direction) {
    case 'U':
      return [-1, 0];
    case 'R':
      return [0, 1];
    case 'D':
      return [1, 0];
    case 'L':
      return [0, -1];
  }
};

const moveAlongThePipe = () => {
  const currentPipe = file[curPoint[0]][curPoint[1]];
  const possibleDirs = getExits(currentPipe);
  let vector = [0, 0];
  for (let dirToCheck of possibleDirs) {
    if (
      possibleDirs.includes(dirToCheck) &&
      isInBounds(dirToCheck) &&
      checkEntrance(dirToCheck, file, curPoint) &&
      !cameFromThere(dirToCheck)
    ) {
      vector = getVector(dirToCheck);
      prevPoint = [...curPoint];
      visualMap[curPoint[0]][curPoint[1]] = currentPipe;
      curPoint = [curPoint[0] + vector[0], curPoint[1] + vector[1]];
      steps++;
      break;
    }
  }
};

const isPipe = (pipe) => {
  return 'F7JL|-S'.includes(pipe);
};

const checkAroundForOuterSpace = (i, j) => {
  for (let ii = -1; ii < 2; ii++) {
    for (let jj = -1; jj < 2; jj++) {
      if (visualMap[i + ii][j + jj] === ' ') return true;
    }
  }
  return false;
};

//MAIN

//prepare visual map
let visualMap = new Array(file.length).fill(null);
visualMap = visualMap.map(() => new Array(file[0].length).fill('.'));

//find start
let startPoint = [null, null];
file.forEach((line, i) => {
  if (line.indexOf('S') !== -1) startPoint = [i, line.indexOf('S')];
});
let curPoint = [...startPoint];
let prevPoint = [...startPoint];
let steps = 0;

//build pipe loop
while (!areWeBack() || steps === 0) {
  moveAlongThePipe();
}

//strech map
let stretchedMap = [];
//add new lines
for (let i = 0; i < visualMap.length - 1; i++) {
  const newLine = [];
  for (let j = 0; j < visualMap[0].length; j++) {
    //new line, check top with bottom connection
    if (checkEntrance('U', visualMap, [i + 1, j]) && checkEntrance('D', visualMap, [i, j])) {
      newLine.push('|');
    } else newLine.push('.');
  }
  stretchedMap.push([...visualMap[i]]);
  stretchedMap.push(newLine);
}
stretchedMap.push([...visualMap[visualMap.length - 1]]);
//add new rows
stretchedMap = stretchedMap.map((line, i) => {
  const oldLine = [...line];
  const newLine = [];
  for (let j = 0; j < oldLine.length - 1; j++) {
    //new row, check left to right connection
    if (checkEntrance('L', stretchedMap, [i, j + 1]) && checkEntrance('R', stretchedMap, [i, j])) {
      newLine.push(oldLine[j]);
      newLine.push('-');
    } else {
      newLine.push(oldLine[j]);
      newLine.push('.');
    }
  }
  newLine.push(oldLine[oldLine.length - 1]);
  return newLine;
});

//remove outer dots, cast beams, marking outer space
visualMap = stretchedMap.map((line) => {
  //left to right
  for (let i = 0; i < line.length; i++) {
    if (isPipe(line[i])) break;
    line[i] = line[i] === '.' ? ' ' : line[i];
  }
  //right to left
  for (let i = line.length - 1; i >= 0; i--) {
    if (isPipe(line[i])) break;
    line[i] = line[i] === '.' ? ' ' : line[i];
  }
  return line;
});
for (let j = 0; j < visualMap[0].length; j++) {
  //top to bottom
  for (let i = 0; i < visualMap.length; i++) {
    if (isPipe(visualMap[i][j])) break;
    visualMap[i][j] = visualMap[i][j] === '.' ? ' ' : visualMap[i][j];
  }
  //bottom to top
  for (let i = visualMap.length - 1; i >= 0; i--) {
    if (isPipe(visualMap[i][j])) break;
    visualMap[i][j] = visualMap[i][j] === '.' ? ' ' : visualMap[i][j];
  }
}

//find remaining tiles with connection to outer space
let foundNew = true;
while (foundNew) {
  foundNew = false;
  for (let i = 0; i < visualMap.length; i++) {
    for (let j = 0; j < visualMap[0].length; j++) {
      if (visualMap[i][j] === '.' && checkAroundForOuterSpace(i, j)) {
        visualMap[i][j] = ' ';
        foundNew = true;
      }
    }
  }
}

//squeeze map back to original size
visualMap = visualMap.map((line) => line.filter((x, i) => i % 2 === 0));
visualMap = visualMap.filter((_, i) => i % 2 === 0);

//count inner tiles
let tilesCount = 0;
for (let i = 0; i < visualMap.length; i++) {
  for (let j = 0; j < visualMap[0].length; j++) {
    if (visualMap[i][j] === '.') tilesCount++;
  }
}

//visualisation
// console.log('STRETCHED MAP');
// console.log(stretchedMap.map((line) => line.join('')).join('\n'));
// console.log('SQUEEZED BACK MAP');
// console.log(visualMap.map((line) => line.join('')).join('\n'));

// console.log('Start Point:', startPoint);
console.log('PART1:', steps / 2);
console.log('PART2:', tilesCount);
