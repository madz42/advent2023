const { readInputFile, splitByLine, createCache } = require('../utils');

const file = splitByLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data')).map((line) => line.split(' '));
const cache = createCache();

const countPossibleSolutions = (arrangement, sequence) => {
  if (arrangement.length === 0) return sequence.length === 0 ? 1 : 0;
  if (sequence.length === 0) return arrangement.includes('#') ? 0 : 1;

  const key = [arrangement, sequence];
  if (cache.check(key) !== undefined) return cache.check(key);

  let result = 0;
  if (arrangement[0] === '.' || arrangement[0] === '?') {
    result += countPossibleSolutions(arrangement.slice(1), sequence);
  }
  if (arrangement[0] === '#' || arrangement[0] === '?') {
    if (
      sequence[0] <= arrangement.length &&
      !arrangement.slice(0, sequence[0]).includes('.') &&
      (sequence[0] === arrangement.length || arrangement[sequence[0]] !== '#')
    ) {
      result += countPossibleSolutions(arrangement.slice(sequence[0] + 1), sequence.slice(1));
    }
  }
  cache.store(key, result);
  return result;
};
const sumPossibleSolutions = (repeats) => {
  let totalPossibleWays = 0;
  file.forEach((line) => {
    const [arrangement, seqString] = line;
    const sequence = seqString.split(',').map((x) => parseInt(x));
    const multiArrangement = Array(repeats).fill(arrangement).join('?');
    const multiSequence = Array(repeats).fill(sequence).flat();
    totalPossibleWays += countPossibleSolutions(multiArrangement, multiSequence);
  });
  return totalPossibleWays;
};

console.log('PART1:', sumPossibleSolutions(1));
console.log('PART2:', sumPossibleSolutions(5));
