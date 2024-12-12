export class TimeManager {
  private t: number = 1;
  private lastProcessTime: number = 0;
  private lastVisualizationTime: number = 0;
  private targetFPS: number = 60;
  private frameInterval: number = 1000 / 60; // 16.67ms for 60fps

  constructor(fps: number = 60) {
    this.setFPS(fps);
    this.reset();
  }

  reset() {
    this.t = 1;
    this.lastProcessTime = performance.now();
    this.lastVisualizationTime = performance.now();
  }

  setFPS(fps: number) {
    this.targetFPS = Math.max(1, Math.min(fps, 120)); // Clamp between 1 and 120 fps
    this.frameInterval = 1000 / this.targetFPS;
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
    const delta = now - this.lastVisualizationTime;
    
    if (delta >= this.frameInterval) {
      // Adjust for frame timing drift
      this.lastVisualizationTime = now - (delta % this.frameInterval);
      return true;
    }
    return false;
  }
}