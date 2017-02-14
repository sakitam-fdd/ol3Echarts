/**
 * Created by FDD on 2016/12/14.
 */
define(['ol', 'proj', 'truf', 'switchLayer', 'measure'], function (ol, proj, truf, switchLayer, measure) {
  var myMap = function () {
    /**
     * 范围
     * @type {Array}
     */
    this.extent = [];
    /**
     * 投影
     * @type {null}
     */
    this.projection = null;
    /**
     * 瓦片原点
     * @type {Array}
     */
    this.origin = [];
    /**
     * 分辨率
     * @type {Array}
     */
    this.resolutions = [];
    /**
     * 层级
     * @type {Array}
     */
    this.matrixIds = [];
    /**
     * 默认显示中心
     * @type {Array}
     */
    this.center = [];
    /**
     * 地图对象
     * @type {null}
     */
    this.map = null;
    /**
     * 地图缩放级别
     * @type {null}
     */
    this.zoom = null;
  };
  /**
   *初始化
   */
  myMap.prototype.initMap = function (ele, mapConfig) {
    var that = this;
    if (ele && mapConfig && mapConfig instanceof Object) {
      this.getMapConfig(mapConfig);
      var layer = this.initTdtMap(mapConfig.layerConfig.baseLayers[0]);
      this.map = new ol.Map({
        target: ele,
        // logo: false,
        interactions: ol.interaction.defaults({doubleClickZoom: false}).extend([]),
        controls: [
          new ol.control.ScaleLine(),
          new ol.control.Loading(),
          new ol.control.Measure(),
          new ol.control.LayerSwitcher({
            tipLabel: 'Legend' // Optional label for button
          })
        ],
        layers: [layer],
        view: new ol.View({
          center: ol.proj.fromLonLat(that.center, that.projection),
          zoom: that.zoom,
          projection: that.projection,
          extent: that.extent,
          maxResolution: that.resolutions[0],
          minResolution: that.resolutions[that.resolutions.length - 1]
        })
      });
    }
  };
  /**
   * 初始化天地图
   * @param layerConfig
   * @returns {*}
   */
  myMap.prototype.initTdtMap = function (layerConfig) {
    var that = this;
    if (!layerConfig || !layerConfig['layerName']) {
      return null;
    }
    var layer = new ol.layer.Tile({
      isBaseLayer: true,
      isCurrentBaseLayer: false,
      layerName: layerConfig['layerName'],
      opacity: 1,
      visible: true,
      source: new ol.source.WMTS({
        url: layerConfig['layerUrl'],
        layer: layerConfig['layer'],
        matrixSet: 'c',
        format: 'tiles',
        projection: that.projection,
        tileGrid: new ol.tilegrid.WMTS({
          origin: ol.extent.getTopLeft(that.projection.getExtent()),
          resolutions: that.resolutions,
          matrixIds: that.matrixIds
        }),
        style: 'default',
        wrapX: false
      })
    });
    return layer;
  };
  /**
   * 初始化XYZ格式地图
   * @param layerConfig
   * @returns {ol.layer.Tile}
   */
  myMap.prototype.initXYZMap = function (layerConfig) {
    var that = this;
    var urlTemplate = layerConfig['layerUrl'] + '/tile/{z}/{y}/{x}';
    var baseLayer = new ol.layer.Tile({
      isBaseLayer: true,
      isCurrentBaseLayer: false,
      layerName: layerConfig['layerName'],
      source: new ol.source.XYZ({
        wrapX: false,
        tileGrid: new ol.tilegrid.TileGrid({
          origin: that.origin,
          resolutions: that.resolutions
        }),
        projection: that.projection,
        tileUrlFunction: function (tileCoord) {
          var url = urlTemplate.replace('{z}', (tileCoord[0]).toString())
            .replace('{x}', tileCoord[1].toString())
            .replace('{y}', (-tileCoord[2] - 1).toString());
          return url;
        }
      }),
      extent: that.extent
    });
    this.map.getLayers().insertAt(0, baseLayer);
    return baseLayer;
  };
  /**
   * 加载地图配置
   * @param mapConfig
   */
  myMap.prototype.getMapConfig = function (mapConfig) {
    var options = mapConfig || {};
    //投影
    if (options['projection']) {
      this.projection = ol.proj.get(options['projection']);
    } else {
      this.projection = ol.proj.get("EPSG:4326");
    }
    var size = ol.extent.getWidth(this.projection.getExtent()) / 256;
    //分辨率和层级
    if (options['resolutions'] && options['matrixIds']) {
      this.resolutions = options['resolutions'];
      this.matrixIds = options['matrixIds'];
    } else {
      this.resolutions = new Array(19);
      this.matrixIds = new Array(19);
      for (var z = 0; z < 19; ++z) {
        this.resolutions[z] = size / Math.pow(2, z);
        this.matrixIds[z] = z;
      }
    }
    //origin
    if (options['origin']) {
      this.origin = options['origin'];
    }
    if (options['extent']) {
      this.extent = options['extent'];
    } else {
      this.extent = [-180, -90, 180, 90];
    }
    //center
    if (options['center']) {
      this.center = options['center'];
    }
    //zoom
    if (options['zoom']) {
      this.zoom = options['zoom'];
    } else {
      this.zoom = [0, 0];
    }
    this.projection.setExtent(this.extent);
  }

  myMap.prototype.addBaseLayers = function () {

  };
  return myMap;
})