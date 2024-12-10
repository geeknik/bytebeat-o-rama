import React, { useRef, useEffect } from 'react';

interface WaveformVisualizerProps {
  data: number;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Add new point
    pointsRef.current.push(data);
    if (pointsRef.current.length > canvas.width) {
      pointsRef.current.shift();
    }

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw waveform
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    pointsRef.current.forEach((point, index) => {
      const x = index;
      const y = canvas.height - (point * canvas.height);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={200}
      className="w-full h-[200px] border border-gray-700 rounded-lg bg-[#1a1a1a]"
    />
  );
};

export default WaveformVisualizer;