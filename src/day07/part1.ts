import { parseInput } from '../util';

const input = parseInput({ split: { mapper: false } }).filter(s => s);
const rules = input.map(parseRules);

console.log(rules);
let oldCount = 0;
const bagsThatWork = new Set<{ bagId: string, childBags: string[] }>();
rules.filter(r => r.childBags.includes('shiny gold')).forEach(r => bagsThatWork.add(r));
while (bagsThatWork.size > oldCount) {
    // not very efficient,
    // recursion would probably be much better than iteration here
    // but whatever
    oldCount = bagsThatWork.size;
    bagsThatWork
        .forEach(b => rules
            .filter(r => r.childBags.includes(b.bagId))
            .forEach(r => bagsThatWork.add(r)));
    console.log(bagsThatWork);
}

export default bagsThatWork.size;

function parseRules(ruleStr: string) {
    const t = ruleStr.split(' contain ');
    const bagId = t[0].split(' bag')[0];
    const childBags = t[1]
        .split(', ')
        .map(s => s
            .substring(s.indexOf(' ') + 1)
            .split(' bag')[0]);
    return { bagId, childBags };
}
