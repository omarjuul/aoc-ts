import { parseInput, NL, BLANKLINE } from '../util';

const [rules, msgs] = parseInput({ split: { delimiter: BLANKLINE, mapper: (s: string) => s.split(NL) } });
// const [rules, msgs] = exampleInput().split('\n\n').map((s: string) => s.split('\n'));
const rulesMap = new Map(rules.map(parseRule))
const ruleZero = `^${getRule(0, rulesMap)}$`
console.log(ruleZero)

const matches = msgs
    .map(m => m.match(ruleZero))
    .filter(m => m !== null)
    .filter(m => m![1].length / m![2].length > m![3].length / m![4].length)
console.log(matches.slice(0, 8))

export default matches.length

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
        if (nr === 8) {
            return `((${option1.join('')})+)`
        }
        if (nr === 11) {
            return `((${option1[1]})+)`
        }
        return `(?:${option1.join('')})`
    }
}
