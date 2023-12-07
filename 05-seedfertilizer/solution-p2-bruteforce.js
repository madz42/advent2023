const { readInputFile, splitByLine } = require('../utils');

const file = readInputFile('data').split(/\n\n/);

const preSeeds = file[0]
  .split(': ')[1]
  .split(' ')
  .map((x) => parseInt(x));

const seeds = [];
for (let i = 0; i < preSeeds.length; i += 2) {
  let pair = [preSeeds[i], preSeeds[i + 1]];
  seeds.push(pair);
}

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

const trackedSeeds = seeds.map((seedsRange) => {
  console.log(seedsRange);
  let currentMin = Infinity;
  for (let i = 0; i < seedsRange[1]; i++) {
    let seed = seedsRange[0] + i;
    almanac.forEach((page) => {
      let found = false;
      page.ranges.forEach((range, i) => {
        if (seed >= range[1] && seed < range[1] + range[2] && !found) {
          found = true;
          const diff = seed - range[1];
          seed = range[0] + diff;
        }
      });
    });
    currentMin = seed < currentMin ? seed : currentMin;
  }
  return currentMin;
});

console.log(Math.min(...trackedSeeds));
