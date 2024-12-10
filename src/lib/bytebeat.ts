export const calculateSample = (t: number): number => {
  // Create multiple layers of sound
  const bass = ((t >> 4) | (t >> 8)) * (((t >> 12) & 63) + 1);
  const melody = ((t * 5 & t >> 7) | (t * 3 & t >> 10));
  const harmony = (t * (t >> 5 | t >> 8) >> (t >> 16));
  const rhythm = t * ((t >> 9 | t >> 13) & 15);
  
  // Combine layers with different weights
  const combined = (
    (bass & 0xFF) * 0.3 +
    (melody & 0xFF) * 0.4 +
    (harmony & 0xFF) * 0.2 +
    (rhythm & 0xFF) * 0.1
  ) / 1.5;
  
  // Normalize to 0-255 range and apply subtle wave shaping
  return Math.min(255, Math.max(0, combined)) & 0xFF;
};

export class BytebeatProcessor {
  private audioContext: AudioContext;
  private scriptNode: ScriptProcessorNode;
  private t: number = 1;
  private isPlaying: boolean = false;
  private sampleRate: number = 8000;
  private lastProcessTime: number = 0;
  private baseRate: number = 8000; // Reference rate for timing calculations
  
  constructor(onVisualize: (data: number) => void) {
    this.audioContext = new AudioContext();
    this.audioContext.suspend();
    
    this.scriptNode = this.audioContext.createScriptProcessor(1024, 1, 1);
    
    this.scriptNode.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      const currentTime = performance.now();
      const timeDelta = currentTime - this.lastProcessTime;
      this.lastProcessTime = currentTime;
      
      for (let i = 0; i < output.length; i++) {
        // Adjust timing based on sample rate ratio
        const rateRatio = this.sampleRate / this.baseRate;
        const sample = calculateSample(Math.floor(this.t)) / 255;
        output[i] = sample * 2 - 1; // Convert to range [-1, 1]
        onVisualize(sample);
        
        // Increment t based on the sample rate ratio
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

  getCurrentTime() {
    return Math.floor(this.t);
  }
}