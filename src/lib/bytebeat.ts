export const calculateSample = (t: number): number => {
  return (
    0xfa &
    ((((t & (t >> 6) & ((t % (1 << 14)) < (1 << 13) ? t ^ (t >> 8) : t >> 8)) /
      (t <= 0 ? 1 : 1 + (t % 32)) ^
      (t % 30)) |
      (((t >> 18) && t <= (1 << 18) + (1 << 17)) * t << 1)) +
      ((t * (t >> 18)) & 0xe0) |
      ((t / 10) & (t >> 14) & (t >> 15) & 0xaa))
  );
};

export class BytebeatProcessor {
  private audioContext: AudioContext;
  private scriptNode: ScriptProcessorNode;
  private t: number = 1;
  private isPlaying: boolean = false;
  private sampleRate: number = 8000;
  
  constructor(onVisualize: (data: number) => void) {
    this.audioContext = new AudioContext();
    this.scriptNode = this.audioContext.createScriptProcessor(1024, 1, 1);
    
    this.scriptNode.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      
      for (let i = 0; i < output.length; i++) {
        const sample = calculateSample(this.t) / 255;
        output[i] = sample * 2 - 1;
        onVisualize(sample);
        this.t++;
      }
    };
  }

  start() {
    if (!this.isPlaying) {
      this.scriptNode.connect(this.audioContext.destination);
      this.isPlaying = true;
    }
  }

  stop() {
    if (this.isPlaying) {
      this.scriptNode.disconnect();
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