import { parseInput } from '../util';

const input = parseInput({ split: { mapper: false } });

const colRepeat = input[0].length;
const rows = input.length;

const slopes = [
    { r: 1, d: 1 },
    { r: 3, d: 1 },
    { r: 5, d: 1 },
    { r: 7, d: 1 },
    { r: 1, d: 2 },
]

export default slopes
    .map(s => countTrees(s.r, s.d))
    .reduce((product, trees) => product * trees, 1);

function countTrees(right: number, down: number) {
    const steps = rows / down;
    let treeCount = 0;
    let col = 0, row = 0;

    for (let step = 0; step < steps; col += right, row += down, step++) {
        col %= colRepeat;
        if (input[row][col] === '#')
            treeCount++;
    }
    return treeCount;
}
