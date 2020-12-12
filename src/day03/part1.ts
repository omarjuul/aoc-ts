import { parseInput } from '../util';

const input = parseInput({ split: { mapper: false } });

const rows = input.length;
const colRepeat = input[0].length;
const rightPerRow = 3;
let col = 0;
let treeCount = 0;

for (let currentRow = 0; currentRow < rows; col += rightPerRow, currentRow++) {
    col %= colRepeat;
    if (input[currentRow][col] === '#')
        treeCount++;
}
export default treeCount;
