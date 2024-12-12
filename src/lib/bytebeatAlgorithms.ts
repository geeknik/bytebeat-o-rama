import { classicAlgorithms } from './algorithms/classic';
import { experimentalAlgorithms } from './algorithms/experimental';
import { musicalAlgorithms } from './algorithms/musical';
import { ambientAlgorithms } from './algorithms/ambient';

export type BytebeatAlgorithm = {
  name: string;
  description: string;
  formula: (t: number) => number;
  experimental?: boolean;
};

export const bytebeatAlgorithms: BytebeatAlgorithm[] = [
  ...classicAlgorithms,
  ...musicalAlgorithms,
  ...ambientAlgorithms,
  ...experimentalAlgorithms
];