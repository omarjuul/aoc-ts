import { mod, range, sum, trueIndicesOf } from '../util';
import { cornerBlocks, matchMap, BLOCK_SIZE, Block, MatchHelper, matchers } from './part1';

const mod4 = (num: number) => mod(num, 4)

let BlockSize = BLOCK_SIZE
const SEAMONSTER =
    '                  # ' + '\n' +
    '#    ##    ##    ###' + '\n' +
    ' #  #  #  #  #  #   '
const monsterPoints: Point[] = SEAMONSTER
    .split('\n')
    .flatMap((l, y) => Array.from(l, (v, x) => ({ x, y, b: v === '#' })))
    .filter(x => x.b)

type Point = { x: number, y: number }

interface TileLocation {
    tile: Block
    rotation: number
    topLeft: Point
}

// choose a block to be top left
const topLeftBlock = cornerBlocks[0]

const indices = topLeftBlock.borderIds
    .map((borderId, idx) => ({
        idx,
        match: matchMap.get(borderId)!.filter(x => x !== topLeftBlock.block.tileNr).length > 0
    }))
    .filter(a => a.match)
    .map(a => a.idx)

const [rightIdx, downIdx] = (indices[0] === 0 && indices[1] === 3)
    ? [indices[1], indices[0]]
    : indices

const blockLocations = getBlockLocations(topLeftBlock, rightIdx, downIdx)
const pointsRot = blockLocations.flatMap(t => getPointsForTile(t, -1))
const map = new Set(pointsRot.map(pointStr))
const bottomRight = getMaxCoords(pointsRot)
// console.log(bottomRight)
console.log(drawGridString(pointsRot))

const startingPoints = range(bottomRight.y)
    .flatMap(y => range(bottomRight.x).map(x => ({ x, y })))
const found = range(8).map(rotation => {
    const rotatedMonster = rotatePoints(monsterPoints, rotation)
    const isMonsterStart = (topLeft: Point) =>
        isMonsterStartOnMap(topLeft, map, rotatedMonster)
    return startingPoints.map(isMonsterStart).reduce(sum)
})
console.log("found:", found)
const maxFound = found.reduce(sum);
export default map.size - monsterPoints.length * maxFound

/* BlockSize = 3
const pixels = [1, 2].map(getBlockCoord)
const test = range(8)
    .map(r => rotatePoints(pixels, r, { x: 2, y: 2 }))
    .map(r => drawGridString(r))
test.forEach((t, i) => { console.log('rot ', i); console.log(t); console.log() }) */
/*
noFlip, 0 rot
XX.
...
...

1 rot
..X
..X
...

2 rot
...
...
.XX

3 rot
...
X..
X..

FlipOverXAxis, 0 rot == 2 rot.reverse() := 4
...
...
XX.

FlipOverXAxis, 1 rot == 3 rot.reverse() := 5
X..
X..
...

FlipOverXAxis, 2 rot == 0 rot.reverse() := 6
.XX
...
...

FlipOverXAxis, 3 rot == 1 rot.reverse() := 7
...
..X
..X
*/


function pointStr(p: Point) {
    return `${p.x},${p.y}`
}

function isMonsterStartOnMap(topleft: Point, map: Set<string>, monster: Point[]): number {
    const monsterFromTopLeft = monster.map(p => ({ x: topleft.x + p.x, y: topleft.y + p.y }))
    return +(monsterFromTopLeft.every(mp => map.has(pointStr(mp))))
}

