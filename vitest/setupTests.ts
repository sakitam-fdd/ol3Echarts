import { afterEach } from 'vitest';

function createMockContext(canvas: HTMLCanvasElement) {
  const ctx: Record<string, unknown> = {
    canvas,
    fillStyle: '#000',
    strokeStyle: '#000',
    lineWidth: 1,
    globalAlpha: 1,
    font: '10px sans-serif',
    textAlign: 'start',
    textBaseline: 'alphabetic',
    dpr: 1,
    fillRect: () => undefined,
    clearRect: () => undefined,
    strokeRect: () => undefined,
    getImageData: () => ({ data: new Uint8ClampedArray(4), width: 1, height: 1 }),
    putImageData: () => undefined,
    createImageData: (w = 1, h = 1) => ({ data: new Uint8ClampedArray(w * h * 4), width: w, height: h }),
    setTransform: () => undefined,
    resetTransform: () => undefined,
    drawImage: () => undefined,
    save: () => undefined,
    restore: () => undefined,
    beginPath: () => undefined,
    moveTo: () => undefined,
    lineTo: () => undefined,
    closePath: () => undefined,
    stroke: () => undefined,
    fill: () => undefined,
    translate: () => undefined,
    scale: () => undefined,
    rotate: () => undefined,
    arc: () => undefined,
    arcTo: () => undefined,
    bezierCurveTo: () => undefined,
    quadraticCurveTo: () => undefined,
    rect: () => undefined,
    clip: () => undefined,
    fillText: () => undefined,
    strokeText: () => undefined,
    measureText: () => ({ width: 0 }),
    transform: () => undefined,
    createLinearGradient: () => ({ addColorStop: () => undefined }),
    createRadialGradient: () => ({ addColorStop: () => undefined }),
    createPattern: () => null,
    isPointInPath: () => false,
  };
  return new Proxy(ctx, {
    get(target, key) {
      if (key in target) return target[key as string];
      return () => undefined;
    },
  });
}

// Setup files run before test modules are imported. This must execute eagerly:
// OpenLayers 4 probes canvas support at module evaluation time.
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {
      // noop
    }
    unobserve() {
      // noop
    }
    disconnect() {
      // noop
    }
  } as unknown as typeof ResizeObserver;
}

// jsdom canvas context is null; zrender/echarts need a writable 2d context.
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  configurable: true,
  value(type: string) {
    if (type === '2d') {
      return createMockContext(this as HTMLCanvasElement);
    }
    return null;
  },
});

Object.defineProperty(HTMLCanvasElement.prototype, 'width', {
  configurable: true,
  get() {
    return (this as any).__width ?? 300;
  },
  set(v: number) {
    (this as any).__width = v;
  },
});

Object.defineProperty(HTMLCanvasElement.prototype, 'height', {
  configurable: true,
  get() {
    return (this as any).__height ?? 150;
  },
  set(v: number) {
    (this as any).__height = v;
  },
});

for (const property of ['clientWidth', 'offsetWidth'] as const) {
  Object.defineProperty(HTMLElement.prototype, property, {
    configurable: true,
    get() {
      return Number.parseFloat((this as HTMLElement).style.width) || 0;
    },
  });
}

for (const property of ['clientHeight', 'offsetHeight'] as const) {
  Object.defineProperty(HTMLElement.prototype, property, {
    configurable: true,
    get() {
      return Number.parseFloat((this as HTMLElement).style.height) || 0;
    },
  });
}

afterEach(() => void 0);
