type BytebeatAlgorithm = {
  name: string;
  description: string;
  formula: (t: number) => number;
};

export const bytebeatAlgorithms: BytebeatAlgorithm[] = [
  {
    name: "Classic Mix",
    description: "A balanced mix of bass, melody, harmony and rhythm",
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
    description: "The original bytebeat formula by Viznut",
    formula: (t: number): number => {
      return ((t * 5) & (t >> 7)) | (t * 3 & t >> 10);
    }
  },
  {
    name: "Glitch Bass",
    description: "Heavy bass with glitch effects",
    formula: (t: number): number => {
      return (t * (t >> 5 | t >> 8) >> (t >> 16)) & 0xFF;
    }
  },
  {
    name: "Digital Rain",
    description: "Cascading digital tones",
    formula: (t: number): number => {
      const raw = ((t >> 6) ^ (t & 0x25)) * (((t >> 11) ^ (t & 0x25)));
      return raw & 0xFF;
    }
  },
  {
    name: "Acid Lead",
    description: "Sharp, acidic lead sounds reminiscent of TB-303",
    formula: (t: number): number => {
      const freq = ((t << 3) & (t >> 5)) + ((t << 2) & (t >> 7));
      const mod = (t >> 2) & ((t >> 8) | (t >> 16)) & 0x7F;
      return (freq * mod) & 0xFF;
    }
  },
  {
    name: "Cosmic Drift",
    description: "Ethereal space-like drones and textures",
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
    name: "DX7 Style",
    description: "Inspired by FM synthesis sounds of the Yamaha DX7",
    formula: (t: number): number => {
      // Create a complex FM-style sound using bitwise operations
      const carrier = (t * 3) & (t >> 5);
      const modulator = (t >> 3) ^ (t >> 7);
      const envelope = ((t >> 8) & 127);
      
      // Combine signals with FM-style modulation
      const output = ((carrier * modulator) & envelope) & 0xFF;
      
      return output;
    }
  }
];
