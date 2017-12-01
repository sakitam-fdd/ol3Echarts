var Tpl = function(tpl, data) {
  var fn = tpl.replace(/&lt;/g, '<').replace(/&gt;/g, '>') //    转义 <>
    .replace(/(<%=)([\s\S]*?)(%>)/g, '$1_html_+= ($2)\n$3') // <%= %>  [\s\S]允许换行
    .replace(/(<%)(?!=)([\s\S]*?)(%>)/g, '$1\n\t$2\n$3') // <% js code %>  (?!=)不要匹配到<%= %>
    .replace(/(^|%>|%>)([\s\S]*?)(<%=|<%|$)/g, function($, $1, $2, $3) { // 边界符外的html, html中的(\|"|\r|\n)要转义
      return '_html_+= "' + $2.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r?\n/g, '\\n') + '"\n'
    });
  return (fn = Function('data', 'with(data||{}){\nvar _html_=""\n' + fn + '\nreturn _html_\n}')), data ? fn(data) : fn
};

var wrapMap = {
  legend: {
    intro: '<fieldset>',
    outro: '</fieldset>'
  },
  area: {
    intro: '<map>',
    outro: '</map>'
  },
  param: {
    intro: '<object>',
    outro: '</object>'
  },
  thead: {
    intro: '<table>',
    outro: '</table>'
  },
  tr: {
    intro: '<table><tbody>',
    outro: '</tbody></table>'
  },
  col: {
    intro: '<table><tbody></tbody><colgroup>',
    outro: '</colgroup></table>'
  },
  td: {
    intro: '<table><tbody><tr>',
    outro: '</tr></tbody></table>'
  }
};

/**
 * 转义字符串到dom
 * @param HTMLString
 * @returns {Node}
 */
var parseDom = function (HTMLString) {
  var tmp = document.createElement('div');
  var tag = /[\w:-]+/.exec(HTMLString)[0];
  var inMap = wrapMap[tag];
  var validHTML = HTMLString.trim();
  if (inMap) {
    validHTML = inMap.intro + validHTML + inMap.outro
  }
  tmp.insertAdjacentHTML('afterbegin', validHTML);
  var node = tmp.lastChild;
  if (inMap) {
    var i = inMap.outro.match(/</g).length;
    while (i--) {
      node = node.lastChild;
    }
  }
  tmp.textContent = '';
  return node
};

// https://github.com/sakitam-fdd/mate/blob/master/src/utils/index.js
/**
 * 扩展
 * @param target
 * @param ob
 * @returns {*}
 */
var extend = function (target, ob) {
  for (var i in ob) {
    Object.hasOwnProperty()
    target[i] = ob[i]
  }
  return target
};

/**
 * 判断是否为对象
 * @param value
 * @returns {boolean}
 */
var isObject = function(value) {
  var type = typeof value;
  return value !== null && (type === 'object' || type === 'function');
};

var TypeOf = function (ob) {
  return Object.prototype.toString.call(ob).slice(8, -1).toLowerCase();
};

/**
 * 判断是否为表单数据
 * @param val
 * @returns {boolean}
 */
var isFormData = function (val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData)
};

/**
 * 编码请求地址
 * @param val
 * @returns {string}
 */
