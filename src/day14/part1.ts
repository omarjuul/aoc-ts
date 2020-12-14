import { parseInput } from '../util';

const input = parseInput({ split: { mapper: s => s.split(' = ') } });
// console.log(input);
// console.log(input[input.length - 1]);
// console.log(input.filter(i => i[0] !== 'mask').map(i => +i[1]).reduce((a, b) => Math.max(a, b)));
let mask = 'X';
const mem: { [address: number]: bigint } = {};

for (let i = 0; i < input.length; i++) {
    const [command, value] = input[i];
    if (command == 'mask') {
        mask = value;
        // console.log(mask);
    }
    else {
        const addr = +command.match(/\[(\d+)]/)![1];
        mem[addr] = applyMask(mask, +value);
    }
}

console.log(Object.keys(mem).length);
export default Object.values(mem).reduce(sum);

function applyMask(mask: string, value: number): bigint {
    const maxExp = mask.length - 1;
    const bits = [...mask].map((c, i) => ({ c, exp: maxExp - i }));
    const zeroOut = bits.filter(b => b.c === '0').map(x => x.exp);
    const fillIn1 = bits.filter(b => b.c === '1').map(x => x.exp);

    const masked = BigInt(value)
        & BigInt(~exponentsToNum(zeroOut))
        | BigInt(exponentsToNum(fillIn1));
    console.log(value, masked);
    return masked;
}

function exponentsToNum(exp: number[]) {
    return exp.reduce((sum, e) => sum += 2 ** e, 0);
}

function sum(a: bigint, b: bigint) {
    return a + b;
}
