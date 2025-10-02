import React from 'react';
import { CanvasRenderer } from '../shared/CanvasRenderer';
import { ControlOverlay } from '../shared/ControlOverlay';
import { useBellPoints } from './hooks/useBellPoints';

interface BellModeProps {
  maxY: number;
  width?: number;
  height?: number;
  onPointsChange?: (points: any[]) => void;
}

export const BellMode: React.FC<BellModeProps> = ({
  maxY,
  width = 400,
  height = 300,
  onPointsChange
}) => {
  const {
    points,
    bellParams,
    updateBellParam,
    updateFromPoint
  } = useBellPoints();

  React.useEffect(() => {
    onPointsChange?.(points);
  }, [points, onPointsChange]);

  return (
    <div className="space-y-4">
      <div className="relative" style={{ width, height }}>
        <CanvasRenderer
          points={points}
          width={width}
          height={height}
          maxY={maxY}
          showGrid={true}
        />
        <ControlOverlay
          points={points}
          width={width}
          height={height}
          maxY={maxY}
          onPointUpdate={updateFromPoint}
          onMouseDown={(pointId) => {
            console.log('Selected handle:', pointId);
          }}
        />
      </div>


      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Center X:</span>
            <span>{bellParams.centerX.toFixed(3)}</span>
          </div>
          <div className="flex justify-between">
            <span>Center Y:</span>
            <span>{bellParams.centerY.toFixed(3)}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Range:</span>
            <span>{(bellParams.rightRangeX - bellParams.leftRangeX).toFixed(3)}</span>
          </div>
          <div className="flex justify-between">
            <span>Curvature:</span>
            <span>{bellParams.curvature.toFixed(3)}</span>
          </div>
        </div>
      </div>


      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="w-20 text-sm">Curvature:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={bellParams.curvature}
            onChange={(e) => updateBellParam('curvature', parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="w-12 text-sm">{bellParams.curvature.toFixed(2)}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="w-20 text-sm">Height:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={bellParams.centerY}
            onChange={(e) => updateBellParam('centerY', parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="w-12 text-sm">{bellParams.centerY.toFixed(2)}</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-600">
        <p>• <span className="inline-block w-3 h-3 bg-red-500 mr-1"></span>Red square: Move center position and height</p>
        <p>• <span className="inline-block w-3 h-3 bg-yellow-500 mr-1"></span>Yellow bars: Adjust left/right range</p>
        <p>• <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>Green circle: Control curvature (0=rectangular, 1=smooth)</p>
      </div>
    </div>
  );
};