var encode = function (val) {
  return encodeURIComponent(val)
    .replace(/%40/gi, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
};

/**
 * 格式化请求参数
 * @param data
 * @returns {string}
 */
var formatParams = function (data) {
  let arr = []
  for (var name in data) {
    let value = data[name]
    if (isObject(value)) {
      value = JSON.stringify(value)
    }
    arr.push(encode(name) + '=' + encode(value))
  }
  return arr.join('&')
};

/**
 * 合并对象
 * @param a
 * @param b
 * @returns {*}
 */
var merge = (a, b) => {
  for (let key in b) {
    if (!a.hasOwnProperty(key)) {
      a[key] = b[key]
    } else if (isObject(b[key]) && isObject(a[key])) {
      merge(a[key], b[key])
    }
  }
  return a
}

var ajax = function () {
  var that = this;
  this.interceptors = {
    response: {
      use (handler, onerror) {
        that.handler = handler
        that.onerror = onerror
      }
    },
    request: {
      use (handler) {
        that.handler = handler
      }
    }
  };
  this.config = {
    method: 'GET',
    baseURL: '',
    headers: {},
    timeout: 0,
    withCredentials: false
  };
};
ajax.prototype.request = function (url, data, options) {
  var engine, that = this;
  if (window.XMLHttpRequest) {
    engine = new XMLHttpRequest();
  } else {
    if (window.ActiveXObject) {
      engine = new ActiveXObject("Microsoft.XMLHttp");
    }
  };
  var promise = new Promise(function (resolve, reject) {
    options = options || {}
    var defaultHeaders = {
      'Content-type': 'application/x-www-form-urlencoded'
    }
    merge(defaultHeaders, that.config.headers);
    that.config.headers = defaultHeaders;
    merge(options, that.config);
    var rqi = that.interceptors.request;
    var rpi = that.interceptors.response;
    options.body = data || options.body;
    var abort = false;
    var operate = {
      reject: function (e) {
        abort = true;
        reject(e)
      },
      resolve: function (d) {
        abort = true;
        resolve(d)
      }
    };
    url = url ? url.trim() : '';
    options.method = options.method.toUpperCase()
    options.url = url
    if (rqi.handler) {
      options = rqi.handler(options, operate)
      if (!options) return
    }
    if (abort) return
    url = options.url ? options.url.trim() : '';
    if (!url) url = location.href
    var baseUrl = options.baseURL ? options.baseURL.trim() : '';
    if (url.indexOf('http') !== 0) {
      var isAbsolute = url[0] === '/';
      if (!baseUrl) {
        var arr = location.pathname.split('/');
        arr.pop();
        baseUrl = location.protocol + '//' + location.host + (isAbsolute ? '' : arr.join('/'));
      }
      if (baseUrl[baseUrl.length - 1] !== '/') {
        baseUrl += '/';
      }
      url = baseUrl + (isAbsolute ? url.substr(1) : url);
      var t = document.createElement('a');
      t.href = url;
      url = t.href
    }
    var responseType = options.responseType ? options.responseType.trim() : '';
    engine.withCredentials = !!options.withCredentials;
    var isGet = options.method === 'GET';
    if (isGet) {
      if (options.body) {
        data = formatParams(options.body);
        url += (url.indexOf('?') === -1 ? '?' : '&') + data;
      }
    }
    engine.open(options.method, url);
    // try catch for ie >=9
    try {
      engine.timeout = options.timeout || 0;
      if (responseType !== 'stream') {
        engine.responseType = responseType
      }
    } catch (e) {
    }
    if (['object', 'array'].indexOf(TypeOf(options.body)) !== -1) {
      options.headers['Content-type'] = 'application/json;charset=utf-8';
      data = JSON.stringify(options.body);
    }
    for (var k in options.headers) {
      if (k.toLowerCase() === 'content-type' &&
        (isFormData(options.body) || !options.body || isGet)) {
        delete options.headers[k]
      } else {
        try {
          engine.setRequestHeader(k, options.headers[k])
        } catch (e) {
        }
      }
    }
    var onerror = function (e) {
      if (rpi.onerror) {
        e = rpi.onerror(e, operate)
      }
      return e
    };
    engine.onload = function () {
      if ((engine.status >= 200 && engine.status < 300) || engine.status === 304) {
        var response = engine.response || engine.responseText;
        if ((engine.getResponseHeader('Content-Type') || '').indexOf('json') !== -1 && !isObject(response)) {
          response = JSON.parse(response);
        }
        var data = {data: response, engine, request: options};
        merge(data, engine._response);
        if (rpi.handler) {
          data = rpi.handler(data, operate) || data;
        }
        if (abort) return;
        resolve(data);
      } else {
        var err = new Error(engine.statusText);
        err.status = engine.status;
        err = onerror(err) || err;
        if (abort) return;
        reject(err);
      }
    }
    engine.onerror = function (e) {
      var err = new Error(e.msg || 'Network Error');
      err.status = 0;
      err = onerror(err);
      if (abort) return;
      reject(err);
    };
    engine.ontimeout = function () {
      // Handle timeout error
      var err = new Error(`timeout [ ${engine.timeout}ms ]`);
      err.status = 1;
      err = onerror(err);
      if (abort) return;
      reject(err);
    };
    engine._options = options;
    engine.send(isGet ? null : data);
  })
  promise.engine = engine;
  return promise;
};
ajax.prototype.get = function (url, data, options) {
  return this.request(url, data, options)
};
ajax.prototype.post = function (url, data, options) {
  return this.request(url, data, merge({method: 'POST'}, options))
};
ajax.prototype.all = function (promises) {
  return Promise.all(promises)
};
var $fetch = new ajax();
