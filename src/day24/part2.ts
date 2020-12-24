import { mod, parseInput, range } from '../util';

const input = parseInput({ split: { mapper: parseTileString } });
let blackPoints = new Set<string>()
input.forEach(i => blackPoints.has(pt2Str(i)) ? blackPoints.delete(pt2Str(i)) : blackPoints.add(pt2Str(i)))

for (const i of range(100)) {
    const blackPointsStayBlack: HexPoint[] = []
    const whitePtsBlackNeigh = new Map<string, number>()
    for (const ptStr of blackPoints) {
        const pt = str2Pt(ptStr)
        const neighbours = adjacentTiles(pt)
            .map(p => ({ isBlack: blackPoints.has(pt2Str(p)), ptStr: pt2Str(p) }))

        const adjBlack = neighbours.filter(n => n.isBlack).length
        if (0 < adjBlack && adjBlack <= 2) {
            blackPointsStayBlack.push(pt)
        }

        neighbours
            .filter(n => !n.isBlack)
            .forEach(n => whitePtsBlackNeigh.set(n.ptStr, (whitePtsBlackNeigh.get(n.ptStr) ?? 0) + 1))
    }
    blackPoints = new Set(blackPointsStayBlack.map(pt => pt2Str(pt)))
    for (const [ptStr, blackNeigh] of whitePtsBlackNeigh) {
        if (blackNeigh === 2)
            blackPoints.add(ptStr)
    }
    // console.log(blackPoints.size)
}

export default blackPoints.size


type HexPoint = { north: number, east: number }

function pt2Str(pt: HexPoint): string {
    return `${pt.north},${pt.east}`
}

function str2Pt(ptStr: string): HexPoint {
    const [north, east] = ptStr.split(',').map(s => +s)
    return ({ north, east })
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

function adjacentTiles(pt: HexPoint): HexPoint[] {
    return ['e', 'ne', 'se', 'w', 'nw', 'sw'].map(dir => parseDirection(pt, dir))
}
