import { parseInput, range, sum } from '../util';

const input = parseInput({ split: { mapper: line => line.split(' ') } });
const values = input.map(parseLine)
export default values.reduce(sum)

type Operation = '+' | '*'

interface ResultStackEntry {
    value: number;
    operation: Operation;
}
// const identity: ResultStackEntry = { value: 0, operation: '+' }

function parseLine(chars: string[]): number {
    const resultStack: ResultStackEntry[] = []
    return parseNext(chars, resultStack)
}

function parseNext(chars: string[], stack: ResultStackEntry[]): number {
    let currentValue = +(chars.shift()!)

    while (chars.length > 0) {
        const op = chars.shift()!
        const right = chars.shift()!
        currentValue = handleOp(stack, currentValue, op, right)
    }

    return currentValue
}

function handleOp(stack: ResultStackEntry[], curVal: number, op: string, right: string): number {
    const operation = op as Operation
    if (right.startsWith('(')) {
        stack.push({ value: curVal, operation })

    } else if (right.endsWith(')')) {
        const popped = stack.pop()
        popped?.operation
    }

    return perfOp(operation, curVal, +right)
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
