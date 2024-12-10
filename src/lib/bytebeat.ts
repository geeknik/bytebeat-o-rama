export const calculateSample = (t: number): number => {
  // More musical patterns with harmonics and rhythmic elements
  const bass = Number(t & (t >> 4)) | (t >> 3);
  const melody = ((t % (1 << 14)) < (1 << 13) ? t ^ (t >> 8) : t >> 4);
  const rhythm = t <= 0 ? 1 : 1 + (t % 64);
  const harmony = Number((t >> 12) & (t >> 8)) * ((t >> 14) & 3);
  
  return (
    0xff &
    ((((bass & melody) / rhythm ^ (t % 42)) | harmony) +
      ((t * (t >> 16)) & 0xc0) |
      ((t >> 3) & (t >> 10) & (t >> 12) & 0x8f))
  );
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