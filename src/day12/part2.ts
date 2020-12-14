import { parseInput } from '../util';

const input = parseInput({ split: { mapper: false } });
const parsedInstr = input.map(parseInstr).filter(x => null !== x);

let startingPos: Position = { x: 0, y: 0, north: 1, east: 10 };
const dest = parsedInstr.reduce((pos: Position, d) => d!(pos), startingPos);
console.log(dest.x, dest.y);

export default Math.abs(dest.x) + Math.abs(dest.y);

function parseInstr(str: string) {
    if (!str) {
        return null;
    }
    const matches = str.match(/^(\w)(\d+)$/);
    if (!matches) {
        console.log(`'${str}'`, 'no matches');
    }
    const direction = parseDirection(matches![1], +matches![2]);
    return direction;
}

interface Position {
    x: number;
    y: number;
    north: number;
    east: number;
}

function parseDirection(direction: string, value: number): ((p: Position) => Position) {
    switch (direction) {
        case 'N':
            return p => ({ y: p.y, x: p.x, north: p.north + value, east: p.east });
        case 'S':
            return p => ({ y: p.y, x: p.x, north: p.north - value, east: p.east });
        case 'E':
            return p => ({ x: p.x, y: p.y, north: p.north, east: p.east + value });
        case 'W':
            return p => ({ x: p.x, y: p.y, north: p.north, east: p.east - value });

        case 'L':
            return p => {
                let [newNorth, newEast] = rotateClockwise(-value, p.north, p.east);
                return { x: p.x, y: p.y, north: newNorth, east: newEast };
            };
        case 'R':
            return p => {
                let [newNorth, newEast] = rotateClockwise(value, p.north, p.east);
                return { x: p.x, y: p.y, north: newNorth, east: newEast };
            };

        case 'F':
            return p => ({
                x: p.x + value * p.north,
                y: p.y + value * p.east,
                north: p.north,
                east: p.east
            });

        default:
            throw new Error(`unknown direction ${direction}`);
    }
}

function rotateClockwise(degrees: number, oldNorth: number, oldEast: number): [newNorth: number, newEast: number] {
    const steps = (((degrees / 90) % 4) + 4) % 4;
    switch (steps) {
        case 0:
            return [oldNorth, oldEast];
        case 1:
            return [-oldEast, oldNorth];
        case 2:
            return [-oldNorth, -oldEast];
        case 3:
            return [oldEast, -oldNorth];
    }
    throw new Error("ADFG");
}
