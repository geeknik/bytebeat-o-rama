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
      
      const combined = (
        (bass & 0xFF) * 0.3 +
        (melody & 0xFF) * 0.4 +
        (harmony & 0xFF) * 0.2 +
        (rhythm & 0xFF) * 0.1
      ) / 1.5;
      
      return Math.min(255, Math.max(0, combined)) & 0xFF;
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
      // Create a slower fundamental frequency
      const fundamental = t * 0.0002;
      
      // Modulator with controlled frequency ratio
      const modulator = Math.sin(fundamental * 2) * 20;
      
      // Carrier frequency modulated by the modulator
      const carrier = Math.sin(fundamental + modulator) * 127;
      
      // Envelope to shape the sound over time
      const env = Math.max(0, Math.min(1, (((t >> 12) & 127) / 127)));
      
      // Combine and normalize to 8-bit range (0-255)
      return Math.floor(((carrier * env) + 127)) & 0xFF;
    }
  }
];

export const calculateSample = (t: number, selectedAlgorithm: string): number => {
  const algorithm = bytebeatAlgorithms.find(a => a.name === selectedAlgorithm) || bytebeatAlgorithms[0];
  return algorithm.formula(t);
};

export class BytebeatProcessor {
  private audioContext: AudioContext;
  private scriptNode: ScriptProcessorNode;
  private t: number = 1;
  private isPlaying: boolean = false;
  private sampleRate: number = 8000;
  private lastProcessTime: number = 0;
  private baseRate: number = 8000;
  private currentAlgorithm: string;
  private bufferSize: number = 2048; // Increased for better stability
  private gain: GainNode;
  private visualizationThrottle: number = 0;
  
  constructor(onVisualize: (data: number) => void, initialAlgorithm: string = bytebeatAlgorithms[0].name) {
    this.audioContext = new AudioContext();
    this.audioContext.suspend();
    this.currentAlgorithm = initialAlgorithm;
    
    this.gain = this.audioContext.createGain();
    this.gain.gain.value = 0.5;
    this.gain.connect(this.audioContext.destination);
    
    this.scriptNode = this.audioContext.createScriptProcessor(this.bufferSize, 1, 1);
    
    this.scriptNode.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      const currentTime = performance.now();
      const timeDelta = currentTime - this.lastProcessTime;
      this.lastProcessTime = currentTime;
      
      for (let i = 0; i < output.length; i++) {
        const rateRatio = this.sampleRate / this.baseRate;
        const sample = calculateSample(Math.floor(this.t), this.currentAlgorithm);
        
        const normalizedSample = (sample / 128.0) - 1.0;
        output[i] = Math.max(-1.0, Math.min(1.0, normalizedSample));
        
        // Throttle visualization updates
        this.visualizationThrottle++;
        if (this.visualizationThrottle >= 8) { // Only update every 8th sample
          onVisualize(sample / 255);
          this.visualizationThrottle = 0;
        }
        
        this.t += rateRatio;
      }
    };

    this.scriptNode.connect(this.gain);

    window.addEventListener('beforeunload', () => {
      this.stop();
      this.audioContext.close();
    });
  }

  async start() {
    if (!this.isPlaying) {
      try {
        await this.audioContext.resume();
        this.lastProcessTime = performance.now();
        this.isPlaying = true;
        console.log('BytebeatProcessor started successfully');
      } catch (error) {
        console.error('Error starting audio:', error);
      }
    }
  }

  stop() {
    if (this.isPlaying) {
      this.scriptNode.disconnect();
      this.audioContext.suspend();
      this.isPlaying = false;
      console.log('BytebeatProcessor stopped');
    }
  }

  setSampleRate(rate: number) {
    this.sampleRate = Math.max(4000, Math.min(44100, rate));
    console.log(`Sample rate set to ${this.sampleRate}Hz`);
  }

  setAlgorithm(algorithmName: string) {
    this.currentAlgorithm = algorithmName;
    console.log(`Algorithm changed to ${algorithmName}`);
  }

  getCurrentTime() {
    return Math.floor(this.t);
  }
}
