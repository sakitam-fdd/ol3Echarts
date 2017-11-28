/**
 * Created by FDD on 2017/11/28.
 * @desc helper
 */

/**
 * Merges the properties of sources into destination object.
 * @param dest
 * @returns {*}
 */
const extend = (dest) => { // (Object[, Object, ...]) ->
  for (let i = 1; i < arguments.length; i++) {
    const src = arguments[i]
    for (const k in src) {
      dest[k] = src[k]
    }
  }
  return dest
}

/**
 * Mixin options with the class's default options.
 * @param options
 * @returns {*}
 */
const merge = (options) => {
  const proto = this.prototype
  const parentProto = Object.getPrototypeOf(proto)
  if (!proto.options || proto.options === parentProto.options) {
    proto.options = proto.options ? Object.create(proto.options) : {}
  }
  extend(proto.options, options)
  return this
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
  merge,
  extend
}
