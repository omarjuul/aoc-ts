import { parseInput, range } from '../util';

const input = parseInput({ split: { delimiter: '' } });
const nodePointers = new Map<number, LinkedListNode>()
let prev: LinkedListNode | undefined = undefined
for (const idx of range(1e6, 1)) {
    const label = input[idx - 1] ?? idx
    const node: LinkedListNode = { next: undefined, label }
    if (prev) {
        prev.next = node
    }
    nodePointers.set(label, node)
    prev = node
}
const [first, last] = [nodePointers.get(input[0])!, prev!]
last.next = first
let currentNode = first
console.log('first node', first.label)

for (const move of range(10_000_000)) {
    // if (move % 100000 === 0) console.log(move)

    const removedhead = currentNode.next!
    const removedmidl = removedhead.next!
    const removedtail = removedmidl.next!
    const nextNode = removedtail!.next!

    let find = currentNode.label - 1
    if (find < 1) find = 1e6
    let targetNode: LinkedListNode | undefined
    while ([removedhead.label, removedmidl.label, removedtail.label].includes(find)) {
        find--
        if (find < 1) find = 1e6
    }
    targetNode = nodePointers.get(find)
    if (!targetNode) {
        console.log(`node ${find} not found`)
        console.log([removedhead.label, removedmidl.label, removedtail.label])
    }
    const afterTarget = targetNode!.next!

    currentNode.next = nextNode
    targetNode!.next = removedhead
    removedtail.next = afterTarget

    if (move < 10) console.log(currentNode.label, nextNode.label)

    currentNode = nextNode
}

const oneNode = nodePointers.get(1)!
const secondNode = oneNode.next!
const thirdNode = secondNode.next!
console.log(oneNode.label, secondNode.label, thirdNode.label)

export default secondNode.label * thirdNode.label


interface LinkedListNode {
    next: LinkedListNode | undefined
    label: number
}
