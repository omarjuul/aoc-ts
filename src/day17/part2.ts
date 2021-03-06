import { parseInput, range, sum } from '../util';

const BOOT_STEPS = 6
const input = parseInput({ split: { mapper: false } })
let fieldSize = input.length
let fieldHgt = 1
let field: boolean[][][][] = []
field[0] = []
field[0][0] = input.map(l => readLineToBooleans(l))

for (let step = 0; step < BOOT_STEPS; step++) {
    fieldSize += 2;
    fieldHgt += 2;

    const newField: boolean[][][][] = []
    for (let w = 0; w < fieldHgt; w++) {
        newField[w] = []
        for (let z = 0; z < fieldHgt; z++) {
            newField[w][z] = []
            for (let y = 0; y < fieldSize; y++) {
                newField[w][z][y] = []
                for (let x = 0; x < fieldSize; x++) {
                    newField[w][z][y][x] = calcIfOn(field, x, y, z, w)
                }
            }
        }
    }
    field = newField
}

const flat = field.flatMap(w => w.flatMap(z => z.flatMap(y => y)))
// console.log(flat)
export default flat.map(b => +b).reduce(sum)

function calcIfOn(field: boolean[][][][], x: number, y: number, z: number, w: number): boolean {
    const adj = range(3, -2)
    let activeNeighbourCount = 0
    for (const adjW of adj) {
        if (field[w + adjW]) {
            for (const adjZ of adj) {
                if (field[w + adjW][z + adjZ]) {
                    for (const adjY of adj) {
                        if (field[w + adjW][z + adjZ][y + adjY]) {
                            for (const adjX of adj) {
                                if (field[w + adjW][z + adjZ][y + adjY][x + adjX]) {
                                    activeNeighbourCount++
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if (field[w - 1]?.[z - 1]?.[y - 1]?.[x - 1]) {
        // activeNeighbourCount includes itself, so this checks for 2 or 3 neighbours
        return activeNeighbourCount === 3 || activeNeighbourCount === 4
    }
    return activeNeighbourCount === 3
}

function readLineToBooleans(line: string): boolean[] {
    const l = [...line].map(c => c === '#')
    return l
}
