import { setupMaster } from 'cluster';
import { default as step1, input } from './part1';

if (!step1)
    throw new Error("WHAAAA! PANIC!");

export default (() => {
    for (let start = 0; start < input.length; start++) {
        for (let end = start + 1; sumFromTo(start, end) <= step1; end++) {
            if (sumFromTo(start, end) === step1)
                return getMinMaxSum(start, end);
        }
    }
})();

function sumFromTo(start: number, end: number): number {
    return input.slice(start, end).reduce((a, b) => a + b);
}

function getMinMaxSum(start: number, end: number): number {
    const subArray = input.slice(start, end);
    return subArray.reduce(min) + subArray.reduce(max);
}

function min(a: number, b: number) {
    return Math.min(a, b);
}

function max(a: number, b: number) {
    return Math.max(a, b);
}
