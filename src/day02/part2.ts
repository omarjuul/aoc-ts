import { parseInput } from '../util';

const input = parseInput({ split: { mapper: mapLine } }).filter(x => x.pw);

function mapLine(line: string) {
    const splitLine = line.split(': ');
    const rule = parseRule(splitLine[0]);
    return { rule: rule, pw: splitLine[1] };
}

function parseRule(ruleStr: string): Rule {
    const x = ruleStr.split(' ');
    const minmax = x[0].split('-');
    return { min: +minmax[0], max: +minmax[1], character: x[1] };
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