import { useState, useCallback } from 'react';
import { Point, PointType, InterpolationType } from '../../shared/types';

export const useCurvePoints = (initialPoints?: Point[]) => {
  const [points, setPoints] = useState<Point[]>(
    initialPoints || [
      {
        id: 'point_0',
        x: 0.2,
        y: 0.3,
        type: PointType.CONTROL,
        interpolation: InterpolationType.CUBIC_SPLINE,
      },
      {
        id: 'point_1',
        x: 0.5,
        y: 0.7,
        type: PointType.CONTROL,
        interpolation: InterpolationType.CUBIC_SPLINE,
      },
      {
        id: 'point_2',
        x: 0.8,
        y: 0.4,
        type: PointType.CONTROL,
        interpolation: InterpolationType.CUBIC_SPLINE,
      },
    ]
  );

  // Update existing point position
  const updatePoint = useCallback((pointId: string, newX: number, newY: number) => {
    setPoints(prev => prev.map(point => 
      point.id === pointId 
        ? { ...point, x: newX, y: newY }
        : point
    ));
  }, []);

  // Add new point at position
  const addPoint = useCallback((x: number, y: number) => {
    const newPoint: Point = {
      id: `point_${Date.now()}`,
      x: Math.max(0, Math.min(1, x)),
      y: Math.max(0, Math.min(1, y)),
      type: PointType.CONTROL,
      interpolation: InterpolationType.CUBIC_SPLINE,
    };
    
    setPoints(prev => [...prev, newPoint].sort((a, b) => a.x - b.x));
  }, []);

  // Remove point by ID
  const removePoint = useCallback((pointId: string) => {
    setPoints(prev => prev.filter(point => point.id !== pointId));
  }, []);

  // Change interpolation type for a point
  const updateInterpolation = useCallback((pointId: string, interpolation: InterpolationType) => {
    setPoints(prev => prev.map(point => 
      point.id === pointId 
        ? { ...point, interpolation }
        : point
    ));
  }, []);

  // Reset to default points
  const resetPoints = useCallback(() => {
    setPoints([
      {
        id: 'point_0',
        x: 0.2,
        y: 0.3,
        type: PointType.CONTROL,
        interpolation: InterpolationType.CUBIC_SPLINE,
      },
      {
        id: 'point_1',
        x: 0.5,
        y: 0.7,
        type: PointType.CONTROL,
        interpolation: InterpolationType.CUBIC_SPLINE,
      },
      {
        id: 'point_2',
        x: 0.8,
        y: 0.4,
        type: PointType.CONTROL,
        interpolation: InterpolationType.CUBIC_SPLINE,
      },
    ]);
  }, []);

  return {
    points,
    updatePoint,
    addPoint,
    removePoint,
    updateInterpolation,
    resetPoints,
  };
};