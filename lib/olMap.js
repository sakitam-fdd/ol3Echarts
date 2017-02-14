/**
 * olMap component extension
 */
define(function (require) {
  require('echarts').registerCoordinateSystem(
    'olMap', require('./olMapCoordSys')
  )
  require('./olMapModel')
  require('./olMapView')

  // Action
  require('echarts').registerAction({
    type: 'olMapRoam',
    event: 'olMapRoam',
    update: 'updateLayout'
  }, function (payload, ecModel) {})

  return {
    version: '1.0.0'
  }
})


