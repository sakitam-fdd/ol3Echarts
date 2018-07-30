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
 */
const getTarget = (selector) => {
  let dom = (function () {
    let found;
    return (document && /^#([\w-]+)$/.test(selector))
      ? ((found = document.getElementById(RegExp.$1)) ? [found] : []) // eslint-disable-line
      : Array.prototype.slice.call(/^\.([\w-]+)$/.test(selector)
        ? document.getElementsByClassName(RegExp.$1)
        : /^[\w-]+$/.test(selector) ? document.getElementsByTagName(selector)
          : document.querySelectorAll(selector)
      )
  })();
  return dom
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
  arrayAdd
}
