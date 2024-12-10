import React, { useRef, useEffect } from 'react';

interface WaveformVisualizerProps {
  data: number;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<number[]>([]);
  const maxPointsRef = useRef(800); // Match canvas width

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Normalize data to be between 0 and 1
    const normalizedData = Math.max(0, Math.min(1, data));

    // Add new point
    pointsRef.current.push(normalizedData);
    if (pointsRef.current.length > maxPointsRef.current) {
      pointsRef.current.shift();
    }

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 0.5;

    // Vertical grid lines (time divisions)
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();

      // Add time markers
      ctx.fillStyle = '#666666';
      ctx.font = '10px monospace';
      ctx.fillText(`${i}ms`, i, canvas.height - 5);
    }

    // Horizontal grid lines (amplitude divisions)
    for (let i = 0; i < canvas.height; i += 40) {
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

    // Draw waveform with gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#00f3ff');
    gradient.addColorStop(1, '#0066ff');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.beginPath();

    // Draw points with smoother interpolation
    pointsRef.current.forEach((point, index) => {
      const x = index;
      const y = canvas.height - (point * canvas.height);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        // Use quadratic curves for smoother lines
        const prevX = index - 1;
        const prevY = canvas.height - (pointsRef.current[index - 1] * canvas.height);
        const cpX = (x + prevX) / 2;
        ctx.quadraticCurveTo(cpX, prevY, x, y);
      }
    });

    // Add glow effect
    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = 10;
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