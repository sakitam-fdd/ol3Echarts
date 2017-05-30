define(function (require) {
  var echarts = require('echarts')
  return echarts.extendComponentView({
    type: 'HMap',
    render: function (MapModel, echartModel, api) {
      var rendering = true
      var Map = echarts.Map
      var viewportRoot = api.getZr().painter.getViewportRoot()
      var coordSys = MapModel.coordinateSystem
      var moveHandler = function (type, target) {
        if (rendering) {
          return
        }
        var offsetEl = viewportRoot.parentNode.parentNode.parentNode
        var mapOffset = [
          -parseInt(offsetEl.style.left, 10) || 0,
          -parseInt(offsetEl.style.top, 10) || 0
        ]
        viewportRoot.style.left = mapOffset[0] + 'px'
        viewportRoot.style.top = mapOffset[1] + 'px'
        coordSys.setMapOffset(mapOffset)
        MapModel.mapOffset = mapOffset
        api.dispatchAction({
          type: 'MapRoam'
        })
      }
      var zoomEndHandler = function () {
        if (rendering) {
          return
        }
        api.dispatchAction({
          type: 'MapRoam'
        })
      }
      this._oldMoveHandler = moveHandler
      this._oldZoomEndHandler = zoomEndHandler
      Map.getView().on('change:resolution', moveHandler)
      Map.getView().on('change:center', moveHandler)
      Map.getView().on('change:rotation', moveHandler)
      Map.on('moveend', moveHandler)
      var roam = MapModel.get('roam')
      if (roam && roam !== 'scale') {
        // todo 允许拖拽
      } else {
        // todo 不允许拖拽
      }
      if (roam && roam !== 'move') {
        // todo 允许移动
      } else {
        // todo 不允许允许移动
      }
      rendering = false
    }
  })
})
