type BytebeatAlgorithm = {
  name: string;
  description: string;
  formula: (t: number) => number;
  experimental?: boolean;
};

export const classicAlgorithms: BytebeatAlgorithm[] = [
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
  }
];