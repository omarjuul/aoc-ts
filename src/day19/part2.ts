import { parseInput, NL, BLANKLINE } from '../util';

const [rules, msgs] = parseInput({ split: { delimiter: BLANKLINE, mapper: (s: string) => s.split(NL) } });
// const [rules, msgs] = exampleInput().split('\n\n').map((s: string) => s.split('\n'));

const rulesMap = new Map(rules.map(parseRule))
const ruleZero = getRule(0, rulesMap)
const rule8 = getRule(8, rulesMap)
const rule11 = getRule(11, rulesMap)
const matchingMessages = msgs.map(m => ruleZero(m)).filter(m => m !== false)
console.log(msgs.map(m => ruleZero(m)))
// console.log(matchingMessages.map(m => m!.input))
export default matchingMessages.length

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

function getRule(nr: number, map: Map<number, RuleDef>): (s: string) => string | false {
    const rule = map.get(nr)!
    if (typeof rule === 'string') {
        return s => {
            if (s[0] === rule) {
                const ret = s.slice(1)
                console.log(`${rule} matched, returning ${ret}`)
                return ret
            }
            console.log(`${rule} does not match ${s}, returning ${false}`)
            return false;
        }
    }

    const option1 = rule.opt1.map(r => getRule(r, map))

    if (rule.opt2) {
        const option2 = rule.opt2.map(r => getRule(r, map))

        return option1.reduce((a, b) => { let t: string | false; return s => (t = a(s)) && b(t) }) ||
            option2.reduce((a, b) => { let t: string | false; return s => (t = a(s)) && b(t) })
    } else {
        return option1.reduce((a, b) => { let t: string | false; return s => (t = a(s)) && b(t) })
    }
}

function exampleInput() {
    return `42: 9 14 | 10 1
9: 14 27 | 1 26
10: 23 14 | 28 1
1: "a"
11: 42 31
5: 1 14 | 15 1
19: 14 1 | 14 14
12: 24 14 | 19 1
16: 15 1 | 14 14
31: 14 17 | 1 13
6: 14 14 | 1 14
2: 1 24 | 14 4
0: 8 11
13: 14 3 | 1 12
15: 1 | 14
17: 14 2 | 1 7
23: 25 1 | 22 14
28: 16 1
4: 1 1
20: 14 14 | 1 15
3: 5 14 | 16 1
27: 1 6 | 14 18
14: "b"
21: 14 1 | 1 14
25: 1 1 | 1 14
22: 14 14
8: 42
26: 14 22 | 1 20
18: 15 15
7: 14 5 | 1 21
24: 14 1

abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa
bbabbbbaabaabba
babbbbaabbbbbabbbbbbaabaaabaaa
aaabbbbbbaaaabaababaabababbabaaabbababababaaa
bbbbbbbaaaabbbbaaabbabaaa
bbbababbbbaaaaaaaabbababaaababaabab
ababaaaaaabaaab
ababaaaaabbbaba
baabbaaaabbaaaababbaababb
abbbbabbbbaaaababbbbbbaaaababb
aaaaabbaabaaaaababaa
aaaabbaaaabbaaa
aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
babaaabbbaaabaababbaabababaaab
aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba`
}