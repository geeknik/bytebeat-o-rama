import React, { useRef, useEffect } from 'react';

interface WaveformVisualizerProps {
  data: number;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<number[]>([]);
  const maxPointsRef = useRef(400); // Reduced from 800 for better performance

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Normalize data to be between 0 and 1
    const normalizedData = Math.max(0, Math.min(1, data));

    // Add new point with buffer management
    pointsRef.current.push(normalizedData);
    while (pointsRef.current.length > maxPointsRef.current) {
      pointsRef.current.shift();
    }

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid (reduced number of lines)
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 0.5;

    // Vertical grid lines (time divisions) - reduced frequency
    for (let i = 0; i < canvas.width; i += 100) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();

      // Add time markers
      ctx.fillStyle = '#666666';
      ctx.font = '10px monospace';
      ctx.fillText(`${i}ms`, i, canvas.height - 5);
    }

    // Horizontal grid lines (amplitude divisions) - reduced frequency
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();

      // Add amplitude markers (0-255)
      const amplitude = Math.round((1 - i / canvas.height) * 255);
      ctx.fillStyle = '#666666';
      ctx.font = '10px monospace';
      ctx.fillText(`${amplitude}`, 5, i + 10);
    }

    // Draw waveform
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#00f3ff');
    gradient.addColorStop(1, '#0066ff');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.beginPath();

    // Optimize point drawing
    const step = Math.max(1, Math.floor(pointsRef.current.length / canvas.width));
    pointsRef.current.forEach((point, index) => {
      if (index % step !== 0) return;
      
      const x = (index / step) * (canvas.width / (pointsRef.current.length / step));
      const y = canvas.height - (point * canvas.height);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    // Simplified glow effect
    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = 5;
    ctx.stroke();

    // Reset shadow for next frame
    ctx.shadowBlur = 0;

  }, [data]);

  return (
    <div className="space-y-2">
      <canvas
        ref={canvasRef}
        width={800}
        height={200}
        className="w-full h-[200px] border border-gray-700 rounded-lg bg-[#1a1a1a]"
      />
      <div className="flex justify-between text-xs text-gray-400 font-mono">
        <span>Amplitude: 0-255</span>
        <span>Time →</span>
      </div>
    </div>
  );
};

export default WaveformVisualizer;