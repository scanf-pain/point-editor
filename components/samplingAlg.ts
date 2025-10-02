import { Point } from './type';
import { evaluateFunction } from './interpolation';

// Linear Deviation Based Sampling (Improved)
export const generateSamplesLinearDeviation = (
    points: Point[], 
    sensitivity: number = 1.0
): number[] => {
    const samples: number[] = [];
    
    // Always include all control points
    const controlPointsX = points.map(p => p.x).sort((a, b) => a - b);
    samples.push(...controlPointsX);
    
    // Add adaptive samples between control points
    for (let i = 0; i < controlPointsX.length - 1; i++) {
        const startX = controlPointsX[i];
        const endX = controlPointsX[i + 1];
        const segmentSamples = sampleSegmentLinearDeviation(startX, endX, points, sensitivity);
        samples.push(...segmentSamples);
    }
    
    // Remove duplicates and sort
    return [...new Set(samples)].sort((a, b) => a - b);
};

const sampleSegmentLinearDeviation = (
    startX: number, 
    endX: number, 
    points: Point[], 
    sensitivity: number
): number[] => {
    const samples: number[] = [];
    const segmentLength = endX - startX;
    const minSegment = 0.005;
    
    if (segmentLength < minSegment) return samples;
    
    // Get actual function values at endpoints
    const startY = evaluateFunction(startX, points);
    const endY = evaluateFunction(endX, points);
    
    // Check multiple test points within the segment
    const testPoints = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]; // More test points for better accuracy
    let maxDeviation = 0;
    let worstX = (startX + endX) / 2;
    
    for (const t of testPoints) {
        const testX = startX + t * (endX - startX);
        const actualY = evaluateFunction(testX, points);
        
        // Calculate what linear interpolation would give at this point
        const linearY = startY + t * (endY - startY);
        
        // Calculate deviation from linear interpolation
        const deviation = Math.abs(actualY - linearY);
        
        if (deviation > maxDeviation) {
            maxDeviation = deviation;
            worstX = testX;
        }
    }
    
    // Threshold based on sensitivity
    const threshold = 2.0 / sensitivity;
    
    if (maxDeviation > threshold) {
        samples.push(worstX);
        samples.push(...sampleSegmentLinearDeviation(startX, worstX, points, sensitivity));
        samples.push(...sampleSegmentLinearDeviation(worstX, endX, points, sensitivity));
    }
    
    return samples;
};