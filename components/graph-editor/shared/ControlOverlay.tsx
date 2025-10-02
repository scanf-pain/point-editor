import React from 'react';
import { Point, PointType } from './types';

interface ControlOverlayProps {
  points: Point[];
  width: number;
  height: number;
  maxY: number;
  onPointUpdate: (pointId: string, newX: number, newY: number) => void;
  onMouseDown?: (pointId: string) => void;
}

export const ControlOverlay: React.FC<ControlOverlayProps> = ({
  points,
  width,
  height,
  maxY,
  onPointUpdate,
  onMouseDown
}) => {

  const screenToGraph = (screenX: number, screenY: number) => ({
    x: screenX / width,
    y: (height - screenY) / height
  });

  const graphToScreen = (x: number, y: number) => ({
    x: x * width,
    y: height - (y * height)
  });

  const getHandleStyle = (point: Point) => {
    const screen = graphToScreen(point.x, point.y);
    const baseStyle = {
      position: 'absolute' as const,
      transform: 'translate(-50%, -50%)',
      left: screen.x,
      top: screen.y,
      userSelect: 'none' as const,
      pointerEvents: 'auto' as const,
    };

    switch (point.type) {
      case PointType.CONTROL:
        return {
          ...baseStyle,
          width: 8,
          height: 8,
          backgroundColor: '#3b82f6',
          border: '2px solid white',
          borderRadius: '50%',
          cursor: 'move',
        };
      case PointType.BELL_CENTER:
        return {
          ...baseStyle,
          width: 12,
          height: 12,
          backgroundColor: '#ef4444',
          border: '2px solid white',
          borderRadius: '2px',
          cursor: 'move',
        };
      case PointType.RANGE_LEFT:
      case PointType.RANGE_RIGHT:
        return {
          ...baseStyle,
          width: 4,
          height: height,
          backgroundColor: '#f59e0b',
          cursor: 'ew-resize',
          top: height / 2,
        };
      case PointType.BELL_CURVE:
        return {
          ...baseStyle,
          width: 10,
          height: 10,
          backgroundColor: '#10b981',
          border: '2px solid white',
          borderRadius: '50%',
          cursor: 'move',
        };
      default:
        return baseStyle;
    }
  };

  const handleMouseDown = (point: Point, event: React.MouseEvent) => {
    event.preventDefault();
    onMouseDown?.(point.id);

    const startX = event.clientX;
    const startY = event.clientY;
    const startGraphPos = screenToGraph(point.x * width, (1 - point.y) * height);

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      const newScreenX = point.x * width + deltaX;
      const newScreenY = (1 - point.y) * height + deltaY;
      
      const newGraphPos = screenToGraph(newScreenX, newScreenY);
      
      let constrainedX = newGraphPos.x;
      let constrainedY = newGraphPos.y;
      
      if (point.properties?.constrainX) {
        const [minX, maxX] = point.properties.constrainX;
        constrainedX = Math.max(minX, Math.min(maxX, constrainedX));
      }
      
      if (point.properties?.constrainY) {
        const [minY, maxY] = point.properties.constrainY;
        constrainedY = Math.max(minY, Math.min(maxY, constrainedY));
      }
      
      onPointUpdate(point.id, constrainedX, constrainedY);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{ width, height }}
    >
      {points.map(point => (
        <div
          key={point.id}
          style={getHandleStyle(point)}
          onMouseDown={(e) => handleMouseDown(point, e)}
        />
      ))}
    </div>
  );
};