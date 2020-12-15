import { parseInput } from '../util';

const input = parseInput({ split: { delimiter: ',' } })
const n = 2020

for (let i = input.length; i < n; i++) {
    const lastNr = input[i - 1]
    const lastIdxBefore = input.lastIndexOf(lastNr, -2)

    if (lastIdxBefore < 0) {
        input[i] = 0
    } else {
        const distance = i - 1 - lastIdxBefore
        input[i] = distance
    }
}

export default input[n - 1]
