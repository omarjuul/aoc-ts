import { parseInput } from '../util';

const input = parseInput({ split: { mapper: false } });

const cols = input[0].length;
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
    let treeCount = 0;

    for (let col = 0, row = 0; row < rows; row += down) {
        col = (col + right) % cols;
        if (input[row][col] === '#')
            treeCount++;
    }
    return treeCount;
}
