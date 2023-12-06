const { readInputFile, splitByLine } = require('../utils');

const file = splitByLine(readInputFile('data'));

const cards = file.map((line) => {
  return {
    win: line
      .split(' | ')[0]
      .split(': ')[1]
      .split(' ')
      .filter((n) => n !== '')
      .map((n) => parseInt(n)),
    numbers: line
      .split(' | ')[1]
      .split(' ')
      .filter((n) => n !== '')
      .map((n) => parseInt(n)),
  };
});

const checkCardWin = (card) => {
  let matches = 0;
  card.win.forEach((n) => {
    if (card.numbers.includes(n)) matches++;
  });
  return { ...card, worth: getWorth(matches) };
};

const getWorth = (matches) => {
  if (matches === 0) return matches;
  return Math.pow(2, matches - 1);
};

console.log(cards.map((c) => checkCardWin(c)).reduce((acc, card) => acc + card.worth, 0));
