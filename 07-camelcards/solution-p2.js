const { readInputFile, splitByLine } = require('../utils');

const file = splitByLine(readInputFile('data')).map((x) => {
  return { hand: x.split(' ')[0], bet: parseInt(x.split(' ')[1]) };
});

const deck = 'J23456789TQKA';
const combinations = [
  { name: 'fivekind', set: [5, 0, 0, 0, 0], power: 7 },
  { name: 'fourkind', set: [4, 1, 0, 0, 0], power: 6 },
  { name: 'fullhouse', set: [3, 2, 0, 0, 0], power: 5 },
  { name: 'threekind', set: [3, 1, 1, 0, 0], power: 4 },
  { name: 'twopair', set: [2, 2, 1, 0, 0], power: 3 },
  { name: 'onepair', set: [2, 1, 1, 1, 0], power: 2 },
  { name: 'highcard', set: [1, 1, 1, 1, 1], power: 1 },
];

const findCombination = (hand) => {
  const cards = hand.split('');
  const count = new Array(deck.length).fill(0);
  cards.forEach((card) => count[deck.indexOf(card)]++);
  const jokers = count[0];
  const resultNoJ = count
    .slice(1)
    .sort((a, b) => b - a)
    .slice(0, 5);
  let toReturn = null;
  combinations.forEach((combo) => {
    if (jokers === 0) {
      if (combo.set.map((c, i) => c === resultNoJ[i]).every((x) => x === true))
        toReturn = { name: combo.name, power: combo.power };
    } else {
      let jokersNeed = 0;
      for (let i = 0; i < resultNoJ.length; i++) {
        jokersNeed += Math.max(combo.set[i] - resultNoJ[i], 0);
      }
      if (jokers >= jokersNeed) toReturn = toReturn === null ? { name: combo.name, power: combo.power } : toReturn;
    }
  });
  return toReturn;
};

const compareSamePowerHands = (hand1, hand2) => {
  let res = 0;
  for (let i = 0; i < hand1.length; i++) {
    if (hand1[i] !== hand2[i]) {
      res = deck.indexOf(hand1[i]) < deck.indexOf(hand2[i]) ? -1 : 1;
      break;
    }
  }
  return res;
};

const evaluatedGames = file
  .map((game) => {
    return { ...game, ...findCombination(game.hand) };
  })
  .sort((a, b) => {
    return b.power !== a.power ? b.power - a.power : compareSamePowerHands(b.hand, a.hand);
  });

console.log(evaluatedGames.map((g, i) => (evaluatedGames.length - i) * g.bet).reduce((acc, x) => acc + x, 0));
