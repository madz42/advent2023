const { readInputFile, splitByLine } = require('../utils');

const file = splitByLine(readInputFile('test'));

console.log(file);
