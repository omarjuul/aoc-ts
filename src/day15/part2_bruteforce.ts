import { parseInput } from '../util';

const input = parseInput({ split: { delimiter: ',' } })
const n = 30_000_000
const lastIdxOf: { [x: number]: number } = {}
input.slice(0, -1).map((x, idx) => ({ x, idx })).forEach(i => lastIdxOf[i.x] = i.idx)

for (let i = input.length; i < n; i++) {
    const lastNr = input[i - 1]
    const lastIdxBefore = lastIdxOf[lastNr]
    input[i] = lastIdxBefore === undefined
        ? 0
        : i - 1 - lastIdxBefore

    lastIdxOf[input[i - 1]] = i - 1

    if (i % 30000 === 0) console.log(`${Math.round(i / n * 10000) / 100}%`)
}

export default input[n - 1]
