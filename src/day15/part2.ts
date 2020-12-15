import { parseInput } from '../util';

const input = parseInput({ split: { delimiter: ',' } })
const lastIdxOf = new Map<number, number>()

const n = 30_000_000

let prev = -1
for (let i = 0; i < n; i++) {
    let val: number
    if (i < input.length) {
        val = input[i];
    } else {
        val = lastIdxOf.has(prev)
            ? (i - 1) - lastIdxOf.get(prev)!
            : 0
    }
    lastIdxOf.set(prev, i - 1)
    prev = val
}

export default prev
