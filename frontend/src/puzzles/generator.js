import { getDateSeed, seedToNumber } from '../utils/dateSeed';
import { generateSequencePuzzle } from './types/sequence';
import { generateLogicGridPuzzle } from './types/logicGrid';
import { generatePatternPuzzle } from './types/pattern';
import { generateSyllogismPuzzle } from './types/syllogism';

const PUZZLE_TYPES = [
  { key: 'sequence', name: 'Number Sequence', generator: generateSequencePuzzle },
  { key: 'logicGrid', name: 'Logic Grid', generator: generateLogicGridPuzzle },
  { key: 'pattern', name: 'Pattern Match', generator: generatePatternPuzzle },
  { key: 'syllogism', name: 'Syllogism', generator: generateSyllogismPuzzle },
];

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

export function generateDailyPuzzle(date = null) {
  const seed = getDateSeed(date);
  const seedNum = seedToNumber(seed, 0);
  const typeIndex = seedNum % PUZZLE_TYPES.length;
  const puzzleType = PUZZLE_TYPES[typeIndex];
  const random = seededRandom(seedNum);
  const puzzle = puzzleType.generator(random, seed);

  return {
    ...puzzle,
    puzzleType: puzzleType.key,
    puzzleTypeName: puzzleType.name,
    seed: seed.slice(0, 12),
    generatedAt: new Date().toISOString(),
  };
}

export function getPuzzleTypeName(key) {
  const t = PUZZLE_TYPES.find((p) => p.key === key);
  return t ? t.name : key;
}
