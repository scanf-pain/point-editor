import { useState, useMemo, useCallback } from 'react';
import { Point, PointType, InterpolationType } from '../../shared/types';

interface BellParameters {
  centerX: number;
  centerY: number;
  leftRangeX: number;
  rightRangeX: number;
  curvature: number; // 0 = rectangular, 1 = smooth
}

export const useBellPoints = (initialParams?: Partial<BellParameters>) => {
  const [bellParams, setBellParams] = useState<BellParameters>({
    centerX: initialParams?.centerX ?? 0.5,
    centerY: initialParams?.centerY ?? 0.5,
    leftRangeX: initialParams?.leftRangeX ?? 0.25,
    rightRangeX: initialParams?.rightRangeX ?? 0.75,
    curvature: initialParams?.curvature ?? 0.5,
  });

  const points = useMemo((): Point[] => {
    const { centerX, centerY, leftRangeX, rightRangeX, curvature } = bellParams;

    return [
      // Left range handle
      {
        id: 'bell_left_range',
        x: leftRangeX,
        y: 0,
        type: PointType.RANGE_LEFT,
        interpolation: InterpolationType.STEP,
        properties: {
          constrainX: [0, Math.min(centerX - 0.01, rightRangeX - 0.02)],
          constrainY: [0, 0], // Fixed at bottom
        }
      },
      // Right range handle
      {
        id: 'bell_right_range',
        x: rightRangeX,
        y: 0,
        type: PointType.RANGE_RIGHT,
        interpolation: InterpolationType.STEP,
        properties: {
          constrainX: [Math.max(centerX + 0.01, leftRangeX + 0.02), 1],
          constrainY: [0, 0], // Fixed at bottom
        }
      },
      // Center handle
      {
        id: 'bell_center',
        x: centerX,
        y: centerY,
        type: PointType.BELL_CENTER,
        interpolation: curvature === 0 ? InterpolationType.STEP : InterpolationType.BELL_SMOOTH,
        properties: {
          constrainX: [leftRangeX + 0.01, rightRangeX - 0.01],
          constrainY: [0, 1],
          curvature,
          rangeLeft: leftRangeX,
          rangeRight: rightRangeX,
        }
      },
      // Curvature handle (positioned above center)
      {
        id: 'bell_curvature',
        x: centerX,
        y: Math.min(centerY + 0.1, 1), // Slightly above center
        type: PointType.BELL_CURVE,
        interpolation: InterpolationType.LINEAR,
        properties: {
          constrainX: [leftRangeX, rightRangeX],
          constrainY: [0, 1],
          curvature,
          centerX,
        }
      }
    ];
  }, [bellParams]);

  const updateBellParam = useCallback((param: keyof BellParameters, value: number) => {
    setBellParams(prev => {
      const newParams = { ...prev, [param]: value };
      
      // Enforce constraints
      if (param === 'leftRangeX') {
        newParams.leftRangeX = Math.max(0, Math.min(value, newParams.rightRangeX - 0.02));
        // Update center if it's outside new range
        if (newParams.centerX < newParams.leftRangeX + 0.01) {
          newParams.centerX = newParams.leftRangeX + 0.01;
        }
      } else if (param === 'rightRangeX') {
        newParams.rightRangeX = Math.min(1, Math.max(value, newParams.leftRangeX + 0.02));

        if (newParams.centerX > newParams.rightRangeX - 0.01) {
          newParams.centerX = newParams.rightRangeX - 0.01;
        }
      } else if (param === 'centerX') {
        newParams.centerX = Math.max(
          newParams.leftRangeX + 0.01, 
          Math.min(value, newParams.rightRangeX - 0.01)
        );

      } else if (param === 'curvature') {
        newParams.curvature = Math.max(0, Math.min(1, value));
      }
      
      return newParams;
    });
  }, []);


  const updateFromPoint = useCallback((pointId: string, newX: number, newY: number) => {
    switch (pointId) {
      case 'bell_left_range':
        updateBellParam('leftRangeX', newX);
        break;
      case 'bell_right_range':
        updateBellParam('rightRangeX', newX);
        break;
      case 'bell_center':
        updateBellParam('centerX', newX);
        updateBellParam('centerY', newY);
        break;
      case 'bell_curvature':

        const curvatureValue = 1 - newY;
        updateBellParam('curvature', curvatureValue);

        if (newX !== bellParams.centerX) {
          updateBellParam('centerX', newX);
        }
        break;
    }
  }, [updateBellParam, bellParams.centerX]);

  return {
    points,
    bellParams,
    updateBellParam,
    updateFromPoint,
  };
};