type BytebeatAlgorithm = {
  name: string;
  description: string;
  formula: (t: number) => number;
  experimental?: boolean;
};

export const bytebeatAlgorithms: BytebeatAlgorithm[] = [
  {
    name: "Classic Mix",
    description: "A balanced mix of bass, melody, harmony and rhythm using pure bytebeat operations",
    formula: (t: number): number => {
      const bass = ((t >> 4) | (t >> 8)) * (((t >> 12) & 63) + 1);
      const melody = ((t * 5 & t >> 7) | (t * 3 & t >> 10));
      const harmony = (t * (t >> 5 | t >> 8) >> (t >> 16));
      const rhythm = t * ((t >> 9 | t >> 13) & 15);
      
      return ((bass & 0xFF) + (melody & 0xFF) + (harmony & 0xFF) + (rhythm & 0xFF)) >> 2;
    }
  },
  {
    name: "Viznut Original",
    description: "The original bytebeat formula by Viznut that started it all",
    formula: (t: number): number => {
      return ((t * 5) & (t >> 7)) | (t * 3 & t >> 10);
    }
  },
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
  },
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
  },
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