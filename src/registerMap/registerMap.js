/**
 * Created by FDD on 2017/5/30.
 * @desc 注册当前地图的坐标系统,事件，模块和视图
 */
define(function (require) {
  require('echarts').registerCoordinateSystem(
    'HMap', require('./registerMapCoordSys')
  )
  require('./registerMapModel')
  require('./registerMapView')
  require('echarts').registerAction({
    type: 'MapRoam',
    event: 'MapRoam',
    update: 'updateLayout'
  }, function (payload, ecModel) {})
  return {
    version: '1.2.0'
  }
})
