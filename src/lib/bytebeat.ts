import { AudioProcessor } from './audio/AudioProcessor';
import { TimeManager } from './audio/TimeManager';
import { bytebeatAlgorithms } from './bytebeatAlgorithms';

export { bytebeatAlgorithms };

export const calculateSample = (t: number, selectedAlgorithm: string): number => {
  const algorithm = bytebeatAlgorithms.find(a => a.name === selectedAlgorithm) || bytebeatAlgorithms[0];
  return algorithm.formula(t);
};

export class BytebeatProcessor {
  private audioProcessor: AudioProcessor;
  private timeManager: TimeManager;
  private scriptNode: ScriptProcessorNode;
  private isPlaying: boolean = false;
  private sampleRate: number = 8000;
  private baseRate: number = 8000;
  private currentAlgorithm: string;
  private bufferSize: number = 4096;
  private lastVisualizationValue: number = 0;
  
  constructor(onVisualize: (data: number) => void, initialAlgorithm: string = bytebeatAlgorithms[0].name) {
    this.audioProcessor = new AudioProcessor();
    this.timeManager = new TimeManager(60); // Set to 60fps
    this.currentAlgorithm = initialAlgorithm;
    
    this.scriptNode = this.audioProcessor.createScriptProcessor(this.bufferSize);
    
    this.scriptNode.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      
      for (let i = 0; i < output.length; i++) {
        const rateRatio = this.sampleRate / this.baseRate;
        const currentTime = this.timeManager.incrementTime(rateRatio);
        const sample = calculateSample(currentTime, this.currentAlgorithm);
        
        // Normalize to [-1.0, 1.0] range for audio output
        const normalizedSample = (sample / 128.0) - 1.0;
        output[i] = Math.max(-1.0, Math.min(1.0, normalizedSample));
        
        // Store the last sample for visualization
        this.lastVisualizationValue = sample / 255;
      }

      // Check if we should update the visualization
      if (this.timeManager.shouldUpdateVisualization()) {
        onVisualize(this.lastVisualizationValue);
      }
    };

    this.scriptNode.connect(this.audioProcessor.getGainNode());

    window.addEventListener('beforeunload', () => {
      this.stop();
      this.audioProcessor.close();
    });
  }

  async start() {
    if (!this.isPlaying) {
      try {
        await this.audioProcessor.start();
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
      this.audioProcessor.suspend();
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
    return this.timeManager.getCurrentTime();
  }
}