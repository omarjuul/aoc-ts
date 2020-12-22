import { parseInput, NL, BLANKLINE, sum } from '../util';

const input = parseInput({ split: { delimiter: BLANKLINE, mapper: false } });
const rules = input[0].split(NL).map(parseRule)
const myTicket = input[1].split(NL)[1].split(',').map(str => +str)
const scannedTickets = input[2].split(NL).slice(1).map(l => l.split(',').map(str => +str))

const faultyTickets = scannedTickets.flatMap(ticketEntry =>
    ticketEntry.filter(t => !followsAtLeastOneRule(t))
)
console.log(scannedTickets)
console.log(faultyTickets)

export default faultyTickets.reduce(sum)

interface Rule {
    min1: number;
    max1: number;
    min2: number;
    max2: number;
}

function parseRule(line: string): Rule {
    // console.log('line:', line)
    const match = line.match(/:\s(\d+)\s?-\s?(\d+)\sor\s(\d+)-(\d+)/)!
    const rule = {
        min1: +match[1],
        max1: +match[2],
        min2: +match[3],
        max2: +match[4],
    }
    // console.log(rule)
    return rule
}

function followsAtLeastOneRule(ticketEntry: number) {
    return rules.some(r =>
        r.min1 <= ticketEntry && ticketEntry <= r.max1
        || r.min2 <= ticketEntry && ticketEntry <= r.max2
    )
}
