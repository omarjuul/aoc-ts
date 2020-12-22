import { parseInput, NL, BLANKLINE } from '../util';

const input = parseInput({ split: { mapper: false, delimiter: BLANKLINE } })
    .map(group => group.split(NL).filter(str => str));

function determineGroupYesCount(group: string[]): number {
    const groupAnswers = group.map(str => [...str]);
    let allHaveAnswer = groupAnswers[0];
    for (let idx = 1; idx < group.length; idx++) {
        const e = groupAnswers[idx];
        allHaveAnswer = allHaveAnswer.filter(a => e.includes(a));
    }
    console.log(allHaveAnswer, allHaveAnswer.length);
    return allHaveAnswer.length;
}

const perGroup = input.map(determineGroupYesCount);
export default perGroup.reduce(sum);

function sum(a: number, b: number) {
    return a + b;
}