import { parseInput, product, range, sum } from '../util';
import { cornerBlocks, matchMap, BLOCK_SIZE, Block, MatchHelper, matchers } from './part1';

const SEAMONSTER = `                  # 
#    ##    ##    ###
 #  #  #  #  #  #   `

type Point = { x: number, y: number }

interface TileLocation {
    tileNr: number
    rotation: number
    topLeft: Point
}

const roughPatchLocations = new Set<Point>()

// choose a block to be top left
const topLeftBlock = cornerBlocks[0]

const indices = topLeftBlock.borderIds
    .map((id, idx) => ({ idx, match: matchMap.get(id)!.filter(x => x !== topLeftBlock.block.tileNr).length > 0 }))
    .filter(a => a.match)
    .map(a => a.idx)

let [rightIdx, downIdx] = (indices[0] === 0 && indices[1] === 3)
    ? [indices[1], indices[0]]
    : indices

// find "correct" orientation
// find blocks to the right
// find block below this one
const blockLocations: TileLocation[] = []
let currentTile: MatchHelper | undefined = topLeftBlock
let lastLeftTile = topLeftBlock
let x, y: number
// rotate(topLeftBlock.block, 1 - indices[0])
y = 0
while (true) {
    x = 0
    while (true) {
        const rotation = getRotation(rightIdx)
        blockLocations.push({ tileNr: currentTile.block.tileNr, rotation, topLeft: { x, y } })
        const newInfo = getAdjTileWithNewIdx(currentTile, rightIdx)
        if (!newInfo) {
            break;
        }
        [currentTile, rightIdx] = [newInfo.tile, newInfo.directionIdx]
    }
    // console.log(blockLocations)
    // blockLocations.forEach(drawRotated)

    const info = getAdjTileWithNewIdx(lastLeftTile, downIdx)
    if (!info) break;
    [currentTile, downIdx] = [info.tile, info.directionIdx]
    lastLeftTile = currentTile
    rightIdx = (downIdx - 1) % 4
    if (!(matchMap.get(currentTile.borderIds[rightIdx])!.some(nr => nr !== currentTile?.block.tileNr))) {
        rightIdx = (rightIdx + 2) % 4
    }
}

// todo
console.log()


function getAdjTileWithNewIdx(tile: MatchHelper, directionIdx: number): { tile: MatchHelper, directionIdx: number } | undefined {
    const borderId = tile.borderIds[directionIdx % 4]
    const borderingTileNr = matchMap.get(borderId)!
        .find(nr => nr !== tile.block.tileNr)
    if (!borderingTileNr) return
    const borderingTile = matchers.find(m => m.block.tileNr === borderingTileNr)!

    let borderIdxOnNewTile = borderingTile.matchIds.findIndex(id => id === borderId)!
    if (directionIdx >= 4) {
        borderIdxOnNewTile = (borderIdxOnNewTile + 4) % 8
    }
    return {
        tile: borderingTile,
        directionIdx: (borderIdxOnNewTile + 2) % 4 + (borderIdxOnNewTile < 4 ? 0 : 4)
    }
}

// calculates clockwise rotation steps needed to align the right index
function getRotation(rightIdx: number): number {
    return rightIdx < 4
        ? (5 - rightIdx) % 4
        : 4 + (5 - rightIdx % 4) % 4;
}

function drawRotated(tileLoc: TileLocation) {
    const tile = matchers.map(m => m.block).find(m => m.tileNr === tileLoc.tileNr)!
    // console.log(tile.pixels)
    const idxs = tile.pixels.map((p, idx) => ({ p, idx })).filter(x => x.p).map(x => x.idx)
    const pointSet = new Set(idxs.map(i => getCoord(i, tileLoc.rotation)).map(x => `${x.x},${x.y}`))
    // console.log(tileLoc.rotation, pointSet)
    console.log(range(10).map(y => range(10).map(x => pointSet.has(`${x},${y}`) ? '#' : '.').join('')).join('\n'))
}

function getCoord(idx: number, rotation: number): Point {
    const [x, y] = [idx % BLOCK_SIZE, Math.floor(idx / BLOCK_SIZE)]
    const max = BLOCK_SIZE - 1
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
