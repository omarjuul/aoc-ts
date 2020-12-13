import { parseInput } from '../util';

const input = parseInput({ split: { mapper: false } });
const myArrival = +input[0];
const lines = input[1].split(',').map(l => +l).filter(l => !isNaN(l));

const waitTime = lines.map(calcWaitTime);
const waitLine = waitTime.reduce((min, wt) => wt.waitTime < min.waitTime ? wt : min);
console.log(waitLine);

export default waitLine.line * waitLine.waitTime;

function calcWaitTime(line: number) {
    const waitTime = myArrival % line === 0 ? 0 : line - (myArrival % line);
    return { line, waitTime };
}
