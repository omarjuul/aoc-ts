import { parseInput, sum } from '../util';

const input = parseInput({
    split: {
        delimiter: '\r\n\r\n', mapper: (s: string) =>
            s.split('\r\n')
                .filter((s, i) => i > 0 && s !== '')
                .map(s => +s)
    }
})
const [p1, p2] = input

console.log('player one cards:')
console.log(p1)
console.log('player two cards:')
console.log(p2)

const [winner, winnerDeck] = playGame(p1, p2)

console.log(winner ? 'player 1 won!' : 'player 2 won!', winnerDeck)
export default scoreDeck(winnerDeck)


function playGame(p1deck: number[], p2deck: number[]): [boolean, number[]] {
    const seenDeckConfigs = new Set<string>()
    while (p1deck.length > 0 && p2deck.length > 0) {
        const decksId = p1deck.toString() + p2deck.toString()
        if (seenDeckConfigs.has(decksId)) {
            // console.log('recursion prevented');
            return [true, p1deck]
        }
        seenDeckConfigs.add(decksId)

        const c1 = p1deck.shift()!
        const c2 = p2deck.shift()!
        let p1winner: boolean
        if (c1 > p1deck.length || c2 > p2deck.length) {
            p1winner = c1 > c2
        } else {
            // console.log('starting subgame');
            [p1winner,] = playGame(p1deck.slice(0, c1), p2deck.slice(0, c2))
            // console.log('subgame ended');
        }

        if (p1winner) {
            p1deck.push(c1)
            p1deck.push(c2)
        } else {
            p2deck.push(c2)
            p2deck.push(c1)
        }
        // console.log(p1winner ? 'player 1 won!' : 'player 2 won!', p1deck, p2deck)
    }
    const p1win = p1deck.length > 0
    return [p1win, p1win ? p1deck : p2deck]
}

function scoreDeck(deck: number[]) {
    const topCardScore = deck.length
    return deck.map((c, i) => c * (topCardScore - i)).reduce(sum)
}
