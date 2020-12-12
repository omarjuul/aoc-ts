import { parseInput } from '../util';

const input = parseInput({ split: { mapper: false } }).filter(s => s);
const instructions = input.map(parseInstr);

interface Instr {
    op: 'acc' | 'jmp' | 'nop';
    arg: number;
}

console.log(instructions);
const visited = new Set<number>();
let idx = 0;
let accum = 0;
while (!visited.has(idx)) {
    visited.add(idx);
    const instr = instructions[idx];
    switch (instr.op) {
        case 'acc':
            accum += instr.arg;
            idx++;
            break;
        case 'jmp':
            idx += instr.arg;
            break;
        case 'nop':
            idx++;
            break;
    }
    console.log(idx);
}
export default accum;

export function parseInstr(str: string): Instr {
    const s = str.split(' ');
    const op = s[0];
    const arg = +s[1];
    if (op !== 'acc' && op !== 'jmp' && op !== 'nop')
        throw new Error(`Unknown operation '${op}'`);

    return { op, arg };
}