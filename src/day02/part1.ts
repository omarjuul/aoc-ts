import { parseInput } from '../util';

const input = parseInput({ split: { mapper: mapLine } }).filter(x => x.pw);

function mapLine(line: string): PwDef {
    const [ruleStr, pw] = line.split(': ');
    const rule = parseRule(ruleStr);
    return { rule, pw };
}

function parseRule(ruleStr: string): Rule {
    const [minmax, char] = ruleStr.split(' ');
    const [min, max] = minmax.split('-');
    return { min: +min, max: +max, character: char };
}

export default input.map(isValidPassword).reduce((acc, valid) => acc + +valid, 0);

function isValidPassword(x: PwDef): boolean {
    const matches = x.pw.match(new RegExp(x.rule.character, 'g'))?.length ?? 0;
    const isValid = x.rule.min <= matches && matches <= x.rule.max;
    // console.log(x, matches);
    // console.log(isValid ? 'valid' : 'invalid');
    return isValid;
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