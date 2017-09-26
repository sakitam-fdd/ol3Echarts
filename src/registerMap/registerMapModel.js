import echarts from 'echarts'
export default echarts.extendComponentModel({
  type: 'openlayers',
  getMap: function () {
    return this.coordinateSystem.Map
  },
  defaultOption: {
    roam: false
  }
})
