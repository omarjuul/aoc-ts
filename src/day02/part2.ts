import { parseInput } from '../util';

const input = parseInput({ split: { mapper: mapLine } }).filter(x => x.pw);

function mapLine(line: string): PwDef {
    const [ruleStr, pw] = line.split(': ');
    const rule = parseRule(ruleStr);
    return { rule, pw };
}

function parseRule(ruleStr: string): Rule {
    const [minmax, c] = ruleStr.split(' ');
    const [min, max] = minmax.split('-');
    return { min: +min, max: +max, character: c };
}

export default input.map(isValidPassword).reduce((acc, valid) => acc + +valid, 0);

function isValidPassword(x: PwDef): boolean {
    return (x.pw[x.rule.min - 1] === x.rule.character)
        !== (x.pw[x.rule.max - 1] === x.rule.character);
}

interface PwDef {
    rule: Rule;
    pw: string;
}

interface Rule {
    min: number;
    max: number;
    character: string;
}