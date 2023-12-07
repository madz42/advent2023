const { readInputFile, splitByLine } = require('../utils');

const file = readInputFile('data').split(/\n\n/);

const seeds = file[0]
  .split(': ')[1]
  .split(' ')
  .map((x) => parseInt(x));

const almanac = [];
file.forEach((page, i) => {
  if (i !== 0) {
    const newPage = {};
    newPage.from = page.split(' map:')[0].split('-to-')[0];
    newPage.to = page.split(' map:')[0].split('-to-')[1];
    newPage.ranges = splitByLine(page.split(' map:')[1])
      .filter((x) => x !== '')
      .map((x) => x.split(' ').map((x) => parseInt(x)));
    almanac.push(newPage);
  }
});

const trackedSeeds = seeds.map((seed) => {
  almanac.forEach((page) => {
    let found = false;
    page.ranges.forEach((range) => {
      if (seed >= range[1] && seed < range[1] + range[2] && !found) {
        found = true;
        const diff = seed - range[1];
        seed = range[0] + diff;
      }
    });
  });
  return seed;
});

console.log(Math.min(...trackedSeeds));
