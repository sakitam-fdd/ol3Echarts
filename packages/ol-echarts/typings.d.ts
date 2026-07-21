declare module '*.json';

type WithNull<T> = T | null;
type WithUndef<T> = T | undefined;

declare module 'zrender/lib/core/Transformable' {
  export default class Transformable {
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    transform: number[] | undefined;
    getLocalTransform(): number[];
    decomposeTransform(): void;
  }
}

declare module 'zrender/lib/core/BoundingRect' {
  export default class BoundingRect {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x: number, y: number, width: number, height: number);
    clone(): BoundingRect;
  }
}
