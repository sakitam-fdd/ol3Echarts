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
  const type = typeof value
  return value !== null && (type === 'object' || type === 'function')
}

/**
 * merge
 * @param a
 * @param b
 * @returns {*}
 */
const merge = (a, b) => {
  for (let key in b) {
    /* istanbul ignore else */
    if (!a.hasOwnProperty(key)) {
      a[key] = b[key]
    } else if (isObject(b[key]) && isObject(a[key])) {
      merge(a[key], b[key])
    }
  }
  return a
}

/**
 * get parent container
 * @param selector
 */
const getTarget = (selector) => {
  let dom = (function () {
    let found
    return (document && /^#([\w-]+)$/.test(selector))
      ? ((found = document.getElementById(RegExp.$1)) ? [found] : [])
      : Array.prototype.slice.call(/^\.([\w-]+)$/.test(selector)
        ? document.getElementsByClassName(RegExp.$1)
        : /^[\w-]+$/.test(selector) ? document.getElementsByTagName(selector)
          : document.querySelectorAll(selector)
      )
  })()
  return dom
}

export {
  getTarget,
  merge
}
