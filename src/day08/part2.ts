import { parseInput } from '../util';

const input = parseInput({ split: { mapper: false } }).filter(s => s);
const instructions = input.map(parseInstr);

interface Instr {
    op: 'acc' | 'jmp' | 'nop';
    arg: number;
}

const accum = (() => {
    for (let i = 0; i < instructions.length; i++) {
        const visited = new Set<number>();
        let idx = 0;
        let accum = 0;
        while (!visited.has(idx)) {
            visited.add(idx);
            if (idx >= instructions.length)
                return accum;
            const instr = instructions[idx];
            let op = instr.op;
            if (idx == i && op !== 'acc')
                op = op === 'nop' ? 'jmp' : 'nop';
            switch (op) {
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
        }
    }
})();

export default accum;

export function parseInstr(str: string): Instr {
    const s = str.split(' ');
    const op = s[0];
    const arg = +s[1];
    if (op !== 'acc' && op !== 'jmp' && op !== 'nop')
        throw new Error(`Unknown operation '${op}'`);

    return { op, arg };
}