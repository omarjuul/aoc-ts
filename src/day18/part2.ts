import { parseInput, product, sum } from '../util';

const input = parseInput({ split: { mapper: line => line.replace(/\s+/g, '').split('') } });
const values = input.map(parseLine)
export default values.reduce(sum)

type Operation = '+' | '*'

function parseLine(chars: string[]): number {
    console.log()
    const retVal = parseNext(chars.slice())
    // const prod = retVal.reduce(product)
    console.log(chars.join(''), '=', retVal/* , '=', prod */)
    return retVal
}

function parseNext(chars: string[]): number {
    console.log(chars.join(''))

    const firstChar = chars.shift()!
    if (firstChar === ')')
        throw new Error("WHA");

    let left = firstChar === '('
        ? [parseNext(chars)]
        : [+firstChar]
    console.log(`left = ${left}`);


    let next: string | undefined
    while (next = chars.shift()) {
        if (next === ')') {
            console.log(`returning ${left}`);
            return left.reduce(product)
        }
        const op = next!
        next = chars.shift()!
        let right: number
        if (next === '(') {
            right = parseNext(chars)
            console.log(`right = ${right}`);
        } else {
            right = +next
        }
        const result = handleOp(left, op, right)
        if (Number.isNaN(left)) {
            console.error(left, op, right)
        }
        left = result
    }

    return left.reduce(product)
}

function handleOp(curVals: number[], op: string, right: number): number[] {
    const operation = op as Operation
    return perfOp(operation, curVals, right)
}

function perfOp(op: Operation, lhs: number[], rhs: number): number[] {
    // console.log(lhs, op, rhs)

    switch (op) {
        case '+':
            const newVal = lhs[lhs.length - 1] + rhs
            return lhs.slice(0, -1).concat(newVal)
        case '*':
            return lhs.concat(rhs)

        default:
            console.error(`Unknown operation '${op}'`)
            throw new Error()
    }
}
