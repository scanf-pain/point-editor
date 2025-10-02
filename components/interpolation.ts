import { Point } from './type';

// Interpolation methods

export const linearInterpolation = (t: number, y1: number, y2: number): number => {
    return y1 + t * (y2 - y1);
};

export const smoothStepInterpolation = (t: number, y1: number, y2: number): number => {
    const smoothT = t * t * (3 - 2 * t);
    return y1 + smoothT * (y2 - y1);
};

export const smootherStepInterpolation = (t: number, y1: number, y2: number): number => {
    const smootherT = t * t * t * (t * (t * 6 - 15) + 10);
    return y1 + smootherT * (y2 - y1);
};


export const cosineInterpolation = (t: number, y1: number, y2: number): number => {
    const cosT = (1 - Math.cos(t * Math.PI)) * 0.5;
    return y1 + cosT * (y2 - y1);
};

export const expEaseInInterpolation = (t: number, y1: number, y2: number): number => {
    const expT = t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
    return y1 + expT * (y2 - y1);
};

export const expEaseOutInterpolation = (t: number, y1: number, y2: number): number => {
    const expT = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    return y1 + expT * (y2 - y1);
};

export const elasticInterpolation = (t: number, y1: number, y2: number): number => {
    if (t === 0) return y1;
    if (t === 1) return y2;
    
    const p = 0.3;
    const s = p / 4;
    const elasticT = Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1;
    return y1 + elasticT * (y2 - y1);
};

export const bounceInterpolation = (t: number, y1: number, y2: number): number => {
    let bounceT;
    if (t < 1 / 2.75) {
        bounceT = 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
        bounceT = 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
        bounceT = 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
        bounceT = 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
    return y1 + bounceT * (y2 - y1);
};



// ========== INTERPOLATION TYPE MAP ==========

export type InterpolationType = 
    | 'linear' 
    | 'smoothstep' 
    | 'smootherstep'
    | 'cosine'
    | 'expEaseIn'
    | 'expEaseOut'
    | 'elastic'
    | 'bounce'

export const interpolationMethods: Record<InterpolationType, (t: number, y1: number, y2: number) => number> = {
    linear: linearInterpolation,
    smoothstep: smoothStepInterpolation,
    smootherstep: smootherStepInterpolation,
    cosine: cosineInterpolation,
    expEaseIn: expEaseInInterpolation,
    expEaseOut: expEaseOutInterpolation,
    elastic: elasticInterpolation,
    bounce: bounceInterpolation,
};

// ========== MAIN EVALUATION FUNCTION ==========

// Updated evaluate function with configurable interpolation methods
export const evaluateFunction = (x: number, points: Point[]): number => {
    const sortedPoints = [...points].sort((a, b) => a.x - b.x);
    
    if (sortedPoints.length === 0) return 0;
    if (x <= sortedPoints[0].x) return sortedPoints[0].y;
    if (x >= sortedPoints[sortedPoints.length - 1].x) return sortedPoints[sortedPoints.length - 1].y;

    // Find the segment
    for (let i = 0; i < sortedPoints.length - 1; i++) {
        const p1 = sortedPoints[i];
        const p2 = sortedPoints[i + 1];
        
        if (x >= p1.x && x <= p2.x) {
            const t = (x - p1.x) / (p2.x - p1.x);
            
            const interpolationType = determineInterpolationType(p1.type, p2.type);
            const interpolationFunc = interpolationMethods[interpolationType];
            
            return interpolationFunc(t, p1.y, p2.y);
        }
    }
    
    return 0;
};

const determineInterpolationType = (type1: string, type2: string): InterpolationType => {
    if (type1 === 'curve' || type2 === 'curve') {
        return 'smoothstep';
    }
    
    if (type1 === 'linear' && type2 === 'linear') {
        return 'linear';
    }
    
    if ((type1 === 'linear' && type2 === 'curve') || (type1 === 'curve' && type2 === 'linear')) {
        return 'smoothstep';
    }
    
    return 'linear';
};
