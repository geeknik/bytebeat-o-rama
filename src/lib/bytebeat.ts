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
  
  constructor(onVisualize: (data: number) => void) {
    // Create audio context with suspended state
    this.audioContext = new AudioContext();
    this.audioContext.suspend();
    
    // Create script processor node with appropriate buffer size
    this.scriptNode = this.audioContext.createScriptProcessor(1024, 1, 1);
    
    this.scriptNode.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      
      for (let i = 0; i < output.length; i++) {
        const sample = calculateSample(this.t) / 255;
        output[i] = sample * 2 - 1; // Convert to range [-1, 1]
        onVisualize(sample);
        this.t++;
      }
    };
  }

  async start() {
    if (!this.isPlaying) {
      try {
        // Resume audio context if it's suspended
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
        }
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
    return this.t;
  }
}