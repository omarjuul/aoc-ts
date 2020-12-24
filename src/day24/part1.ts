import { mod, parseInput } from '../util';

const input = parseInput({ split: { mapper: parseTileString } });
console.log(input)
console.log(input[input.length - 1])
const blackPoints = new Set<string>()
input.forEach(i => blackPoints.has(ptStr(i)) ? blackPoints.delete(ptStr(i)) : blackPoints.add(ptStr(i)))
export default blackPoints.size


type HexPoint = { north: number, east: number }

function ptStr(pt: HexPoint): string {
    return `${pt.north},${pt.east}`
}

function parseTileString(str: string): HexPoint {
    const charArray = Array.from(str)
    let hexPoint: HexPoint = { north: 0, east: 0 }
    while (charArray.length > 0) {
        let direction = charArray.shift()!
        if (direction == 'n' || direction == 's') {
            direction += charArray.shift()
        }
        hexPoint = parseDirection(hexPoint, direction)
    }
    return hexPoint
}

function parseDirection(pt: HexPoint, direction: string) {
    const row = mod(pt.north, 2)
    switch (direction) {
        case 'e':
            return ({ east: pt.east + 1, north: pt.north })
        case 'ne':
            return ({ east: pt.east + row, north: pt.north + 1 })
        case 'se':
            return ({ east: pt.east + row, north: pt.north - 1 })
        case 'w':
            return ({ east: pt.east - 1, north: pt.north })
        case 'nw':
            return ({ east: pt.east + row - 1, north: pt.north + 1 })
        case 'sw':
            return ({ east: pt.east + row - 1, north: pt.north - 1 })

        default:
            throw new Error("unknown direction" + direction);
    }
}
