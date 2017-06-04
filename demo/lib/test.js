eval(function (p, a, c, k, e, d) {
  e = function (c) {
    return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
  };
  if (!''.replace(/^/, String)) {
    while (c--) {
      d[e(c)] = k[c] || e(c)
    };
    k = [function (e) {
      return d[e]
    }];
    e = function () {
      return '\\w+'
    };
    c = 1
  }
  ;
  while (c--) {
    if (k[c]) {
      p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c])
    }
  };
  return p
}('4 1 = 0;2.3(1)', 62, 5, '|a|console|log|var'.split('|'), 0, {}))