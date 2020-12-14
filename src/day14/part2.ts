import { lstat } from 'fs';
import { parseInput, sum } from '../util';

const input = parseInput({ split: { mapper: s => s.split(' = ') } });
// console.log(input);
// console.log(input[input.length - 1]);
// console.log(input.filter(i => i[0] !== 'mask').map(i => +i[1]).reduce((a, b) => Math.max(a, b)));
let mask = 'X';
const mem: { [address: number]: number } = {};

for (let i = 0; i < input.length; i++) {
    const [command, value] = input[i];
    if (command == 'mask') {
        mask = value;
        // console.log(mask);
    }
    else {
        const addr = +command.match(/\[(\d+)]/)![1];
        const addrList = applyMask(mask, addr);
        addrList.forEach(idx => {
            mem[idx] = +value;
        });
    }
}

console.log(Object.keys(mem).length);
export default Object.values(mem).reduce(sum);

function applyMask(mask: string, value: number): number[] {
    const maxExp = mask.length - 1;
    const bits = [...mask].map((c, i) => ({ c, exp: maxExp - i }));
    const float = bits.filter(b => b.c === 'X').map(x => x.exp);
    const fillIn1 = bits.filter(b => b.c === '1').map(x => x.exp);

    const onesFilled = BigInt(value) | BigInt(exponentsToNum(fillIn1));
    // console.log(value, onesFilled);
    const tmp = float
        .map(exp => BigInt(2 ** exp))
        .reduce((lst, msk) => lst.map(v => [v | msk, v & ~msk]).flat(), [onesFilled])
        .flat()
        .map(n => Number(n));

    // console.log(tmp);
    return tmp;
}

function exponentsToNum(exp: number[]) {
    return exp.reduce((sum, e) => sum += 2 ** e, 0);
}

function bigSum(a: bigint, b: bigint) {
    return a + b;
}
