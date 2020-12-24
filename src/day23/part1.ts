import { parseInput, range } from '../util';

const input = parseInput({ split: { delimiter: '' } });
const max = Math.max(...input)
const min = Math.min(...input)

for (const move of range(100)) {
    const removed = input.splice(1, 3)
    let find = input[0] - 1
    // inefficient, but whatever
    while (input.indexOf(find) < 0) {
        find--
        if (find < min) find = max
    }
    const destIdx = input.indexOf(find)
    input.splice(destIdx + 1, 0, ...removed)
    input.push(input.shift()!)

    console.log(input)
}

export default input
