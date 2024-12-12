export class AudioProcessor {
  private audioContext: AudioContext;
  private gain: GainNode;

  constructor() {
    this.audioContext = new AudioContext();
    this.gain = this.audioContext.createGain();
    this.gain.gain.value = 0.5;
    this.gain.connect(this.audioContext.destination);
  }

  createScriptProcessor(bufferSize: number): ScriptProcessorNode {
    return this.audioContext.createScriptProcessor(bufferSize, 1, 1);
  }

  async start() {
    await this.audioContext.resume();
  }

  suspend() {
    return this.audioContext.suspend();
  }

  close() {
    return this.audioContext.close();
  }

  getGainNode(): GainNode {
    return this.gain;
  }
}