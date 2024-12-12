export class TimeManager {
  private t: number = 1;
  private lastProcessTime: number = 0;
  private lastVisualizationTime: number = 0;

  constructor() {
    this.reset();
  }

  reset() {
    this.t = 1;
    this.lastProcessTime = performance.now();
    this.lastVisualizationTime = performance.now();
  }

  incrementTime(rateRatio: number) {
    this.t = (this.t + rateRatio) % 1000000; // Use modulo to create cyclical patterns
    return Math.floor(this.t);
  }

  getCurrentTime(): number {
    return Math.floor(this.t);
  }

  shouldUpdateVisualization(): boolean {
    const now = performance.now();
    if (now - this.lastVisualizationTime >= 16) { // ~60fps
      this.lastVisualizationTime = now;
      return true;
    }
    return false;
  }
}