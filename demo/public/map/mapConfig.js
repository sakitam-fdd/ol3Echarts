/**
 * Created by FDD on 2016/12/14.
 */
define(function () {
  var appConfig = {
    mapConfig: {
      projection: "EPSG:4326",
      // extent: [55.102486359835105, 0.012805729421859313, 165.82033664774298, 60.719905983252346],
      center: [109.15169990462329, 31.74108365827285],
      zoom: 4,
      layerConfig: {
        baseLayers: [
          {
            layerName: '天地图',
            layerType: "WMTS",
            layer: 'vec',
            layerUrl: 'http://t0.tianditu.com/vec_c/wmts'
          },
          {
            layerName: "影像地图",
            layerType: "TDTWMTS",
            layer:"img",
            layerUrl: 'http://t0.tianditu.cn/img_c/wmts'
          },
          {
            layerName: "Dem地图",
            layerType: "Image",
            layer:"ter",
            layerUrl: 'http://t0.tianditu.com/ter_c/wmts'
          },
          {
            layerUrl:'http://online2.map.bdimg.com'
          }
        ]
      }
    }
  };
  return appConfig;
});