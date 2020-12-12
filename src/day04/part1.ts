import { parseInput } from '../util';

const input = parseInput({ split: { mapper: false, delimiter: "\r\n\r\n" } });

const requiredFields = [
    'byr',
    'iyr',
    'eyr',
    'hgt',
    'hcl',
    'ecl',
    'pid',
    //'cid',
]

export default input
    .map(getFields)
    .map(hasRequiredFields)
    .reduce((acc, cur) => acc += +cur, 0);

function getFields(str: string): string[] {
    const fieldsWithValues = str.split('\r\n').flatMap(l => l.split(' '));
    return fieldsWithValues.map(fwv => fwv.split(':')[0])
}

function hasRequiredFields(fields: string[]) {
    const retVal = requiredFields.every(f => fields.includes(f));
    return retVal;
}
