import { parseInput } from '../util';

const input = parseInput({ split: { mapper: parseFood } });
// console.log(input);

export const allergenMap = new Map<string, Set<string>>()
for (const { alrg, ingr } of input.flat()) {
    if (!allergenMap.has(alrg)) {
        allergenMap.set(alrg, new Set(ingr.values()))
    } else {
        const prevSet = allergenMap.get(alrg)!
        allergenMap.set(alrg, intersectionOf(prevSet, ingr))
    }
}
// console.log(allergenMap);

const dangerous = new Set<string>()
for (const ingrWithAlrg of allergenMap.values()) {
    for (const ingr of ingrWithAlrg) {
        dangerous.add(ingr)
    }
}

const allIngr = input.flatMap(i => Array.from(i[0].ingr.values()))
const safe = allIngr.filter(ingr => !dangerous.has(ingr))
// console.log(allIngr, safe)
export default safe.length

function parseFood(line: string) {
    const [ingredients, allergens] = line.replace(')', '').split(' (contains ')
    const ingr = ingredients.split(' ')
    return allergens.split(', ').map(a => ({ alrg: a, ingr: new Set(ingr) }))
}

function intersectionOf<T>(left: Set<T>, right: Set<T>): Set<T> {
    const intersection = new Set<T>()
    for (const leftEl of left) {
        if (right.has(leftEl))
            intersection.add(leftEl)
    }
    return intersection
}

function unionOf<T>(left: Set<T>, right: Set<T>): Set<T> {
    const union = new Set<T>(left.values())
    for (const rightEl of right) {
        union.add(rightEl)
    }
    return union
}
