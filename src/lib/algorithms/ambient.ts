type BytebeatAlgorithm = {
  name: string;
  description: string;
  formula: (t: number) => number;
  experimental?: boolean;
};

export const ambientAlgorithms: BytebeatAlgorithm[] = [
  {
    name: "Cosmic Drift",
    description: "Space-like drones through complex bit operations",
    formula: (t: number): number => {
      const drift = (t * (t >> 8 | t >> 9) & 46 & t >> 8);
      const space = ((t & t >> 8) | (t >> 3 & t >> 12)) ^ (t >> 14 | t >> 6);
      return ((drift + space) & 0xFF);
    }
  },
  {
    name: "8-bit Chiptune",
    description: "Classic video game console sound chip emulation",
    formula: (t: number): number => {
      const square = (t >> 4) & 1;
      const arp = t * ((t >> 9) | ((t >> 8) & (t >> 13)));
      return ((square * arp) & 0xFF);
    }
  },
  {
    name: "Binary Storm",
    description: "Chaotic storm of binary arithmetic operations",
    formula: (t: number): number => {
      const storm = ((t >> 4) ^ (t >> 3)) * ((t >> 2) | (t << 3));
      return (storm + (t >> 6 & t << 4)) & 0xFF;
    }
  },
  {
    name: "Fractal Pulse",
    description: "Self-similar patterns creating rhythmic structures",
    formula: (t: number): number => {
      return (t * ((t >> 12 | t >> 8) & (63 & t >> 4))) & 0xFF;
    }
  }
];