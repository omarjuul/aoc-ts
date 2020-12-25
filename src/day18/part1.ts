import { parseInput, range, sum } from '../util';

const input = parseInput({ split: { mapper: line => line.replace(/\s+/g, '').split('') } });
const values = input.map(parseLine)
export default values.reduce(sum)

type Operation = '+' | '*'

function parseLine(chars: string[]): number {
    console.log()
    const retVal = parseNext(chars.slice())
    console.log(chars.join(''), ' = ', retVal)
    return retVal
}

function parseNext(chars: string[]): number {
    console.log(chars.join(''))

    const firstChar = chars.shift()!
    if (firstChar === ')')
        throw new Error("WHA");

    let left = firstChar === '('
        ? parseNext(chars)
        : +firstChar
    console.log(`left = ${left}`);


    let next: string | undefined
    while (next = chars.shift()) {
        if (next === ')') {
            console.log(`returning ${left}`);
            return left
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

    return left
}

function handleOp(curVal: number, op: string, right: number): number {
    const operation = op as Operation
    return perfOp(operation, curVal, right)
}

function perfOp(op: Operation, lhs: number, rhs: number) {
    // console.log(lhs, op, rhs)

    switch (op) {
        case '+':
            return lhs + rhs
        case '*':
            return lhs * rhs

        default:
            console.error(`Unknown operation '${op}'`)
            throw new Error()
    }
}
