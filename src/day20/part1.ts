import { parseInput, NL, BLANKLINE, product, sum } from '../util';

export const BLOCK_SIZE = 10
const input = parseInput({ split: { delimiter: BLANKLINE, mapper: parseBlock } })
export const matchers = input.map(getMatchHelper)
const fuqU: [number, number][][] = matchers.map(m => m.matchIds.map(id => [id, m.block.tileNr]))
const unflipped = fuqU.flatMap(typeScript => typeScript)
export const matchMap = new Map<number, number[]>()
for (const [k, v] of unflipped) {
    const newVal = matchMap.get(k) ?? []
    newVal.push(v)
    matchMap.set(k, newVal)
}
export const cornerBlocks = matchers
    .filter(m => m.borderIds
        .map(id => matchMap.has(id) && matchMap.get(id)!.length > 1)
        .reduce((sum, match) => sum += +match, 0) <= 2)

console.log(cornerBlocks);
export default cornerBlocks.map(b => b.block.tileNr).reduce(product)

export interface Block {
    tileNr: number
    pixels: boolean[]
}

type Border = boolean[]

export interface MatchHelper {
    block: Block
    borderIds: number[]
    matchIds: number[]
}

function parseBlock(block: string): Block {
    const [header, ...lines] = block.split(NL)
    const pixels = lines.flatMap(l => Array.from(l, v => v === '#'))
    const tileNr = +header.slice(-5, -1)
    return { tileNr, pixels }
}

function getMatchHelper(block: Block): MatchHelper {
    const borders: Border[] = []
    /* upper border */
    borders.push(block.pixels.filter((_p, i) => i < BLOCK_SIZE))
    /* right border */
    borders.push(block.pixels.filter((_p, i) => i % BLOCK_SIZE === BLOCK_SIZE - 1))
    /* lower border */
    borders.push(block.pixels.filter((_p, i) => i >= BLOCK_SIZE ** 2 - BLOCK_SIZE).reverse())
    /* left border */
    borders.push(block.pixels.filter((_p, i) => i % BLOCK_SIZE === 0).reverse())

    const borderIds = borders
        .map(b => b
            .map((p, i) => p ? 2 ** i : 0)
            .reduce(sum))
    const matchIds = borders
        .map(b => b
            .reverse()
            .map((p, i) => p ? 2 ** i : 0)
            .reduce(sum))
        .concat(borderIds)

    return { block, borderIds, matchIds }
}
