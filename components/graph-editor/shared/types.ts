export interface Point {
  id: string;
  x: number;
  y: number;
  type: PointType;
  interpolation: InterpolationType;
  properties?: PointProperties;
}

export enum PointType {
  CONTROL = 'control',
  RANGE_LEFT = 'range_left',
  RANGE_RIGHT = 'range_right',
  BELL_CENTER = 'bell_center',
  BELL_CURVE = 'bell_curve', 
}

export enum InterpolationType {
  LINEAR = 'linear',
  CUBIC_SPLINE = 'cubic_spline',
  BEZIER = 'bezier',
  BELL_SMOOTH = 'bell_smooth',
  STEP = 'step',
}

export interface PointProperties {
  // For bell curve points
  curvature?: number;
  rangeLeft?: number;
  rangeRight?: number;
  centerX?: number;
  
  // For control constraints
  constrainX?: [number, number];
  constrainY?: [number, number];
}

export interface GraphWindowProps {
  maxY: number;
  initialPoints?: Point[];
  mode: 'curve' | 'bell';
  onPointsChange?: (points: Point[]) => void;
}

export interface HandleInfo {
  id: string;
  type: PointType;
  position: { x: number; y: number };
  cursor: string;
  color: string;
}