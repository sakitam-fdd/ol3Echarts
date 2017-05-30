define(function (require) {
  return require('echarts').extendComponentModel({
    type: 'HMap',
    getBMap: function () {
      return this.Map
    },
    defaultOption: {
      roam: false
    }
  })
})
