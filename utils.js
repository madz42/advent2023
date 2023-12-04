const fs = require('fs');

const readInputFile = (fileName) => {
  try {
    const data = fs.readFileSync(`./${fileName}.input`, 'utf-8');
    return data;
  } catch (err) {
    console.error(err);
    return;
  }
};

const splitByLine = (file) => file.split(/\r?\n/);

module.exports = { readInputFile, splitByLine };
