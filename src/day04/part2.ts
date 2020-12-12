import { parseInput } from '../util';

const input = parseInput({ split: { mapper: false, delimiter: "\r\n\r\n" } });

const requiredFields = [
    { f: 'byr', validate: (s: string) => +s >= 1920 && +s <= 2002 },
    { f: 'iyr', validate: (s: string) => +s >= 2010 && +s <= 2020 },
    { f: 'eyr', validate: (s: string) => +s >= 2020 && +s <= 2030 },
    { f: 'hgt', validate: valHgt },
    { f: 'hcl', validate: (s: string) => s.search(/^\#[0-9a-f]{6}$/) === 0 },
    { f: 'ecl', validate: valEcl },
    { f: 'pid', validate: (s: string) => s.search(/^[0-9]{9}$/) === 0 },
    //'cid',
]

export default input
    .map(getFields)
    .map(hasValidFields)
    .reduce((acc, cur) => acc += +cur, 0);

function getFields(str: string): string[][] {
    const fieldsWithValues = str.split('\r\n').flatMap(l => l.split(' '));
    return fieldsWithValues.map(fwv => fwv.split(':'))
}

function hasValidFields(fields: string[][]) {
    const retVal = requiredFields.every(rf => {
        const field = fields.find(f => f[0] === rf.f);
        if (!field)
            return false;
        const retVal = rf.validate(field[1]);
        // if (!retVal)
        //     console.log(retVal, rf.f, field);
        return retVal;
    });
    return retVal;
}

function valHgt(s: string) {
    const val = +s.substring(0, s.length - 2);
    if (s.endsWith('cm'))
        return val >= 150 && val <= 193;
    else if (s.endsWith('in'))
        return val >= 59 && val <= 76
    else
        return false;
}

function valEcl(s: string) {
    const validHairColors = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];
    return validHairColors.includes(s);
}