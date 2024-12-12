type BytebeatAlgorithm = {
  name: string;
  description: string;
  formula: (t: number) => number;
  experimental?: boolean;
};

export const experimentalAlgorithms: BytebeatAlgorithm[] = [
  {
    name: "Spirit Box Transmission",
    description: "Experimental algorithm that attempts to create speech-like patterns through rapid frequency scanning",
    formula: (t: number): number => {
      const scanRate = (t >> 3) & ((t >> 9) | (t >> 7));
      const formant1 = ((t << 3) & (t >> 5)) * ((t >> 7) + 1);
      const formant2 = ((t << 2) & (t >> 7)) * ((t >> 9) + 1);
      const noise = (t >> 4) & (t * 3);
      const envelope = (t >> 8) & ((t >> 15) + 1);
      return ((formant1 + formant2) * envelope + noise * scanRate) & 0xFF;
    },
    experimental: true
  },
  {
    name: "Quantum Superposition",
    description: "Explores quantum uncertainty through wave function collapse simulation",
    formula: (t: number): number => {
      const wave = ((t >> 7) | (t >> 9)) * ((t >> 4) + 1);
      const collapse = (t * wave) & ((t >> 5) ^ (t << 3));
      return (collapse & ((t >> 4) | (t << 6))) & 0xFF;
    },
    experimental: true
  },
  {
    name: "Hyperdimensional Pulse",
    description: "Attempts to sonify theoretical higher spatial dimensions",
    formula: (t: number): number => {
      const d1 = t >> 3;
      const d2 = t >> 5;
      const d3 = t >> 7;
      const d4 = t >> 9;
      const hyperspace = ((d1 ^ d2 ^ d3 ^ d4) & (t >> 2));
      return (hyperspace * ((t >> 6) | (t << 4))) & 0xFF;
    },
    experimental: true
  }
];