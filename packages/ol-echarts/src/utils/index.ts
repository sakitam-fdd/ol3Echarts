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
  Object.keys(b).forEach(key => {
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
  let index;
  const length = array.length;
  for (; i < length; i++) {
    if (array[i].seriesIndex === item.seriesIndex) {
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
    // eslint-disable-next-line no-mixed-operators,no-bitwise
    return a ? (a ^ Math.random() * 16 >> a / 4).toString(16)
      // @ts-ignore
      : ([1e7] + -[1e3] + -4e3 + -8e3 + -1e11).replace(/[018]/g, rd);
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
    if (!context[fn]) { return; }
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
  const e = new MouseEvent(type, {
    // set bubbles, so zrender can receive the mock event. ref: https://dom.spec.whatwg.org/#interface-event 
    // "event.bubbles": Returns true or false depending on how event was initialized. True if event goes through its target’s ancestors in reverse tree order, and false otherwise
    bubbles: true,
    cancelable: true,
    button: event.pointerEvent.button,
    buttons: event.pointerEvent.buttons,
    clientX: event.pointerEvent.clientX,
    clientY: event.pointerEvent.clientY,
    // @ts-ignore
    zrX: event.pointerEvent.offsetX,
    zrY: event.pointerEvent.offsetY,
    movementX: event.pointerEvent.movementX,
    movementY: event.pointerEvent.movementY,
    relatedTarget: event.pointerEvent.relatedTarget,
    screenX: event.pointerEvent.screenX,
    screenY: event.pointerEvent.screenY,
    view: window,
  });
  e.zrX = event.pointerEvent.offsetX;
  e.zrY = event.pointerEvent.offsetY;
  e.event = e;
  return e;
}

export {
  merge,
  isObject,
  bind,
  arrayAdd,
  uuid,
  bindAll,
  removeNode,
  mockEvent,
};
