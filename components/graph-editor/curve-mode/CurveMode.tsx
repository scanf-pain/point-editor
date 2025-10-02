import React from 'react';
import { CanvasRenderer } from '../shared/CanvasRenderer';
import { ControlOverlay } from '../shared/ControlOverlay';
import { InterpolationType } from '../shared/types';
import { useCurvePoints } from './hooks/useCurvePoints';

interface CurveModeProps {
  maxY: number;
  width?: number;
  height?: number;
  onPointsChange?: (points: any[]) => void;
}

export const CurveMode: React.FC<CurveModeProps> = ({
  maxY,
  width = 400,
  height = 300,
  onPointsChange
}) => {
  const {
    points,
    updatePoint,
    addPoint,
    removePoint,
    updateInterpolation,
    resetPoints
  } = useCurvePoints();

  React.useEffect(() => {
    onPointsChange?.(points);
  }, [points, onPointsChange]);

  const handleCanvasDoubleClick = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / width;
    const y = 1 - (event.clientY - rect.top) / height;
    addPoint(x, y);
  };

  const handlePointRightClick = (pointId: string, event: React.MouseEvent) => {
    event.preventDefault();
    if (points.length > 1) {
      removePoint(pointId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Graph Area */}
      <div className="relative" style={{ width, height }}>
        <div onDoubleClick={handleCanvasDoubleClick}>
          <CanvasRenderer
            points={points}
            width={width}
            height={height}
            maxY={maxY}
            showGrid={true}
          />
        </div>
        <ControlOverlay
          points={points}
          width={width}
          height={height}
          maxY={maxY}
          onPointUpdate={updatePoint}
          onMouseDown={(pointId) => {
            console.log('Selected point:', pointId);
          }}
        />
        
        {points.map(point => (
          <div
            key={`context-${point.id}`}
            className="absolute pointer-events-auto"
            style={{
              left: point.x * width - 8,
              top: (1 - point.y) * height - 8,
              width: 16,
              height: 16,
            }}
            onContextMenu={(e) => handlePointRightClick(point.id, e)}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={resetPoints}
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset Points
        </button>
        
        <select
          onChange={(e) => {

            const newInterpolation = e.target.value as InterpolationType;
            points.forEach(point => {
              updateInterpolation(point.id, newInterpolation);
            });
          }}
          className="px-2 py-1 border rounded"
        >
          <option value={InterpolationType.LINEAR}>Linear</option>
          <option value={InterpolationType.CUBIC_SPLINE}>Cubic Spline</option>
          <option value={InterpolationType.BEZIER}>Bezier</option>
          <option value={InterpolationType.STEP}>Step</option>
        </select>
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-600">
        <p>• Double-click to add points</p>
        <p>• Drag points to move them</p>
        <p>• Right-click to remove points</p>
      </div>
    </div>
  );
};