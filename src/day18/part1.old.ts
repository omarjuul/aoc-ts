import { parseInput, sum } from '../util';

// const input = parseInput({ split: { mapper: line => line.split(' ') } });
const input = ['5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))'.split(' ')]
// const input = ['1 + (((2 * 3)))'.split(' ')] // 7
// const input = ['((7 + 7 * 3 + 3 + 7) * 3 + 7 + 2 * (3 * 8 * 2 + 2 * 7 * 4) + 9) + 4 + 3 * 7'.split(' ')] // 1617112

const values = input.map(parseLine)
console.log(values)
console.log(values.length)
console.log(values.slice(-10))
export default values.map(n => BigInt(n)).reduce((a, b) => a + b)

function parseLine(chars: string[]): number {
    return +determineValue(chars)
}

function determineValue(expr: string[]): string {
    // console.log(expr);

    let rhs = expr.pop()!
    if (rhs.endsWith(')')) {
        expr.push(rhs.slice(0, -1))
        rhs = determineValue(expr)
    } else if (rhs.startsWith('(')) {
        // console.log('returning ', rhstr.slice(1))
        return determineValue([rhs.slice(1)])
    }
    // console.log('rhs: ', +rhs)

    const op = expr.pop()
    // console.log('op: ', op)
    if (!op) {
        return rhs
    }
    const leftEvaluated = +determineValue(expr)
    return perfOp(op, leftEvaluated, +rhs).toString()
}

function perfOp(op: string, lhs: number, rhs: number) {
    // console.log(lhs, op, rhs)

    switch (op) {
        case '+':
            return lhs + rhs
        case '*':
            return lhs * rhs

        default:
            throw new Error(`Unknown operation ${op}`)
    }
}
