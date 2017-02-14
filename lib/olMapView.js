define(function (require) {
  return require('echarts').extendComponentView({
    type: 'olMap',

    render: function (olMapModel, ecModel, api) {
      var rendering = true

      var olMap = echarts.olMap
      var viewportRoot = api.getZr().painter.getViewportRoot()
      var coordSys = olMapModel.coordinateSystem
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
        olMapModel.__mapOffset = mapOffset

        api.dispatchAction({
          type: 'olMapRoam'
        })
      }

      function zoomEndHandler () {
        if (rendering) {
          return
        }
        api.dispatchAction({
          type: 'olMapRoam'
        })
      }

      // olMap.off('move', this._oldMoveHandler)
      // // FIXME
      // // Moveend may be triggered by centerAndZoom method when creating coordSys next time
      // // olMap.removeEventListener('moveend', this._oldMoveHandler)
      // olMap.off('zoomend', this._oldZoomEndHandler)
      // olMap.on('move', moveHandler)
      // // olMap.addEventListener('moveend', moveHandler)
      // olMap.on('zoomend', zoomEndHandler)
      olMap.getView().on('change:resolution', moveHandler);
      olMap.getView().on('change:center', moveHandler);
      olMap.on('moveend', moveHandler);

      this._oldMoveHandler = moveHandler
      this._oldZoomEndHandler = zoomEndHandler

      var roam = olMapModel.get('roam')
      if (roam && roam !== 'scale') {
        // todo 允许拖拽
      }else {
        // todo 不允许拖拽
      }
      if (roam && roam !== 'move') {
        // todo 允许移动
      }else {
        // todo 不允许允许移动
      }
      rendering = false
    }
  })
})
