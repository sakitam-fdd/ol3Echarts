/**
 * Created by FDD on 2017/5/30.
 * @desc 注册当前地图的坐标系统,事件，模块和视图
 */

import echarts from 'echarts'
import './registerMapModel'
import './registerMapView'
import registerMapCoordSys from './registerMapCoordSys'
echarts.registerCoordinateSystem('openlayers', registerMapCoordSys)
echarts.registerAction({
  type: 'MapRoam',
  event: 'MapRoam',
  update: 'updateLayout'
}, function (payload, ecModel) {
  ecModel.eachComponent('openlayers', function (mapModel) {
    // let _map = mapModel.getMap()
    // let _view = _map.getView()
    // let center = _view.getCenter()
    // let _zoom = _view.getZoom()
    // _view.animate({zoom: _zoom}, {center: center})
  })
})
