import echarts from 'echarts'
export default echarts.extendComponentView({
  type: 'openlayers',
  render: function (MapModel, echartModel, api) {
    let rendering = true
    let Map = echarts.Map_
    let view = Map.getView()
    let viewportRoot = api.getZr().painter.getViewportRoot()
    let coordSys = MapModel.coordinateSystem
    const moveHandler = function (type, target) {
      if (rendering) {
        return
      }
      let offsetEl = viewportRoot.parentNode.parentNode.parentNode
      let mapOffset = [
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
    const zoomEndHandler = function () {
      if (rendering) {
        return
      }
      api.dispatchAction({
        type: 'MapRoam'
      })
    }
    view.un('change:resolution', zoomEndHandler)
    view.un('change:center', moveHandler)
    view.un('change:rotation', moveHandler)
    Map.un('moveend', moveHandler)
    view.on('change:resolution', zoomEndHandler)
    view.on('change:center', moveHandler)
    view.on('change:rotation', moveHandler)
    Map.on('moveend', moveHandler)
    let roam = MapModel.get('roam')
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
