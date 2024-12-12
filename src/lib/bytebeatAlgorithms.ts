type BytebeatAlgorithm = {
  name: string;
  description: string;
  formula: (t: number) => number;
  experimental?: boolean;
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
    name: "Quantum Ripple",
    description: "Complex interference patterns creating evolving soundscapes",
    formula: (t: number): number => {
      const wave1 = (t >> 3) ^ (t * 7 & t >> 4);
      const wave2 = (t >> 5) & (t * 3 | t >> 7);
      return ((wave1 * wave2) & 0xFF);
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
      const pulse = t * ((t >> 12 | t >> 8) & (63 & t >> 4));
      return (pulse & 0xFF);
    }
  },
  {
    name: "Fibonacci Cascade",
    description: "Golden ratio-based harmonics using Fibonacci sequences",
    formula: (t: number): number => {
      const phi = 1.618033988749895;
      const fib = ((t * phi) >> 4) ^ ((t * phi * phi) >> 8);
      return (fib & ((t >> 6) | (t << 2))) & 0xFF;
    }
  },
  {
    name: "Prime Wave",
    description: "Rhythmic patterns based on prime number theory",
    formula: (t: number): number => {
      const prime = (t * 17) & (t * 13) ^ (t * 11);
      const modulo = (prime & 0xFF) % ((t >> 8) + 1);
      return (modulo * (t >> 4)) & 0xFF;
    }
  },
  {
    name: "Mandelbrot Beat",
    description: "Inspired by the mathematics of the Mandelbrot set",
    formula: (t: number): number => {
      const z = (t >> 5) ^ (t >> 3);
      const c = t & (t >> 8);
      return ((z * z + c) & 0xFF);
    }
  },
  {
    name: "Chaos Theory",
    description: "Based on the butterfly effect and chaos mathematics",
    formula: (t: number): number => {
      const butterfly = (t * 3) & (t * 5);
      const effect = (butterfly >> 4) ^ (butterfly << 2);
      return (effect + (t >> ((t >> 12) & 7))) & 0xFF;
    }
  },
  {
    name: "Möbius Transform",
    description: "Complex patterns inspired by Möbius transformations",
    formula: (t: number): number => {
      const a = t >> 3;
      const b = t >> 5;
      const mobius = (a * t + b) / ((t >> 8) + 1);
      return (mobius & (t >> 4)) & 0xFF;
    }
  },
  {
    name: "Quantum Superposition",
    description: "Explores quantum uncertainty through wave function collapse simulation",
    formula: (t: number): number => {
      const psi = Math.sin(t * 0.0001) * ((t >> 7) | (t >> 9));
      const collapse = (t * psi) & ((t >> 5) ^ (t << 3));
      return (collapse & ((t >> 4) | (t << 6))) & 0xFF;
    },
    experimental: true
  },
  {
    name: "Hyperdimensional Pulse",
    description: "Attempts to sonify theoretical higher spatial dimensions",
    formula: (t: number): number => {
      const dimensions = [t >> 3, t >> 5, t >> 7, t >> 9];
      const hyperspace = dimensions.reduce((acc, dim) => (acc ^ dim) & (t >> 2));
      return (hyperspace * ((t >> 6) | (t << 4))) & 0xFF;
    },
    experimental: true
  },
  {
    name: "Consciousness Wave",
    description: "Based on theoretical models of quantum consciousness and neural oscillations",
    formula: (t: number): number => {
      const phi = 1.618033988749895; // Golden ratio
      const consciousness = (t * phi) & ((t >> 8) * Math.E);
      const brainwave = consciousness ^ (t >> ((t >> 14) & 7));
      return (brainwave & ((t >> 3) | (t << 5))) & 0xFF;
    },
    experimental: true
  },
  {
    name: "Time Dilation",
    description: "Inspired by relativistic time dilation near event horizons",
    formula: (t: number): number => {
      const c = 299792458; // Speed of light
      const gravitationalTime = t + Math.sin(t * 0.0001) * (t >> 7);
      const spacetime = (gravitationalTime * (t >> 5)) & (t >> ((t >> 16) & 3));
      return (spacetime ^ ((t >> 4) | (t << 3))) & 0xFF;
    },
    experimental: true
  },
  {
    name: "Interdimensional Portal",
    description: "Theoretical sound pattern that might resonate with parallel universes",
    formula: (t: number): number => {
      const portalFreq = ((t << 2) ^ (t >> 5)) * Math.PI;
      const vortex = (portalFreq & (t >> 7)) ^ ((t << 3) & (t >> 4));
      const resonance = vortex * ((t >> 3) | (t << 5));
      return (resonance & ((t >> 6) ^ (t << 2))) & 0xFF;
    },
    experimental: true
  },
  {
    name: "Spirit Box Transmission",
    description: "Experimental algorithm that attempts to create speech-like patterns through rapid frequency scanning and modulation, inspired by paranormal research equipment.",
    formula: (t: number): number => {
      // Rapid frequency scanning (similar to spirit box frequency hopping)
      const scanRate = Math.sin(t * 0.0001) * 10;
      
      // Create voice-like formants through frequency bands
      const formant1 = ((t << 3) & (t >> 5)) * (Math.sin(t * 0.001) + 1);
      const formant2 = ((t << 2) & (t >> 7)) * (Math.cos(t * 0.002) + 1);
      
      // Add white noise component
      const noise = (Math.sin(t * 0.1) * 127) & (t >> 4);
      
      // Amplitude modulation to create word-like segments
      const envelope = Math.sin(t * 0.0002) * Math.sin(t * 0.00004);
      
      // Combine all components
      const signal = ((formant1 + formant2) * envelope + noise * scanRate);
      
      return (signal & 0xFF);
    },
    experimental: true
  }
];
