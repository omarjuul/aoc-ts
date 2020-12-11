import { parseInput } from '../util';

const input = parseInput();

const solution = input
    .flatMap((left) =>
        input.flatMap((middle) =>
            input.map((right) => {
                return { l: left, m: middle, r: right };
            })
        )
    )
    .filter((x) => x.l + x.m + x.r === 2020)
    .map((x) => x.l * x.m * x.r)
    .find((r) => !!r);

// console.log(`Solution '${solution}' found.`);
export default solution;
