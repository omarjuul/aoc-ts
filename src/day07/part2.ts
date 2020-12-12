import { parseInput } from '../util';

const input = parseInput({ split: { mapper: false } }).filter(s => s);
const rules = input.map(parseRule);

interface BagRule {
    bagId: string;
    childBags: { bagId: string, amount: number }[];
}

export default calculateNrOfBagsById('shiny gold') - 1;

function calculateNrOfBagsById(bagId: string): number {
    const bag = rules.find(r => r.bagId === bagId);
    if (!bag)
        return 0;
    return calculateNrOfBags(bag);
}

function calculateNrOfBags(bag: BagRule): number {
    return 1 + bag.childBags
        .map(cb => cb.amount * calculateNrOfBagsById(cb.bagId))
        .reduce((a, b) => a + b);
}

function parseRule(ruleStr: string): BagRule {
    const t = ruleStr.split(' contain ');
    const bagId = t[0].split(' bag')[0];
    const childBags = t[1]
        .split(', ')
        .map(s => {
            const matches = s.match(/^(\d+) (\w+ \w+) bag/);
            if (!matches)
                return { bagId: '', amount: 0 };

            return { bagId: matches[2], amount: +matches[1] };
        });
    // console.log(childBags);
    return { bagId, childBags };
}