function getBlockLocations(topLeftBlock: MatchHelper, rightIdx: number, downIdx: number) {
    const blockLocations: TileLocation[] = []
    let currentTile: MatchHelper = topLeftBlock
    let lastLeftTile = currentTile
    let x, y: number
    y = 0
    while (true) {
        x = 0
        while (true) {
            const rotation = getRotation(rightIdx)
            // console.log(`rotating tile ${currentTile.block.tileNr} by ${rotation} steps (rightIdx ${rightIdx})`)
            // console.log(drawGridString(trueIndicesOf(currentTile.block.pixels).map(getBlockCoord)))
            // console.log();
            // console.log(drawGridString(rotatePoints(trueIndicesOf(currentTile.block.pixels).map(getBlockCoord), rotation)))

            blockLocations.push({ tile: currentTile.block, rotation, topLeft: { x, y } })
            const newInfo = getAdjTileWithNewIdx(currentTile, rightIdx)
            if (!newInfo) {
                break;
            }
            ({ tile: currentTile, directionIdx: rightIdx } = newInfo)
            x++
        }
        const info = getAdjTileWithNewIdx(lastLeftTile, downIdx)
        if (!info) break;
        ({ tile: currentTile, directionIdx: downIdx } = info)
        y++
        lastLeftTile = currentTile
        rightIdx = downIdx < 4
            ? mod4(downIdx - 1)
            : mod4(downIdx + 1) + 4

        // if (!(matchMap.get(currentTile.borderIds[rightIdx % 4])!.some(nr => nr !== currentTile.block.tileNr))) {
        //     console.log(rightIdx)
        //     throw new Error("WHA");
        // }
        // console.log('down', downIdx, 'right', rightIdx)
    }
    return blockLocations

    function getAdjTileWithNewIdx(tile: MatchHelper, prevDirIdx: number): { tile: MatchHelper, directionIdx: number } | undefined {
        // console.log(`trying to match tile ${tile.block.tileNr}, direction ${prevDirIdx}`)
        // console.log(drawOnGrid(10, new Set(getPoints({ tile: tile.block, topLeft: { x: 0, y: 0 }, rotation: 0 }))))

        const borderId = tile.borderIds[prevDirIdx % 4]
        const borderingTileNr = matchMap.get(borderId)!
            .find(nr => nr !== tile.block.tileNr)
        if (!borderingTileNr) return

        const borderingTile = matchers.find(m => m.block.tileNr === borderingTileNr)!
        const matchIdx = borderingTile.matchIds.findIndex(id => id === borderId)

        const oldFlipped = prevDirIdx >= 4
        const newFlipped = matchIdx >= 4
        const shouldFlip = oldFlipped !== newFlipped

        let directionIdx = mod4(matchIdx + 2)
        if (shouldFlip) {
            directionIdx += 4
        }

        // console.log(`found bordering tile ${borderingTileNr}, matched on ${matchIdx}, new direction ${directionIdx}`)
        // console.log(drawOnGrid(10, new Set(getPoints({ tile: borderingTile.block, topLeft: { x: 0, y: 0 }, rotation: 0 }))))

        return {
            tile: borderingTile,
            directionIdx
        }
    }

    // calculates clockwise rotation steps needed to align the right index
    function getRotation(rightIdx: number): number {
        if (rightIdx < 4) {
            return mod4(5 - rightIdx)
        }
        // else we have flip over X-axis *and* rotation
        switch (rightIdx) {
            case 4: return 7;
            case 5: return 4;
            case 6: return 5;
            case 7: return 6;
        }
        throw new Error(`unexpexted rightIdx ${rightIdx}`);
    }
}

function getPointsForTile(tileLoc: TileLocation, border: number = -1): Point[] {
    // const tile = matchers.map(m => m.block).find(m => m.tileNr === tileLoc.tileNr)!
    // console.log(tile.pixels)
    const idxs = trueIndicesOf(tileLoc.tile.pixels)
    const multiplier = BlockSize + 2 * border
    const offsX = tileLoc.topLeft.x * multiplier + border
    const offsY = tileLoc.topLeft.y * multiplier + border
    const points = idxs.map(getBlockCoord)
    return rotatePoints(points, tileLoc.rotation, { x: BlockSize - 1, y: BlockSize - 1 })
        .filter(p => !isBorder(p, border))
        .map(x => ({ x: x.x + offsX, y: x.y + offsY }))
    // console.log(tileLoc.rotation, pointSet)

    function isBorder(p: Point, border: number): boolean {
        if (border >= 0) return false
        const max = BlockSize + border
        const min = -border
        return p.x < min || p.y < min || p.x >= max || p.y >= max
    }
}

function getBlockCoord(idx: number): Point {
    return { x: idx % BlockSize, y: Math.floor(idx / BlockSize) }
}

function rotatePoints(points: Point[], rotation: number, max?: Point): Point[] {
    const maxPoint = max ?? getMaxCoords(points);
    return points.map(p => rotatePoint(p, rotation, maxPoint))

    function rotatePoint({ x, y }: Point, rotation: number, { x: maxX, y: maxY }: Point): Point {
        switch (rotation) {
            case 0:
                return { x, y }
            case 1:
                return { x: maxY - y, y: x }
            case 2:
                return { x: maxX - x, y: maxY - y }
            case 3:
                return { x: y, y: maxX - x }
            case 4:
                return { x: x, y: maxY - y }
            case 5:
                return { x: y, y: x }
            case 6:
                return { x: maxX - x, y: y }
            case 7:
                return { x: maxY - y, y: maxX - x }

            default:
                throw new Error(`unknown rotation factor ${rotation}`)
        }
    }
}

function getMaxCoords(points: Point[]) {
    return points.reduce((max, p) => ({ x: Math.max(p.x, max.x), y: Math.max(p.y, max.y) }), { x: 0, y: 0 })
}

function drawGridString(points: Point[], pointSet?: Set<string>): string {
    const { x: maxX, y: maxY } = getMaxCoords(Array.from(points))
    const set = pointSet ?? new Set(points.map(pointStr))
    return range(maxY + 1)
        .map(y => range(maxX + 1)
            .map(x => set.has(pointStr({ x, y })) ? '#' : '.')
            .join(''))
        .join('\n')
}
