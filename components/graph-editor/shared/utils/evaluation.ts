import { Point, PointType, InterpolationType } from '../types';

export class GraphEvaluator {
  private points: Point[];

  constructor(points: Point[]) {
    this.points = [...points].sort((a, b) => a.x - b.x);
  }

  evaluate(x: number): number {
    if (this.points.length === 0) return 0;
    
    if (this.hasBellPoints()) {
      return this.evaluateBellMode(x);
    }
    
    return this.evaluateCurveMode(x);
  }

  private hasBellPoints(): boolean {
    return this.points.some(p => 
      p.type === PointType.BELL_CENTER || 
      p.type === PointType.RANGE_LEFT || 
      p.type === PointType.RANGE_RIGHT
    );
  }

  private evaluateBellMode(x: number): number {
    const leftRange = this.points.find(p => p.type === PointType.RANGE_LEFT);
    const rightRange = this.points.find(p => p.type === PointType.RANGE_RIGHT);
    const center = this.points.find(p => p.type === PointType.BELL_CENTER);
    const curvePoint = this.points.find(p => p.type === PointType.BELL_CURVE);

    if (!leftRange || !rightRange || !center) return 0;

    if (x < leftRange.x || x > rightRange.x) return 0;

    const curvature = curvePoint?.properties?.curvature ?? 0.5;
    const centerY = center.y;

    if (curvature === 0) {
      return centerY;
    } else {

      const normalizedX = (x - center.x) / ((rightRange.x - leftRange.x) / 2);
      const bellValue = Math.exp(-Math.pow(normalizedX / curvature, 2));
      return centerY * bellValue;
    }
  }

  private evaluateCurveMode(x: number): number {
    const controlPoints = this.points.filter(p => p.type === PointType.CONTROL);
    
    if (controlPoints.length === 0) return 0;
    if (controlPoints.length === 1) return controlPoints[0].y;

    for (let i = 0; i < controlPoints.length - 1; i++) {
      const p1 = controlPoints[i];
      const p2 = controlPoints[i + 1];
      
      if (x >= p1.x && x <= p2.x) {
        return this.interpolateBetween(p1, p2, x);
      }
    }

    if (x < controlPoints[0].x) return controlPoints[0].y;
    return controlPoints[controlPoints.length - 1].y;
  }

  private interpolateBetween(p1: Point, p2: Point, x: number): number {
    const t = (x - p1.x) / (p2.x - p1.x);

    switch (p1.interpolation) {
      case InterpolationType.LINEAR:
        return p1.y + t * (p2.y - p1.y);
        
      case InterpolationType.CUBIC_SPLINE:

        return this.cubicSplineInterpolation(p1, p2, t);
        
      case InterpolationType.BEZIER:

        return this.bezierInterpolation(p1, p2, t);
        
      default:
        return p1.y + t * (p2.y - p1.y);
    }
  }

  private cubicSplineInterpolation(p1: Point, p2: Point, t: number): number {
    const t2 = t * t;
    const t3 = t2 * t;
    return p1.y * (2 * t3 - 3 * t2 + 1) + p2.y * (-2 * t3 + 3 * t2);
  }

  private bezierInterpolation(p1: Point, p2: Point, t: number): number {
    const invT = 1 - t;
    return invT * p1.y + t * p2.y;
  }

  generateSamples(sampleCount: number = 200): Point[] {
    const samples: Point[] = [];
    const minX = Math.min(...this.points.map(p => p.x));
    const maxX = Math.max(...this.points.map(p => p.x));
    
    for (let i = 0; i < sampleCount; i++) {
      const x = minX + (maxX - minX) * (i / (sampleCount - 1));
      const y = this.evaluate(x);
      samples.push({
        id: `sample_${i}`,
        x,
        y,
        type: PointType.CONTROL,
        interpolation: InterpolationType.LINEAR
      });
    }
    
    return samples;
  }
}