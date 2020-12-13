import { parseInput } from '../util';

const input = parseInput().filter(x => x);
input.push(0);

const sortedRatings = input.sort((a, b) => a - b);
console.log(sortedRatings);

const jumps: number[] = [];

for (let i = 0; i < sortedRatings.length - 1; i++) {
    const jump = sortedRatings[i + 1] - sortedRatings[i];
    jumps.push(jump);
}

// only jumps of 1 and 3, so we can count the streaks of 1-jumps
// as jumps of 3 in the arrangement with all adapters must be in every valid arrangement

const streakLengths: number[] = [];
let currentStreak = 0;
for (let i = 0; i < jumps.length; i++) {
    const jump = jumps[i];
    if (jump === 1) {
        currentStreak++;
    }
    else if (jump === 3) {
        streakLengths.push(currentStreak);
        currentStreak = 0;
    }
}
if (currentStreak > 0)
    streakLengths.push(currentStreak);

console.log(jumps, streakLengths);

export default streakLengths.map(calculateVariations).reduce(product);

function calculateVariations(streakLength: number): number {
    // could cache values if necessary, but not needed for now
    switch (streakLength) {
        case 0:
        case 1:
            return 1;
        case 2:
            return 2;
        case 3:
            return 4;
        default:
            return calculateVariations(streakLength - 3) +
                calculateVariations(streakLength - 2) +
                calculateVariations(streakLength - 1);
    }
}

function product(a: number, b: number): number {
    return a * b;
}