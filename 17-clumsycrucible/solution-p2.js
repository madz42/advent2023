const { readInputFile, splitByLine, createPriorityQueue } = require('../utils');

const file = splitByLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data'));
const heatMap = file.map((line) => line.split('').map((x) => parseInt(x)));

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const findPath = () => {
  const queue = createPriorityQueue('lo');
  const history = new Set();
  queue.push([0, [0, 0], [0, 0], 0]);

  while (!queue.isEmpty()) {
    const [heat, position, direction, steps] = queue.pop();

    //finish
    if (position[0] === heatMap.length - 1 && position[1] === heatMap[0].length - 1 && steps >= 4) return heat;

    //history
    if (history.has(JSON.stringify([position, direction, steps]))) continue;
    history.add(JSON.stringify([position, direction, steps]));

    //straight
    if (steps < 10 && (direction[0] !== 0 || direction[1] !== 0)) {
      const nextPosition = [position[0] + direction[0], position[1] + direction[1]];
      //in bounds
      if (
        nextPosition[0] >= 0 &&
        nextPosition[0] < heatMap.length &&
        nextPosition[1] >= 0 &&
        nextPosition[1] < heatMap[0].length
      ) {
        queue.push([heat + heatMap[nextPosition[0]][nextPosition[1]], nextPosition, direction, steps + 1]);
      }
    }
    //turns
    if (steps >= 4 || (direction[0] === 0 && direction[1] === 0)) {
      for (const [i, j] of directions) {
        if ((direction[0] !== i || direction[1] !== j) && (direction[0] !== -i || direction[1] !== -j)) {
          const nextPosition = [position[0] + i, position[1] + j];
          //in bounds
          if (
            nextPosition[0] >= 0 &&
            nextPosition[0] < heatMap.length &&
            nextPosition[1] >= 0 &&
            nextPosition[1] < heatMap[0].length
          ) {
            queue.push([heat + heatMap[nextPosition[0]][nextPosition[1]], nextPosition, [i, j], 1]);
          }
        }
      }
    }
  }
};

console.log(findPath());
