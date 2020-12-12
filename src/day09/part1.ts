import { parseInput } from '../util';

export const input = parseInput();
const PREV_WINDOW_SIZE = 25;

function findFirstNoSum(): number | undefined {
    blah: for (let i = PREV_WINDOW_SIZE; i < input.length; i++) {
        const current = input[i];
        for (let a = i - PREV_WINDOW_SIZE; a < i; a++) {
            for (let b = a + 1; b < i; b++) {
                if (input[a] + input[b] === current)
                    continue blah;
            }
        }
        return current;
    }
}

export default findFirstNoSum();
