import { parseInput } from '../util';

const input = parseInput({ split: { mapper: false } });
// input[1] = '7,13,x,x,59,x,31,19';
const lines = input[1].split(',').map((l, idx) => ({ line: +l, idx })).filter(l => !isNaN(l.line));

const combinationInfo = lines.reduce(combineTimes, { t: 0, lcm: 1 });

function combineTimes(timeInfo: { t: number, lcm: number }, lineInfo: { line: number, idx: number }): { t: number, lcm: number } {
    for (let steps = 0; steps < lineInfo.line; steps++) {
        const tryTime = timeInfo.t + steps * timeInfo.lcm;
        if ((tryTime + lineInfo.idx) % lineInfo.line === 0) {
            const retVal = { t: tryTime, lcm: leastCommonMultiple(timeInfo.lcm, lineInfo.line) };
            // console.log(retVal);
            return retVal;
        }
    }
    throw new Error("not found");
}

const startTime = combinationInfo.t;
// console.log(lines, startTime);
// const logMe = lines.map(l => ({ l: l.line, idx: l.idx, 't+idx': startTime + l.idx, modLine: (startTime + l.idx) % l.line }));
// console.log(logMe);
export default startTime;

function leastCommonMultiple(a: number, b: number): number {
    return (a / ggd2(a, b)) * b;
}

function ggd2(a: number, b: number): number {
    if (a > b) {
        let temp = a;
        a = b;
        b = temp;
    } // a <= b
    while (b % a != 0) {
        if (b > a) {
            b -= Math.floor(b / a) * a;
        }
        let temp = b;
        b = a;
        a = a - temp;
    }
    return a;
}
