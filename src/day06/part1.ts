import { parseInput, NL, BLANKLINE } from '../util';

const input = parseInput({ split: { mapper: false, delimiter: BLANKLINE } })
    .map(group => group.split(NL));

function determineGroupYesCount(group: string[]): number {
    const yesQuestions = new Set();
    const flatGroup = group.map(str => [...str]).flat();
    flatGroup.forEach(q => yesQuestions.add(q));

    return yesQuestions.size;
}

const perGroup = input.map(determineGroupYesCount);
export default perGroup.reduce(sum);

function sum(a: number, b: number) {
    return a + b;
}