import { parseInput } from '../util';

const [rules, msgs] = parseInput({ split: { delimiter: '\r\n\r\n', mapper: (s: string) => s.split('\r\n') } });

// const rules = [`0: 1 2`,
//     `1: "a"`,
//     `2: 1 3 | 3 1`,
//     `3: "b"`]

/*const rules = `0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"`.split('\n')*/

const rulesMap = new Map(rules.map(parseRule))
const ruleZero = `^${getRule(0, rulesMap)}$`
console.log(ruleZero)

export default msgs.map(m => m.match(ruleZero)).filter(m => m !== null).length

type RuleDef = string | { opt1: number[], opt2: number[] }

function parseRule(line: string): [number, RuleDef] {
    const [ruleNr, ruleTxt] = line.split(': ')
    if (ruleTxt.startsWith('"')) {
        return [+ruleNr, ruleTxt[1]]
    }

    const [opt1, opt2] = ruleTxt.split(' | ')
    return [+ruleNr, { opt1: toNums(opt1), opt2: toNums(opt2) }]
}

function toNums(str: string): number[] {
    return str?.split(' ').map(s => +s)
}

function getRule(nr: number, map: Map<number, RuleDef>): string {
    const rule = map.get(nr)!
    if (typeof rule === 'string') {
        return rule
    }

    const option1 = rule.opt1.map(r => getRule(r, map))

    if (rule.opt2) {
        const option2 = rule.opt2.map(r => getRule(r, map))
        return `(?:${option1.join('')}|${option2.join('')})`
    } else {
        return `(?:${option1.join('')})`
    }
}
