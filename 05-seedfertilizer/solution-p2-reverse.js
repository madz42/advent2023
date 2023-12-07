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
almanac.reverse();

let i = 0;
let foundMin = false;
while (!foundMin) {
  let endSeed = i;
  almanac.forEach((page) => {
    let foundRange = false;
    page.ranges.forEach((range) => {
      if (endSeed >= range[0] && endSeed < range[0] + range[2] && !foundRange) {
        foundRange = true;
        const diff = endSeed - range[0];
        endSeed = range[1] + diff;
      }
    });
  });
  seeds.forEach((range) => {
    if (endSeed >= range[0] && endSeed < range[0] + range[1]) foundMin = true;
  });
  i++;
}

console.log(i - 1);
