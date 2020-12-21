import { allergenMap } from './part1';

const allergensWithIngr = spliceAndExtractDecided().sort((a, b) => a.allergen > b.allergen ? 1 : -1)
console.log(allergensWithIngr);
export default allergensWithIngr.map(x => x.ingredient).join(',')

function spliceAndExtractDecided(): { allergen: string, ingredient: string }[] {
    const decided = Array.from(allergenMap.entries())
        .filter(e => e[1].size === 1)
        .map(e => ({ allergen: e[0], ingredient: e[1].values().next().value }))
    if (decided.length === 0) return decided

    decided.forEach(d => {
        for (const set of allergenMap.values()) {
            set.delete(d.ingredient)
        }
    })
    return decided.concat(spliceAndExtractDecided())
}
