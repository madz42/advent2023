const { readInputFile, splitByLine } = require('../utils');

const file = splitByLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data'));

const board = file.map((line) => line.split(''));
const cycleDirs = ['N', 'W', 'S', 'E'];

// console.log(board.map((line) => line.join('')).join('\n'));
let found = true;
const loadHistory = [];

const calculateLoad = (board) => {
  let sum = 0;
  board.forEach((line, i) => {
    line.forEach((char) => {
      if (char === 'O') sum += board.length - i;
    });
  });
  return sum;
};

const moveStones = (i, j, dir) => {
  if (dir === 'N') {
    if (i <= 0 || i > board.length - 1) return;
    if (board[i][j] === 'O' && board[i - 1][j] === '.') {
      board[i - 1][j] = 'O';
      board[i][j] = '.';
      found = true;
    }
  } else if (dir === 'E') {
    if (j < 0 || j >= board[0].length - 1) return;
    if (board[i][j] === 'O' && board[i][j + 1] === '.') {
      board[i][j + 1] = 'O';
      board[i][j] = '.';
      found = true;
    }
  } else if (dir === 'S') {
    if (i < 0 || i >= board.length - 1) return;
    if (board[i][j] === 'O' && board[i + 1][j] === '.') {
      board[i + 1][j] = 'O';
      board[i][j] = '.';
      found = true;
    }
  } else if (dir === 'W') {
    if (j < 1 || j > board[0].length - 1) return;
    if (board[i][j] === 'O' && board[i][j - 1] === '.') {
      board[i][j - 1] = 'O';
      board[i][j] = '.';
      found = true;
    }
  }
};

//find pattern
const checkPattern = (element, entries) => {
  const deltas = [];
  let isPattern = false;
  for (let i = entries.length - 1; i > 0; i--) {
    deltas.push(entries[i] - entries[i - 1]);
  }
  if (deltas.every((x) => x === deltas[0])) isPattern = true;
  return { isPattern, element, length: deltas[0], offset: entries[0] };
};
const findPattern = (repeatsNum) => {
  let pattern;
  for (element of loadHistory) {
    const count = loadHistory.filter((x) => x === element).length;
    if (count >= repeatsNum) {
      const entries = [];
      let idx = loadHistory.indexOf(element);
      while (idx !== -1) {
        entries.push(idx);
        idx = loadHistory.indexOf(element, idx + 1);
      }
      //check pattern
      pattern = checkPattern(element, entries);
      if (pattern.isPattern) break;
    }
  }
  return pattern;
};
let foundPattern;
for (let i = 0; i < 1000_000_000; i++) {
  for (const dir of cycleDirs) {
    found = true;
    while (found) {
      found = false;
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
          moveStones(i, j, dir);
        }
      }
    }
  }
  loadHistory.push(calculateLoad(board));
  const possiblePattern = findPattern(5);
  if (possiblePattern?.isPattern) {
    foundPattern = possiblePattern;
    break;
  }
}
foundPattern.sequence = loadHistory.slice(foundPattern.offset, foundPattern.offset + foundPattern.length);
const remainder = (1000_000_000 - foundPattern.offset) % foundPattern.length;
// console.log(foundPattern);
console.log(foundPattern.sequence[remainder - 1]);
