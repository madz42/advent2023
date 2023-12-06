const { readInputFile, splitByLine } = require('../utils');

const file = splitByLine(readInputFile('data'));

let cards = file.map((line) => {
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

const checkCardWin = (card, id) => {
  let matches = 0;
  card.win.forEach((n) => {
    if (card.numbers.includes(n)) matches++;
  });
  return { ...card, matches, id };
};

cards = cards.map((c, i) => checkCardWin(c, i));

const wonCopies = [];
cards.forEach((c) => {
  for (let i = c.id; i < c.id + c.matches; i++) {
    wonCopies.push(cards[i + 1]);
  }
});

for (let i = 0; i < wonCopies.length - 1; i++) {
  const { id, matches } = wonCopies[i];
  const card = { id, matches };
  for (let j = card.id; j < card.id + card.matches; j++) {
    wonCopies.push(cards[j + 1]);
  }
}

console.log(wonCopies.length + cards.length);
