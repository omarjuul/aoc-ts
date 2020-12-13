import { parseInput } from '../util';

const input = parseInput();

const sortedRatings = input.sort((a, b) => a - b);
console.log(sortedRatings);

let jumpsOf1 = 0;
let jumpsOf3 = 0;

for (let i = 0; i < sortedRatings.length - 1; i++) {
    const jump = sortedRatings[i + 1] - sortedRatings[i];
    if (jump === 3)
        jumpsOf3++;
    else if (jump === 1)
        jumpsOf1++;
    else if (jump !== 2)
        throw new Error("jump too big!");
}

export default jumpsOf1 * (jumpsOf3 + 1);
