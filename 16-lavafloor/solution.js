const { readInputFile, splitByLine } = require('../utils');

const file = splitByLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data'));

const directions = {
  R: { i: 0, j: 1 },
  D: { i: 1, j: 0 },
  L: { i: 0, j: -1 },
  U: { i: -1, j: 0 },
};

const makeMapCopy = () => {
  return file.map((line) =>
    line.split('').map((char) => {
      return {
        cell: char,
        energized: {
          R: false,
          D: false,
          L: false,
          U: false,
        },
      };
    })
  );
};

let freshMap = makeMapCopy();
let beams = [];

const checkCell = (i, j, dir) => {
  //check bounds continue or kill
  if (i < 0 || j < 0 || i >= freshMap.length || j >= freshMap[0].length) return 'kill';
  const curCell = freshMap[i][j];
  if (curCell.energized[dir] === true) {
    return 'kill';
  } else {
    freshMap[i][j].energized[dir] = true;
    if (curCell.cell === '.') {
      return dir;
    } else if (curCell.cell === '\\') {
      if (dir === 'R') return 'D';
      if (dir === 'D') return 'R';
      if (dir === 'L') return 'U';
      if (dir === 'U') return 'L';
    } else if (curCell.cell === '/') {
      if (dir === 'R') return 'U';
      if (dir === 'D') return 'L';
      if (dir === 'L') return 'D';
      if (dir === 'U') return 'R';
    } else if (curCell.cell === '-') {
      if (dir === 'R' || dir === 'L') return dir;
      if (dir === 'D' || dir === 'U') {
        //add new beam R
        beams.push({ pos: { i, j }, dir: 'R' });
        return 'L';
      }
    } else if (curCell.cell === '|') {
      if (dir === 'D' || dir === 'U') return dir;
      if (dir === 'R' || dir === 'L') {
        //add new beam D
        beams.push({ pos: { i, j }, dir: 'D' });
        return 'U';
      }
    }
  }
};

const shootTheBeam = (beam) => {
  let keepShooting = true;
  while (keepShooting) {
    const res = checkCell(beam.pos.i, beam.pos.j, beam.dir);
    if (res !== 'kill') {
      beam.dir = res;
      beam.pos = { i: beam.pos.i + directions[res].i, j: beam.pos.j + directions[res].j };
    } else {
      keepShooting = false;
    }
  }
};

const beamResults = [];
const getEnergizedMapResult = (startBeam) => {
  freshMap = makeMapCopy();
  beams = [startBeam];
  for (let n = 0; n < beams.length; n++) {
    shootTheBeam(beams[n]);
  }

  const energizedMap = freshMap.map((line) =>
    line.map((char) => (Object.values(char.energized).some((x) => x === true) ? '#' : '.'))
  );
  const sum = energizedMap.reduce(
    (acc, line) => acc + line.reduce((accIn, char) => accIn + (char === '#' ? 1 : 0), 0),
    0
  );
  return sum;
};

const [rows, cols] = [freshMap.length, freshMap[0].length];
//top and bottom
for (let j = 0; j < cols; j++) {
  beamResults.push(getEnergizedMapResult({ pos: { i: 0, j }, dir: 'D' }));
  beamResults.push(getEnergizedMapResult({ pos: { i: rows - 1, j }, dir: 'U' }));
}
//left and right
for (let i = 0; i < rows; i++) {
  beamResults.push(getEnergizedMapResult({ pos: { i, j: 0 }, dir: 'R' }));
  beamResults.push(getEnergizedMapResult({ pos: { i, j: cols - 1 }, dir: 'L' }));
}
console.log('PART1:', getEnergizedMapResult({ pos: { i: 0, j: 0 }, dir: 'R' }));
console.log('PART2:', Math.max(...beamResults));
