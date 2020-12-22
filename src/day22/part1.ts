import { parseInput, NL, BLANKLINE, sum } from '../util';

const input = parseInput({
    split: {
        delimiter: BLANKLINE, mapper: (s: string) =>
            s.split(NL)
                .filter((s, i) => i > 0 && s !== '')
                .map(s => +s)
    }
})
const [p1, p2] = input

console.log('player one cards:')
console.log(p1)
console.log('player two cards:')
console.log(p2)

while (p1.length > 0 && p2.length > 0) {
    // if (++round % 1000 === 0) console.log(round)
    const c1 = p1.shift()!
    const c2 = p2.shift()!
    if (c1 > c2) {
        p1.push(c1)
        p1.push(c2)
    } else {
        p2.push(c2)
        p2.push(c1)
    }
}

const resultingStack = p1.concat(p2)
console.log(resultingStack)
const topCardScore = resultingStack.length
export default resultingStack.map((c, i) => c * (topCardScore - i)).reduce(sum)
