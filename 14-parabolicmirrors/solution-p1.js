const { readInputFile, splitByLine } = require('../utils');

const file = splitByLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data'));

const board = file.map((line) => line.split(''));

// console.log(board.map((line) => line.join('')).join('\n'));
let found = true;

const moveStoneUp = (i, j) => {
  if (i <= 0 || i > board.length - 1) return;
  if (board[i][j] === 'O' && board[i - 1][j] === '.') {
    board[i - 1][j] = 'O';
    board[i][j] = '.';
    found = true;
  }
};
while (found) {
  found = false;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      moveStoneUp(i, j);
    }
  }
}
// console.log('===');
// console.log(board.map((line) => line.join('')).join('\n'));

let sum = 0;
board.forEach((line, i) => {
  line.forEach((char) => {
    if (char === 'O') sum += board.length - i;
  });
});

console.log(sum);
