import { mkdirSync, readFileSync, writeFileSync } from 'fs';

export const formatDay = (day: number | string) =>
  day.toString().padStart(2, '0');

/**
 * @typedef {Object} SplitOptions
 * @property {string|false} [delimiter='\n'] - a delimeter to split the input by (false will omit the splitting and return the entire input)
 * @property {funcion(string, number, string[]): *|false} [mapper=Number] - a function that will be used to map the splitted input (false will omit the mapping and return the splitted input)
 */
interface SplitOptions<T> {
  delimiter?: string | RegExp;
  mapper?: ((e: string, i: number, a: string[]) => T) | false;
}

export function parseInput(): number[];
export function parseInput(options: { split: false }): string;
export function parseInput(options: {
  split: { delimiter?: string | RegExp; mapper: false };
}): string[];
export function parseInput(options: { split: { delimiter: string | RegExp } }): number[];
export function parseInput<T>(options: { split: SplitOptions<T> }): T[];
/**
 * Parse the input from {day}/input.txt
 * @param {SplitOptions} [split]
 */
export function parseInput<T>({
  split,
}: { split?: SplitOptions<T> | false } = {}) {
  const input = readFileSync(
    `./src/day${formatDay(process.env.npm_config_day!)}/input.txt`,
    {
      encoding: 'utf-8',
    }
  );

  if (split === false) return input;

  const splitted = input.split(split?.delimiter ?? NL).filter(s => s.length > 0);
  const mapper = split?.mapper;

  return mapper === false
    ? splitted
    : splitted.map((...args) => mapper?.(...args) ?? Number(args[0]));
}

const genTemplate = (part: 1 | 2) => `import { parseInput } from '../util';

const input = parseInput();

// TODO: Complete Part ${part}
`;

export const setupDay = (day: number) => {
  const dir = `./src/day${formatDay(day)}`;
  mkdirSync(dir);
  writeFileSync(`${dir}/input.txt`, '');
  writeFileSync(`${dir}/part1.ts`, genTemplate(1));
  writeFileSync(`${dir}/part2.ts`, genTemplate(2));
};

export const NL = /\r?\n/
export const BLANKLINE = /\r?\n\r?\n/

export const sum = (a: number, b: number) => a + b
export const product = (a: number, b: number) => a * b

export const range = (size: number, startAt = 0) => [...Array(size).keys()].map(i => i + startAt)

export const mod = (num: number, modulo: number) => ((num % modulo) + modulo) % modulo

export const trueIndicesOf = (arr: boolean[]) => {
  return arr
    .map((b, idx) => ({ b, idx }))
    .filter(({ b }) => b)
    .map(({ idx }) => idx)
}
