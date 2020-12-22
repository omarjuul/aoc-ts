import { parseInput } from '../util';

const input = parseInput({ split: { mapper: false } }).filter(s => s).map(l => l.split(''));

let currentStep = { switched: true, map: input };
let step = 1;
while (currentStep.switched && step++ < 10000) {
    currentStep = makeNextStep(currentStep.map);
    if (step % 5 === 0)
        console.log(`${step} steps`);
}
console.log(`${step} steps done.`);

// console.log(currentStep.map);

export default currentStep.map.flat().map(c => c === '#').reduce((sum, occ) => sum + +occ, 0);

function makeNextStep(currentMap: string[][]): { map: string[][], switched: boolean } {
    const nextMap: string[][] = [];
    let switched = false;
    for (let y = 0; y < currentMap.length; y++) {
        nextMap[y] = [];
        for (let x = 0; x < currentMap[y].length; x++) {
            if (currentMap[y][x] === '.') {
                nextMap[y][x] = '.';
            }
            else if (shouldSwitch(currentMap, x, y)) {
                switched = true;
                nextMap[y][x] = currentMap[y][x] === '#' ? 'L' : '#';
            }
            else {
                nextMap[y][x] = currentMap[y][x] === '#' ? '#' : 'L';
            }
        }
    }
    return { map: nextMap, switched };
}

function shouldSwitch(currentMap: string[][], x: number, y: number): boolean {
    switch (currentMap[y][x]) {
        case '#':
            return countOccupiedSeatsInSight(currentMap, x, y) >= 5;
        case 'L':
            return countOccupiedSeatsInSight(currentMap, x, y) < 1;
        default:
            throw new Error("");
    }
}

function countOccupiedSeatsInSight(map: string[][], x: number, y: number): number {
    let count = 0;
    const directions: Point[] = [];
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i == 0 && j == 0)
                continue;

            directions.push({ x: i, y: j });
        }
    }
    dir: for (const d of directions) {
        let inSight = { x: x + d.x, y: y + d.y };
        while (map[inSight.y] && map[inSight.y][inSight.x]) {
            const chair = map[inSight.y][inSight.x];
            if (chair === '#') {
                count++;
                continue dir;
            }
            else if (chair === 'L')
                continue dir;
            else
                inSight = { x: inSight.x + d.x, y: inSight.y + d.y };
        }
    }
    return count;
}

interface Point {
    x: number;
    y: number;
}
