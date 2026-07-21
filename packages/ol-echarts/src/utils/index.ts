/**
 * 判断是否为对象
 * @param value
 * @returns {boolean}
 */
const isObject = (value: any): boolean => {
  const type = typeof value;
  return value !== null && (type === 'object' || type === 'function');
};

/**
 * merge
 * @param a
 * @param b
 * @returns {*}
 */
const merge = (a: any, b: any): any => {
  Object.keys(b).forEach((key) => {
    if (isObject(b[key]) && isObject(a[key])) {
      merge(a[key], b[key]);
    } else {
      a[key] = b[key];
    }
  });
  return a;
};

/**
 * bind context
 * @param func
 * @param context
 * @param args
 */
const bind = function (func: Function, context: any, ...args: any[]): Function {
  return function (...innerArgs: any[]) {
    return func.apply(context, args.concat(Array.prototype.slice.call(innerArgs)));
  };
};

/**
 * add own item
 * @param array
 * @param item
 */
const arrayAdd = function (array: any[], item: any): any[] {
  let i = 0;
  let index: number | undefined;
  const length = array.length;
  for (; i < length; i++) {
    if (array[i].index === item.index) {
      index = i;
      break;
    }
  }
  if (index === undefined) {
    array.push(item);
  } else {
    array[index] = item;
  }
  return array;
};

const uuid = function (): string {
  function rd(a?: number | undefined) {
    return a
      ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
      : // @ts-ignore ignore
        ([1e7] + -[1e3] + -4e3 + -8e3 + -1e11).replace(/[018]/g, rd);
  }
  return rd();
};

/**
 * bind function array
 * @param fns
 * @param context
 */
function bindAll(fns: string[] | number[], context: any) {
  fns.forEach((fn: string | number) => {
    if (!context[fn]) {
      return;
    }
    context[fn] = context[fn].bind(context);
  });
}

/**
 * remove node
 * @param node
 */
function removeNode(node: HTMLElement) {
  return node && node.parentNode ? node.parentNode.removeChild(node) : null;
}

/**
 * mock zrender mouse event
 * @param type
 * @param event
 */
function mockEvent(type: string, event: any) {
  const pointerEvent = event.pointerEvent || event.originalEvent || event;
  const pixel = event.pixel || [pointerEvent.offsetX, pointerEvent.offsetY];
  const e = new MouseEvent(type, {
    // set bubbles, so zrender can receive the mock event. ref: https://dom.spec.whatwg.org/#interface-event
    // "event.bubbles": Returns true or false depending on how event was initialized.
    // True if event goes through its target’s ancestors in reverse tree order, and false otherwise
    bubbles: true,
    cancelable: true,
    button: pointerEvent.button,
    buttons: pointerEvent.buttons,
    clientX: pointerEvent.clientX,
    clientY: pointerEvent.clientY,
    movementX: pointerEvent.movementX,
    movementY: pointerEvent.movementY,
    relatedTarget: pointerEvent.relatedTarget,
    screenX: pointerEvent.screenX,
    screenY: pointerEvent.screenY,
    view: window,
  }) as MouseEvent & { zrX: number; zrY: number; event: MouseEvent };
  e.zrX = Number(pixel[0]) || 0;
  e.zrY = Number(pixel[1]) || 0;
  e.event = e;
  return e;
}

export function semver(a: string, b: string) {
  const pa = a.split('.');
  const pb = b.split('.');
  for (let i = 0; i < 3; i++) {
    const na = Number(pa[i]);
    const nb = Number(pb[i]);
    if (na > nb) return 1;
    if (nb > na) return -1;
    if (!isNaN(na) && isNaN(nb)) return 1;
    if (isNaN(na) && !isNaN(nb)) return -1;
  }
  return 0;
}

/**
 * Clone option data without dropping callback functions.
 *
 * ECharts options commonly contain formatter/renderItem callbacks, so JSON and
 * structuredClone are not suitable. Plain objects, arrays, Map/Set and binary
 * data are copied; other class instances are intentionally kept by reference.
 */
function clone<T>(value: T, seen: WeakMap<object, unknown> = new WeakMap()): T {
  if ((typeof value !== 'object' && typeof value !== 'function') || value === null) {
    return value;
  }
  if (typeof value === 'function') {
    return value;
  }

  const source = value as object;
  const cached = seen.get(source);
  if (cached) return cached as T;

  if (value instanceof Date) return new Date(value.getTime()) as T;
  if (value instanceof RegExp) return new RegExp(value.source, value.flags) as T;
  if (value instanceof ArrayBuffer) return value.slice(0) as T;
  if (ArrayBuffer.isView(value)) {
    if (value instanceof DataView) {
      return new DataView(value.buffer.slice(0), value.byteOffset, value.byteLength) as T;
    }
    return (value as unknown as { slice: () => T }).slice();
  }
  if (value instanceof Map) {
    const result = new Map();
    seen.set(source, result);
    value.forEach((item, key) => result.set(clone(key, seen), clone(item, seen)));
    return result as T;
  }
  if (value instanceof Set) {
    const result = new Set();
    seen.set(source, result);
    value.forEach((item) => result.add(clone(item, seen)));
    return result as T;
  }
  if (Array.isArray(value)) {
    const result: unknown[] = [];
    seen.set(source, result);
    value.forEach((item) => result.push(clone(item, seen)));
    return result as T;
  }

  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    return value;
  }

  const result = Object.create(prototype) as Record<PropertyKey, unknown>;
  seen.set(source, result);
  Reflect.ownKeys(value as object).forEach((key) => {
    const descriptor = Object.getOwnPropertyDescriptor(value as object, key);
    if (!descriptor) return;
    if ('value' in descriptor) descriptor.value = clone(descriptor.value, seen);
    Object.defineProperty(result, key, descriptor);
  });
  return result as T;
}

export { merge, isObject, bind, arrayAdd, uuid, bindAll, removeNode, mockEvent, clone };
