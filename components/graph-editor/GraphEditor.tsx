import React, { useState } from 'react';
import { CurveMode } from './curve-mode/CurveMode';
import { BellMode } from './bell-mode/BellMode';

interface GraphEditorProps {
  maxY?: number;
  initialMode?: 'curve' | 'bell';
  width?: number;
  height?: number;
  onDataChange?: (data: any, mode: 'curve' | 'bell') => void;
}

export const GraphEditor: React.FC<GraphEditorProps> = ({
  maxY = 100,
  initialMode = 'curve',
  width = 400,
  height = 300,
  onDataChange
}) => {
  const [mode, setMode] = useState<'curve' | 'bell'>(initialMode);
  const [currentData, setCurrentData] = useState<any>(null);

  const handlePointsChange = (points: any[]) => {
    setCurrentData(points);
    onDataChange?.(points, mode);
  };

  return (
    <div className="border border-gray-300 p-4 space-y-4">

      <div className="flex gap-2">
        <button
          onClick={() => setMode('curve')}
          className={`px-4 py-2 rounded ${
            mode === 'curve' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Curve Editor
        </button>
        <button
          onClick={() => setMode('bell')}
          className={`px-4 py-2 rounded ${
            mode === 'bell' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Bell Filter
        </button>
      </div>

      <div className="border border-gray-200 p-4 rounded">
        {mode === 'curve' ? (
          <CurveMode
            maxY={maxY}
            width={width}
            height={height}
            onPointsChange={handlePointsChange}
          />
        ) : (
          <BellMode
            maxY={maxY}
            width={width}
            height={height}
            onPointsChange={handlePointsChange}
          />
        )}
      </div>

      <div className="text-xs text-gray-500">
        <details>
          <summary>Current Data ({mode} mode)</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-32">
            {JSON.stringify(currentData, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
};