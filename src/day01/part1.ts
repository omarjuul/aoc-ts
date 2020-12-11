import { parseInput } from '../util';

const input = parseInput();

const solution = input
    .flatMap((left) => {
        return input.map((right) => {
            if (left + right === 2020) {
                return left * right;
            }
        });
    })
    .find((r) => !!r);

// console.log(`Solution '${solution}' found.`);
export default solution;
