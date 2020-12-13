import { parseInput } from '../util';

const input = parseInput({ split: { mapper: false } }).filter(s => s).map(l => l.split(''));

let currentStep = makeNextStep(input);
while (currentStep.switched) {
    currentStep = makeNextStep(currentStep.map);
}

console.log(currentStep.map);

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
            return countOccupiedNeighbours(currentMap, x, y) >= 4;
        case 'L':
            return countOccupiedNeighbours(currentMap, x, y) < 1;
        default:
            throw new Error("");
    }
}

function countOccupiedNeighbours(map: string[][], x: number, y: number): number {
    let count = 0;
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (map[j] && map[j][i] === '#')
                count++;
        }
    }
    if (map[y][x] === '#')
        count--;
    return count;
}
