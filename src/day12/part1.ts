import { parseInput } from '../util';

const input = parseInput({ split: { mapper: false } });
const parsedInstr = input.map(parseInstr).filter(x => null !== x);

const dest = parsedInstr.reduce((pos: Position, d) => d!(pos), { x: 0, y: 0, face: 'E' });
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
    face: 'N' | 'S' | 'E' | 'W';
}

function parseDirection(direction: string, value: number): ((p: Position) => Position) {
    switch (direction) {
        case 'N':
            return (p: Position) => ({ y: p.y + value, x: p.x, face: p.face });
        case 'S':
            return (p: Position) => ({ y: p.y - value, x: p.x, face: p.face });
        case 'E':
            return (p: Position) => ({ x: p.x + value, y: p.y, face: p.face });
        case 'W':
            return (p: Position) => ({ x: p.x - value, y: p.y, face: p.face });

        case 'L':
            return (p: Position) => ({ x: p.x, y: p.y, face: getNewFace(p.face, -value) });
        case 'R':
            return (p: Position) => ({ x: p.x, y: p.y, face: getNewFace(p.face, value) });

        case 'F':
            return (p: Position) => {
                return parseDirection(p.face, value)(p)
            };

        default:
            throw new Error(`unknown direction ${direction}`);
    }
}

function getNewFace(face: 'N' | 'S' | 'E' | 'W', clockwiseDegrees: number): 'N' | 'S' | 'E' | 'W' {
    const steps = clockwiseDegrees / 90;
    const faces: ('N' | 'S' | 'E' | 'W')[] = ['N', 'E', 'S', 'W'];
    const retVal = faces[(faces.indexOf(face) + steps + 4) % 4];
    return retVal;
}
