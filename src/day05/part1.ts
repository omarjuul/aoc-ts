import { parseInput } from '../util';

const input = parseInput({ split: { mapper: false } });

interface Seat {
    row: number;
    column: number;
    seatId: number;
}

function getBoolValue(str: string): boolean {
    switch (str) {
        case 'R':
        case 'B':
            return true;

        case 'F':
        case 'L':
            return false;

        default:
            console.log(`unknown character ${str}`);
            return false;
    }
}

function parseToSeat(seatSpecification: string) {
    const len = seatSpecification.length;
    let sum = 0;

    for (let exp = 0; exp < len; exp++) {
        const element = seatSpecification[len - 1 - exp];
        sum += +getBoolValue(element) * 2 ** exp;
    }

    return { seatId: sum, column: sum % 8, row: Math.floor(sum / 8) };
}

console.log(parseToSeat('FBFBBFFRLR'));

export default input.map(parseToSeat).reduce((max, cur) => Math.max(max, cur.seatId), -1);
