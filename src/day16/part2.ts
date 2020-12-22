import { parseInput, NL, product, range, BLANKLINE } from '../util';

const input = parseInput({ split: { delimiter: BLANKLINE, mapper: false } });
const rules = input[0].split(NL).map(parseRule)
const myTicket = input[1].split(NL)[1].split(',').map(str => +str)
const scannedTickets = input[2].split(NL).slice(1).map(l => l.split(',').map(str => +str))

const validTickets = scannedTickets.filter(ticketEntry =>
    ticketEntry.every(t => followsAtLeastOneRule(t))
)

const numberOfFields = myTicket.length
const fieldMap = new Map<string, number[]>(rules.map(r => [r.name, range(numberOfFields)]))
const decided = []

validTickets.forEach(tryReduceFieldMap)
decided.push(...spliceAndExtractDecided())
console.log(decided.sort((a, b) => a.idx - b.idx))

export default decided.filter(d => d.n.startsWith('departure')).map(d => myTicket[d.idx]).reduce(product)

interface Rule {
    name: string;
    min1: number;
    max1: number;
    min2: number;
    max2: number;
}

function parseRule(line: string): Rule {
    // console.log('line:', line)
    const match = line.match(/((?:\w+\s?)+):\s(\d+)\s?-\s?(\d+)\sor\s(\d+)-(\d+)/)!
    const rule = {
        name: match[1],
        min1: +match[2],
        max1: +match[3],
        min2: +match[4],
        max2: +match[5],
    }
    // console.log(rule)
    return rule
}

function followsAtLeastOneRule(ticketEntry: number) {
    return rules.some(r => followsRule(ticketEntry, r))
}

function followsRule(ticketEntry: number, rule: Rule | string) {
    const r = (typeof (rule) === 'string') ? rules.find(r => r.name === rule)! : rule
    return r.min1 <= ticketEntry && ticketEntry <= r.max1
        || r.min2 <= ticketEntry && ticketEntry <= r.max2
}

function tryReduceFieldMap(ticket: number[]) {
    // console.log(`reducing fieldMap based on ${ticket}`)
    for (const [name, candidateFields] of fieldMap.entries()) {
        candidateFields.forEach((f, idx, arr) => {
            if (!followsRule(ticket[f], name)) {
                // console.log(`removing ${ticket[f]} (field ${f}) from candidates for ${name}`)
                arr.splice(idx, 1)
            }
        })
    }
}

function spliceAndExtractDecided(): { n: string, idx: number }[] {
    // console.log(fieldMap)
    const decided = Array.from(fieldMap.entries()).filter(e => e[1].length === 1).map(e => ({ n: e[0], idx: e[1][0] }))
    if (decided.length === 0) return decided

    decided.forEach(d =>
        fieldMap.forEach(v => {
            const idx = v.indexOf(d.idx)
            if (idx >= 0) v.splice(idx, 1)
        })
    )
    return decided.concat(spliceAndExtractDecided())
}
