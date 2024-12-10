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
  private bufferSize: number = 1024;
  
  constructor(onVisualize: (data: number) => void, initialAlgorithm: string = bytebeatAlgorithms[0].name) {
    this.audioContext = new AudioContext();
    this.audioContext.suspend();
    this.currentAlgorithm = initialAlgorithm;
    
    // Use a larger buffer size for more stable audio processing
    this.scriptNode = this.audioContext.createScriptProcessor(this.bufferSize, 1, 1);
    
    this.scriptNode.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      const currentTime = performance.now();
      const timeDelta = currentTime - this.lastProcessTime;
      this.lastProcessTime = currentTime;
      
      // Process audio in chunks for better performance
      for (let i = 0; i < output.length; i++) {
        const rateRatio = this.sampleRate / this.baseRate;
        const sample = calculateSample(Math.floor(this.t), this.currentAlgorithm);
        
        // Normalize sample to [-1, 1] range for audio output
        output[i] = (sample / 255) * 2 - 1;
        
        // Send every nth sample to visualizer to prevent overwhelming it
        if (i % 4 === 0) {
          onVisualize(sample / 255);
        }
        
        this.t += rateRatio;
      }
    };

    // Prevent audio context memory leaks
    window.addEventListener('beforeunload', () => {
      this.stop();
      this.audioContext.close();
    });
  }

  async start() {
    if (!this.isPlaying) {
      try {
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
        }
        this.lastProcessTime = performance.now();
        this.scriptNode.connect(this.audioContext.destination);
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