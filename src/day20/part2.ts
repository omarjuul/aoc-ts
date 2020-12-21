import { mod, range, sum } from '../util';
import { cornerBlocks, matchMap, BLOCK_SIZE, Block, MatchHelper, matchers } from './part1';

const mod4 = (num: number) => mod(num, 4)

let BlockSize = BLOCK_SIZE
const SEAMONSTER = `                  # 
#    ##    ##    ###
 #  #  #  #  #  #   `

type Point = { x: number, y: number }

interface TileLocation {
    tile: Block
    rotation: number
    topLeft: Point
}

const roughPatchLocations = new Set<Point>()

// choose a block to be top left
const topLeftBlock = cornerBlocks[0]

const indices = topLeftBlock.borderIds
    .map((borderId, idx) => ({ idx, match: matchMap.get(borderId)!.filter(x => x !== topLeftBlock.block.tileNr).length > 0 }))
    .filter(a => a.match)
    .map(a => a.idx)

const [rightIdx, downIdx] = (indices[0] === 0 && indices[1] === 3)
    ? [indices[1], indices[0]]
    : indices

const blockLocations = getBlockLocations(topLeftBlock, rightIdx, downIdx)
const pointsRot = blockLocations.flatMap(getPointsRotated)
console.log(drawOnGrid(26, new Set(pointsRot)))

// TODO: get maxX and maxY
// translate monster into Point[]
// try to draw monster on map from every starting point
// rotate and repeat (x8)


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
            // console.log(currentTile.block.tileNr, rotation)
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
}

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
        case 4: return 6;
        case 5: return 4;
        case 6: return 5;
        case 7: return 7;
    }
    throw new Error(`unexpexted rightIdx ${rightIdx}`);
}

function getPoints(tileLoc: TileLocation): string[] {
    return getPointsRotated({ rotation: 0, tile: tileLoc.tile, topLeft: tileLoc.topLeft })
}

function getPointsRotated(tileLoc: TileLocation): string[] {
    // const tile = matchers.map(m => m.block).find(m => m.tileNr === tileLoc.tileNr)!
    // console.log(tile.pixels)
    const idxs = tileLoc.tile.pixels
        .map((p, idx) => ({ p, idx }))
        .filter(x => x.p)
        .map(x => x.idx)
    const [offsX, offsY] = [tileLoc.topLeft.x * (BlockSize - 2), tileLoc.topLeft.y * (BlockSize - 2)]
    return idxs
        .map(i => getCoord(i, tileLoc.rotation))
        .filter(p => !isBorder(p))
        .map(x => `${x.x + offsX},${x.y + offsY}`)
    // console.log(tileLoc.rotation, pointSet)
}

function isBorder(p: Point): boolean {
    const max = BlockSize - 1
    return p.x == 0 || p.y == 0 || p.x == max || p.y == max
}

function getCoord(idx: number, rotation: number): Point {
    const [x, y] = [idx % BlockSize, Math.floor(idx / BlockSize)]
    const max = BlockSize - 1
    switch (rotation) {
        case 0:
            return { x, y }
        case 1:
            return { x: max - y, y: x }
        case 2:
            return { x: max - x, y: max - y }
        case 3:
            return { x: y, y: max - x }
        case 4:
            return { x: x, y: max - y }
        case 5:
            return { x: y, y: x }
        case 6:
            return { x: max - x, y: y }
        case 7:
            return { x: max - y, y: max - x }

        default:
            throw new Error(`unknown rotation factor ${rotation}`)
    }
}

function drawOnGrid(gridSize: number, points: Set<string>): string {
    return range(gridSize).map(y => range(gridSize).map(x => points.has(`${x},${y}`) ? '#' : '.').join('')).join('\n')
}

/* BlockSize = 3
const pixels = [true, true, false, false, false, false, false, false, false]
const test = range(8).map(r => drawRotated({ rotation: r, tile: { tileNr: 0, pixels }, topLeft: { x: 0, y: 0 } }))
test.forEach((t, i) => { console.log('rot ', i); drawOnGrid(3, new Set(t)); console.log() }) */
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