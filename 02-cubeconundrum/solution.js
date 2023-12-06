const { readInputFile, splitByLine } = require('../utils');

const file = splitByLine(readInputFile('data'));

const parseDraw = (draw) => {
  const ballsCount = { red: 0, green: 0, blue: 0 };
  draw.split(', ').forEach((y) => {
    sortedBalls = y.split(' ');
    ballsCount[sortedBalls[1]] = parseInt(sortedBalls[0]);
  });
  return ballsCount;
};

const bag = { red: 12, green: 13, blue: 14 };

const games = file.map((line) => {
  return line
    .split(': ')[1]
    .split('; ')
    .map((draw) => parseDraw(draw));
});

const checkedDraws = games.map((game) => {
  return game.map((draw) => {
    return [draw.red <= bag.red, draw.green <= bag.green, draw.blue <= bag.blue];
  });
});

const checkedGames = checkedDraws.map((games) => {
  return games.map((draw) => draw.every((x) => x === true)).every((x) => x === true);
});

console.log(
  'PART1:',
  checkedGames.reduce((acc, val, ind) => (acc = acc + (val ? ind + 1 : 0)), 0)
);

const checkedDraws2 = games.map((game) => {
  const minBalls = {
    red: 0,
    green: 0,
    blue: 0,
  };
  game.forEach((draw) => {
    minBalls.red = draw.red !== 0 ? Math.max(draw.red, minBalls.red) : minBalls.red;
    minBalls.green = draw.green !== 0 ? Math.max(draw.green, minBalls.green) : minBalls.green;
    minBalls.blue = draw.blue !== 0 ? Math.max(draw.blue, minBalls.blue) : minBalls.blue;
  });
  return minBalls;
});

const checkedGames2 = checkedDraws2.map((games) => {
  return games.red * games.green * games.blue;
});

console.log(
  'PART2:',
  checkedGames2.reduce((acc, val) => acc + val, 0)
);
