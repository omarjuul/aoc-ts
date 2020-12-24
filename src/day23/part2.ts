import { parseInput, range } from '../util';

const input = parseInput({ split: { delimiter: '' } });
const max = Math.max(...input)
const min = Math.min(...input)

for (const move of range(10_000_000)) {
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

    if (move % 100000 === 0) console.log(move)
}

export default input


// import { mod, parseInput, range } from '../util';

// const input = parseInput({ split: { delimiter: '' } });
// const max = 1e6
// const min = Math.min(...input)
// const indices = new Map(input.map((lbl, idx) => [lbl, idx]))
// const labels = new Map(input.map((lbl, idx) => [idx, lbl]))
// let currentIdx = 0

// for (const move of range(1e7)) {
//     let currentLabel = getAtIndex(0)
//     const v1 = getAtIndex(currentIdx + 1)
//     const v2 = getAtIndex(currentIdx + 2)
//     const v3 = getAtIndex(currentIdx + 3)
//     let find = currentLabel - 1
//     while ([v1, v2, v3].includes(find)) {
//         find--
//         if (find < min) find = max
//     }

//     const targetIdx = getIndexForLabel(find)
//     insertAt(targetIdx, v1)
//     insertAt(targetIdx + 1, v2)
//     insertAt(targetIdx + 2, v3)
//     insertAt(targetIdx + 3, currentLabel)
//     console.log(currentLabel, currentIdx)
//     currentIdx += 4
// }

// export default input


// function getAtIndex(idx: number) {
//     return labels.get(mod(idx + currentIdx, max)) ?? mod(idx + 1 + currentIdx, max)

// }

// function getIndexForLabel(label: number) {
//     return (indices.get(label) ?? mod(label - 1 - currentIdx, max)) + 1
// }

// function insertAt(targetIdx: number, label: number) {
//     const idx = mod(targetIdx - currentIdx, max)
//     indices.set(label, targetIdx)
//     labels.set(targetIdx, label)
// }
