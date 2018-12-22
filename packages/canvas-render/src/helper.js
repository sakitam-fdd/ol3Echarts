/**
 * Created by FDD on 2017/11/28.
 * @desc helper
 */

/**
 * 判断是否为对象
 * @param value
 * @returns {boolean}
 */
const isObject = value => {
  const type = typeof value;
  return value !== null && (type === 'object' || type === 'function');
};

/**
 * merge
 * @param a
 * @param b
 * @returns {*}
 */
const merge = (a, b) => {
  for (const key in b) {
    if (isObject(b[key]) && isObject(a[key])) {
      merge(a[key], b[key]);
    } else {
      a[key] = b[key];
    }
  }
  return a
};

/**
 * get parent container
 * @param selector
 * @param doc
 */
const getTarget = (selector, doc = document) => {
  let dom = (function () {
    let found;
    return doc && /^#([\w-]+)$/.test(selector)
      ? (found = doc.getElementById(RegExp.$1)) // eslint-disable-line
        ? [found]
        : [] // eslint-disable-line
      : Array.prototype.slice.call(
        /^\.([\w-]+)$/.test(selector)
          ? doc.getElementsByClassName(RegExp.$1)
          : /^[\w-]+$/.test(selector)
            ? doc.getElementsByTagName(selector)
            : doc.querySelectorAll(selector)
      );
  })();
  return dom;
};

/**
 * 数组映射
 * @param {Array} obj
 * @param {Function} cb
 * @param {*} [context]
 * @return {Array}
 */
const map = function (obj, cb, context) {
  if (!(obj && cb)) {
    return;
  }
  if (obj.map && obj.map === Array.prototype.map) {
    return obj.map(cb, context);
  } else {
    let result = [];
    for (let i = 0, len = obj.length; i < len; i++) {
      result.push(cb.call(context, obj[i], i, obj));
    }
    return result;
  }
};

const bind = function (func, context) {
  let args = Array.prototype.slice.call(arguments, 2);
  return function () {
    return func.apply(context, args.concat(Array.prototype.slice.call(arguments)));
  }
};

/**
 * create canvas
 * @param width
 * @param height
 * @param Canvas
 * @returns {HTMLCanvasElement}
 */
const createCanvas = (width, height, Canvas) => {
  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas
  } else {
    // create a new canvas instance in node.js
    // the canvas class needs to have a default constructor without any parameter
    return new Canvas(width, height);
  }
};

/**
 * add own item
 * @param array
 * @param item
 * @returns {*}
 */
const arrayAdd = function (array, item) {
  let i = 0;
  let index;
  const length = array.length;
  for (; i < length; i++) {
    if (array[i]['seriesIndex'] === item['seriesIndex']) {
      index = i;
    }
  }
  if (index === undefined) {
    array.push(item);
  } else {
    array[index] = item;
  }
  return array;
};

export {
  getTarget,
  merge,
  isObject,
  map,
  bind,
  arrayAdd,
  createCanvas
}
