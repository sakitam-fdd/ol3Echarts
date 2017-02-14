define(function (require) {
  return require('echarts').extendComponentModel({
    type: 'olMap',
    getBMap: function () {
      // __bmap is injected when creating BMapCoordSys
      return this.__olMap;
    },
    defaultOption: {
      roam: false
    }
  });
});