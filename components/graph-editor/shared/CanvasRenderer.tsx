import React, { useRef, useEffect } from 'react';
import { Point } from './types';
import { GraphEvaluator } from './utils/evaluation';

interface CanvasRendererProps {
  points: Point[];
  width?: number;
  height?: number;
  maxY?: number;
  showGrid?: boolean;
  className?: string;
}

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({
  points,
  width = 400,
  height = 300,
  maxY = 100,
  showGrid = true,
  className = "border border-gray-400"
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid if enabled
    if (showGrid) {
      drawGrid(ctx, width, height);
    }

    // Draw the graph curve
    if (points.length > 0) {
      drawCurve(ctx, points, width, height, maxY);
    }
  }, [points, width, height, maxY, showGrid]);

  const drawGrid = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.strokeStyle = '#eeeeee';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * w;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    for (let i = 0; i <= 10; i++) {
      const y = (i / 10) * h;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  };

  const drawCurve = (ctx: CanvasRenderingContext2D, points: Point[], w: number, h: number, maxY: number) => {
    const evaluator = new GraphEvaluator(points);
    const samples = evaluator.generateSamples(w);

    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();

    let isFirstPoint = true;
    for (const sample of samples) {
      const screenX = sample.x * w;
      const screenY = h - (sample.y / maxY) * h;

      if (isFirstPoint) {
        ctx.moveTo(screenX, screenY);
        isFirstPoint = false;
      } else {
        ctx.lineTo(screenX, screenY);
      }
    }

    ctx.stroke();
    
    if (points.some(p => p.type === 'bell_center')) {
      ctx.fillStyle = 'rgba(55, 65, 81, 0.1)';
      ctx.lineTo(samples[samples.length - 1].x * w, h);
      ctx.lineTo(samples[0].x * w, h);
      ctx.closePath();
      ctx.fill();
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
    />
  );
};