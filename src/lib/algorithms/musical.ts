type BytebeatAlgorithm = {
  name: string;
  description: string;
  formula: (t: number) => number;
  experimental?: boolean;
};

export const musicalAlgorithms: BytebeatAlgorithm[] = [
  {
    name: "Glitch Bass",
    description: "Heavy bass with glitch effects using pure bitwise operations",
    formula: (t: number): number => {
      return (t * (t >> 5 | t >> 8) >> (t >> 16)) & 0xFF;
    }
  },
  {
    name: "Digital Rain",
    description: "Cascading digital tones through bitwise manipulation",
    formula: (t: number): number => {
      return ((t >> 6) ^ (t & 0x25)) * (((t >> 11) ^ (t & 0x25))) & 0xFF;
    }
  },
  {
    name: "Acid Lead",
    description: "Sharp, acidic lead sounds through bit shifting",
    formula: (t: number): number => {
      const freq = ((t << 3) & (t >> 5)) + ((t << 2) & (t >> 7));
      const mod = (t >> 2) & ((t >> 8) | (t >> 16)) & 0x7F;
      return (freq * mod) & 0xFF;
    }
  }
];