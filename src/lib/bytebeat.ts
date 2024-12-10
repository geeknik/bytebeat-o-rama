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
      // Normalize the output to stay within 0-255 range
      const raw = ((t >> 6) ^ (t & 0x25)) * (((t >> 11) ^ (t & 0x25)));
      return raw & 0xFF;
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
  
  constructor(onVisualize: (data: number) => void, initialAlgorithm: string = bytebeatAlgorithms[0].name) {
    this.audioContext = new AudioContext();
    this.audioContext.suspend();
    this.currentAlgorithm = initialAlgorithm;
    
    this.scriptNode = this.audioContext.createScriptProcessor(1024, 1, 1);
    
    this.scriptNode.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      const currentTime = performance.now();
      const timeDelta = currentTime - this.lastProcessTime;
      this.lastProcessTime = currentTime;
      
      for (let i = 0; i < output.length; i++) {
        const rateRatio = this.sampleRate / this.baseRate;
        const sample = calculateSample(Math.floor(this.t), this.currentAlgorithm) / 255;
        output[i] = sample * 2 - 1;
        onVisualize(sample);
        
        this.t += rateRatio;
      }
    };
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
    }
  }

  setSampleRate(rate: number) {
    this.sampleRate = rate;
  }

  setAlgorithm(algorithmName: string) {
    this.currentAlgorithm = algorithmName;
  }

  getCurrentTime() {
    return Math.floor(this.t);
  }
}
