// filepath: /home/matjuman/Projects/graph-test/components/type.ts
export interface Point {
    id: string;
    x: number;
    y: number;
    type: 'linear' | 'curve' | 'normal';
    normalSpread?: number;
}

export interface BellHandleState {
    centralPoint: { x: number; y: number };
    leftRange: number;
    rightRange: number;
    curvature: number;
}

export interface HandleInteraction {
    handleType: 'central' | 'left' | 'right' | 'curvature';
    position: { x: number; y: number };
}

export interface CanvasDimensions {
    width: number;
    height: number;
}