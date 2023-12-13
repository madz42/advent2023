const { readInputFile, splitByLine } = require('../utils');

const skymap = splitByLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data'));

const [repRows, repCols] = [[], []];

for (let i = 0; i < skymap[0].length; i++) {
  const row = [];
  for (let j = 0; j < skymap.length; j++) {
    row.push(skymap[j][i]);
  }
  if (row.every((x) => x === '.')) repCols.push(i);
}
skymap.forEach((line, i) => {
  if (!line.includes('#')) repRows.push(i);
});

const galaxies = [];
for (let i = 0; i < skymap.length; i++) {
  for (let j = 0; j < skymap[0].length; j++) {
    if (skymap[i][j] === '#') galaxies.push([i, j]);
  }
}

const getDistances = (expander) => {
  const distances = [];
  for (let i = 0; i < galaxies.length - 1; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      let distance = Math.abs(galaxies[i][0] - galaxies[j][0]) + Math.abs(galaxies[i][1] - galaxies[j][1]);
      repRows.forEach((r) => {
        if ((r > galaxies[i][0] && r < galaxies[j][0]) || (r < galaxies[i][0] && r > galaxies[j][0]))
          distance += expander - 1;
      });
      repCols.forEach((r) => {
        if ((r > galaxies[i][1] && r < galaxies[j][1]) || (r < galaxies[i][1] && r > galaxies[j][1]))
          distance += expander - 1;
      });
      distances.push(distance);
    }
  }
  return distances;
};

console.log(
  'PART1:',
  getDistances(2).reduce((acc, x) => acc + x, 0)
);
console.log(
  'PART2:',
  getDistances(1000000).reduce((acc, x) => acc + x, 0)
);
