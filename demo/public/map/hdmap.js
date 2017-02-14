/**
 * Created by lh on 2016/2/26.
 */
'use strict';
define(['ol', 'truf', 'proj4', 'broadcastNameEnum', 'mappopup', 'maplegend', 'maptitle', 'util', 'echarts', 'thematicsetting', 'appConfig', 'canvastar'],
  function (ol, truf, proj4, broadcastNameEnum, MapPopup, MapLegend, MapTitle, util, echarts, thematicset, appConfig) {
    window.ol = ol;
    require(["p-ol3", "OverlayPopup"], function (P) {
      window.P = P;
    });
    var app = {};
    app.Drag = function () {
      ol.interaction.Pointer.call(this, {
        handleDownEvent: app.Drag.prototype.handleDownEvent,
        handleDragEvent: app.Drag.prototype.handleDragEvent,
        handleMoveEvent: app.Drag.prototype.handleMoveEvent,
        handleUpEvent: app.Drag.prototype.handleUpEvent
      });
      this.customType = "appDrag";
      /**
       * @type {ol.Pixel}
       * @private
       */
      this.coordinate_ = null;

      /**
       * @type {string|undefined}
       * @private
       */
      this.cursor_ = 'pointer';

      /**
       * @type {ol.Feature}
       * @private
       */
      this.feature_ = null;

      /**
       * @type {string|undefined}
       * @private
       */
      this.previousCursor_ = undefined;

    };
    ol.inherits(app.Drag, ol.interaction.Pointer);

    /**
     * @param {ol.MapBrowserEvent} evt Map browser event.
     * @return {boolean} `true` to start the drag sequence.
     */
    app.Drag.prototype.handleDownEvent = function (evt) {
      if (evt.originalEvent.button === 0/*鼠标左键*/) {
        var map = evt.map;
        var feature = map.forEachFeatureAtPixel(evt.pixel,
          function (feature) {
            return feature;
          });
        if (feature && feature.get("params") && feature.get("params").moveable) {
          this.coordinate_ = evt.coordinate;
          this.feature_ = feature;
          window.ObservableObj.set('featureMove', this.feature_);
          window.ObservableObj.dispatchEvent('featureMoveEvt');
        }
        return !!feature;
      }
    };

    /**
     * @param {ol.MapBrowserEvent} evt Map browser event.
     */
    app.Drag.prototype.handleDragEvent = function (evt) {
      if (!this.coordinate_) {
        return;
      }
      var deltaX = evt.coordinate[0] - this.coordinate_[0];
      var deltaY = evt.coordinate[1] - this.coordinate_[1];
      var geometry = /** @type {ol.geom.SimpleGeometry} */
        (this.feature_.getGeometry());
      geometry.translate(deltaX, deltaY);
      this.coordinate_[0] = evt.coordinate[0];
      this.coordinate_[1] = evt.coordinate[1];
      this.feature_.dispatchEvent("featureMove");
    };


    /**
     * @param {ol.MapBrowserEvent} evt Event.
     */
    app.Drag.prototype.handleMoveEvent = function (evt) {
      if (this.cursor_) {
        var map = evt.map;
        var feature = null;
        if (this.feature_) {
          feature = this.feature_;
        } else {
          feature = map.forEachFeatureAtPixel(evt.pixel,
            function (feature) {
              return feature;
            });
        }

        var element = evt.map.getTargetElement();
        if (feature) {
          if (element.style.cursor != this.cursor_) {
            this.previousCursor_ = element.style.cursor;
            element.style.cursor = this.cursor_;
          }
        } else if (this.previousCursor_ !== undefined) {
          element.style.cursor = this.previousCursor_;
          this.previousCursor_ = undefined;
        }
      }
    };

    /**
     * @return {boolean} `false` to stop the drag sequence.
     */
    app.Drag.prototype.handleUpEvent = function () {
      window.testdrag = false;
      this.coordinate_ = null;
      this.feature_ = null;
      return false;
    };

    var HDMap = function () {
      ol.proj.setProj4(proj4);
      this.queryparams = null;
      this.polygonLayers = [];//面图层集合
      this.lineLayers = [];//线图层集合
      this.pointLayers = [];//点图层集合
      this.plotDraw = null;//标绘工具
      this.plotEdit = null;
      this._lastDrawInteractionGemotry = null;
      this.layerparams = null;//地图叠加路线时，把路线的qdzh、zdzh、lxdm、sxxfx组织起来，供图层列表叠加使用，形如{qdzh:0,zdzh:12,sxxfx:1,lxdm:'G104'}
      window.ObservableObj = new ol.Object();
      this.map = null;
      this.tempVectorLayer = null;
      this.tempAddline = [];//线段临时绘制图层
      this.wgs84Sphere = new ol.Sphere(6378137);
      this.popupOverlay = null;
      this.rangeSearchOverlay = null;
      this.drawPointermove = null;
      /**
       * 当前绘制的要素.
       * @type {ol.Feature}
       */
      this.drawSketch = null;
      this.listener = null;
      /**
       * Overlay to show the help messages.
       * @type {ol.Overlay}
       */
      this.measureHelpTooltip = null;

      /**
       * Message to show when the user is drawing a polygon.
       * @type {string}
       */
      this.continuePolygonMsg = '继续点击绘制面';
      /**
       * Message to show when the user is drawing a line.
       * @type {string}
       */
      this.continueLineMsg = '点击继续画线<br>双击结束绘制';
      this.selectInteraction = null;
      this.draw = null;
      this.tempVectorLayer = null;
      this.mapTools = {
        drawPlot: false, drawSquare: false, drawArraw: false,
        drawLine: false, drawCircle: false, drawPolygon: false,
        drawRect: false, addPoint: false, ljQuery: false,
        addTitle: false, addTextArea: false, zoomIn: false,
        zoomOut: false, iQuery: false, measureLength: false,
        measureArea: false, showLayers: false, drawBox: false,
        showMark: false, showzhMark: false,
        toolsType: {
          drawPlot: "drawPlot", drawSquare: "drawSquare",
          drawArraw: "drawArraw", drawLine: "drawLine",
          drawCircle: "drawCircle", drawPolygon: "drawPolygon",
          drawRect: "drawRect", drawBox: "drawBox", addPoint: "addPoint",
          addTitle: "addTitle", addTextArea: "addTextArea",
          zoomIn: "zoomIn", zoomOut: "zoomOut",
          iQuery: "iQuery", measureLength: "measureLength",
          measureArea: "measureArea", showLayers: "showLayers", ljQuery: "ljQuery",
          showMark: "showMark", showzhMark: "showzhMark"
        }
      };

      //初始化地图
      this.initHDMap = function (mapDiv) {
        ol.proj.setProj4(proj4);
        proj4.defs("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs");
        var tileUrl = appConfig.layerConfig.baseLayers[0].layerUrl;
        var self = this;
        $.ajax({
          url: tileUrl + "?f=pjson",
          type: "GET",
          dataType: 'jsonp',
          jsonp: 'callback',
          success: function (data) {
            if (data && data.error) {
              window.hdsxRootScope.$broadcast(broadcastNameEnum.alertWindowShow, {
                flag: true,
                data: {
                  title: "提示",
                  content: "加载地图失败，请联系地图服务提供商！"
                }
              });
              return;
            }
            appConfig.mapinfo = data;
            var fullExtent = [data.fullExtent.xmin, data.fullExtent.ymin, data.fullExtent.xmax, data.fullExtent.ymax];
            var projection = ol.proj.get("EPSG:" + data.spatialReference.wkid);
            projection.setExtent([-180, -90, 180, 90]);
            var resolutions = [];
            var origin = [data.tileInfo.origin.x, data.tileInfo.origin.y];
            var len = data.tileInfo.lods.length;

            for (var i = 0; i < len; i++) {
              resolutions.push(data.tileInfo.lods[i].resolution);
            }
            var tileGrid = new ol.tilegrid.TileGrid({
              tileSize: data.tileInfo.cols,
              origin: origin,
              extent: fullExtent,
              resolutions: resolutions
            });
            var urlTemplate = tileUrl + "/tile/{z}/{y}/{x}";
            var tileArcGISXYZ = new ol.source.XYZ({
              wrapX: false,
              tileGrid: tileGrid,
              projection: projection,
              tileUrlFunction: function (tileCoord) {
                var url = urlTemplate.replace('{z}', (tileCoord[0]).toString())
                  .replace('{x}', tileCoord[1].toString())
                  .replace('{y}', (-tileCoord[2] - 1).toString());
                return url;
              }
            });
            var baseLayer = new ol.layer.Tile({
              isBaseLayer: true,
              isCurrentBaseLayer: true,
              layerName: appConfig.layerConfig.baseLayers[0].layerName,
              source: tileArcGISXYZ
            });

            var _projection = ol.proj.get("EPSG:" + data.spatialReference.wkid);
            var size = ol.extent.getWidth(_projection.getExtent()) / 256;
            var _resolutions = new Array(19);
            var matrixIds = new Array(19);
            for (var z = 0; z < 19; ++z) {
              // generate resolutions and matrixIds arrays for this WMTS
              _resolutions[z] = size / Math.pow(2, z);
              matrixIds[z] = z;
            }
            self.map = new ol.Map({
              target: mapDiv,
              loadTilesWhileAnimating: true,
              interactions: ol.interaction.defaults({
                doubleClickZoom: true,
                keyboard: false
              }).extend([new app.Drag()]),
              controls: [new ol.control.ScaleLine({
                target: "hdscalebar"
              })],
              layers: [baseLayer],
              view: new ol.View({
                center: ol.proj.fromLonLat(appConfig.mapConfig.center, projection),
                zoom: appConfig.mapConfig.zoom,
                projection: projection,
                extent: fullExtent,
                maxResolution: _resolutions[0],
                minResolution: _resolutions[18]
              })
            });
            window.ObservableObj.dispatchEvent("MapInitialized");

            appConfig.trafficServerConfig = {
              projection: projection,
              tileGrid: tileGrid
            };

            self._addImageBaseLayer();
            //self.changeBaseLayer("img");
            //添加点击选择交互
            self.selectInteraction = new ol.interaction.Select({
              condition: ol.events.condition.click,
              style: function (fea, resolution) {
                var styles = [];
                var style = new ol.style.Style({
                  stroke: new ol.style.Stroke({
                    color: '#D97363',
                    width: 10
                  })
                });
                styles.push(style);
                return styles
              },
              layers: function (layer) {
                return layer.get("selectable");
              }
            });
            /**
             * 添加数据点击交互
             */
            self.map.on('singleclick', function (evt) {
              var feature = self.map.forEachFeatureAtPixel(evt.pixel,
                function (feature) {
                  return feature;
                });
              if (feature) {
                if (!self.draw || (self.draw && !self.draw.getActive())) {
                  var coordinate = evt.coordinate;
                  window.ObservableObj.set("clickObj", {feature: feature, coordinate: coordinate});
                  window.ObservableObj.dispatchEvent("clickObjEvt");
                }
              }
            });
            //添加鼠标移动交互
            self.moveInteraction = new ol.interaction.Select({
              condition: ol.events.condition.pointerMove,
              style: function (fea, resolution) {
                var styles = [];
                var style = new ol.style.Style({
                  stroke: new ol.style.Stroke({
                    color: '#D97363',
                    width: 10
                  })
                });
                styles.push(style);
                return styles
              },
              layers: function (layer) {
                return layer.get("selectable");
              },
              filter: function (feat, layer) {
                if (feat.get('features')) {
                  return feat.get('features').length <= 1;
                }
                return true;
              }
            });
            self.moveInteraction.on('select', function (evt) {
              var ret = evt.selected;
              if (ret.length == 0) {
                var deselected = evt.deselected;
                if (deselected.length > 0) {
                  var feat = deselected[0];
                  var layer = feat.get("belongLayer");
                  if (layer && (layer.getSource() instanceof ol.source.Cluster)) {
                    feat.setStyle(layer.getStyle());
                  } else if (feat.get("features")) {
                    var feats = feat.get("features");
                    if (feats[0]) {
                      var _layer = feats[0].get("belongLayer");
                      if (feats[0].get("belongLayer")) {
                        feat.setStyle(_layer.getStyle());
                      }
                    }
                  } else {//恢复鼠标滑过之前的样式
                    var _style = feat.get("unSelectStyle");
                    if (_style) {
                      feat.setStyle(_style);
                    }
                  }
                  window.currentFeat = null;
                  window.ObservableObj.set("mouseOutFeature", feat);
                  window.ObservableObj.dispatchEvent("mouseOutFeatureEvt");
                }
              } else {
                var feat = ret[0];
                //如果两个要素距离太近，会连续选中，而无法得到上一个选中的要素，所以在此保留起来
                var lastSelectFeature = self.moveInteraction.get("lastSelectFeature");
                if (lastSelectFeature && lastSelectFeature.get("unSelectStyle")) {
                  lastSelectFeature.setStyle(lastSelectFeature.get("unSelectStyle"));
                }
                self.moveInteraction.set("lastSelectFeature", feat);
                var layer = self.moveInteraction.getLayer(feat);
                var _style = feat.get("selectStyle") || layer.get("selectedStyle");
                if (_style) {
                  feat.setStyle(_style);
                }
                if (feat.get('features')) {
                  feat = feat.get('features')[0];
                }
                feat.set("belongLayer", layer);
                window.currentFeat = feat;
                window.ObservableObj.set("mouseOnFeature", feat);
                window.ObservableObj.dispatchEvent("mouseOnFeatureEvt");
              }
            });
            self.map.addInteraction(self.moveInteraction);
            var len = appConfig.layerConfig.baseLayers.length;
            var layerUrl = appConfig.layerConfig.baseLayers[0].url;
            for (var i = 0; i < len; i++) {
              var layerConfig = appConfig.layerConfig.baseLayers[i];
              if (layerConfig.isDefault) {
                layerUrl = layerConfig.layerUrl;
                break;
              }
            }
            self.tempVectorLayer = self.getTempVectorLayer(appConfig.layerConfig.tempLayer.tempVectorLayer, {create: true});
            self.map.on("pointerdrag", function () {
              if (self.popup) {
                self.popup.hide();
              }
            });

            self.map.on("click", function (evt) {
              window.ObservableObj.dispatchEvent("clickFlag");
              if (self.popup) {
                self.popup.hide();
              }
              var eventCoordinate = evt.coordinate;
              console.info(eventCoordinate);
              if (self.mapTools.iQuery) {
                if (self.queryparams != null && self.queryparams.drawend != null) {
                  self.queryparams.drawend(evt);
                  self.mapTools.iQuery = false;
                }
                return;
              } else if (self.mapTools.addTextArea) {
                self._addTextPopup(eventCoordinate);
                return;
              }
              else if (self.plotDraw && !self.plotDraw.isDrawing()) {
                var feature = self.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                  return feature;
                });
                if (feature && feature.getGeometry().isPlot) {
                  self.plotEdit.activate(feature);  // 开始编辑
                  window.ObservableObj.set('plotFeature', feature);
                  window.ObservableObj.dispatchEvent('choosePlot');
                } else {
                  self.plotEdit.deactivate(); // 结束编辑
                }
              }
              var overlays = self.map.getOverlays();
              overlays.forEach(function (item, index) {
                if (item.get("isEditorContainer") && item.getElement().editor) {
                  item.getElement().editor.destroy();
                  item.getElement().editor.isDestroy = true;
                  item.updateSize();
                  item.setOffset([-40, 10]);
                }
              });
            }, self);

            appConfig.hdmap = self;
            self.popup = new MapPopup();
            var mapLegend = new MapLegend({
              domNodeToAppend: document.getElementsByClassName("ol-viewport")[0]
            });
            self.legend = mapLegend;
            var mapTitle = new MapTitle();
            self.title = mapTitle;
            /**
             * 窗口变化时更新地图
             * */
            $(window).resizeend({
              delay: 50
            }, function () {
              self.updateSize();
            });
            return self.map;
          },
          error: function (err) {
            console.error(err);
          }
        });
      };
      /**
       * 天地图
       * @returns {null}
       */
      this.addTdMap = function () {
        var self = this;
        var tileArcGISXYZ = new ol.source.XYZ({//XYZ 格式的切片数据，继承自 ol.source.TileImage
          wrapX: false,//是否包含世界地图，默认true
          url: 'http://t1.tianditu.com/DataServer?T=vec_c&x={x}&y={y}&l={z}'
        });
        var baseLayer = new ol.layer.Tile({//基本图层：二维，影像，DOM
          isBaseLayer: true,//通用基本图层
          isCurrentBaseLayer: false,//当前通用基本图层
          layerName: "天地图",
          source: tileArcGISXYZ,
          wrapX: false
        });
        self.map.addLayer(baseLayer);
        baseLayer.setVisible(true);
      };
      /**
       * 获取拖拽交互
       * @returns {ol.interaction.DragPan|*}
       * @private
       */
      this._getDragPanInteraction = function () {
        if (!this.dragPanInteraction) {
          var items = this.map.getInteractions().getArray();
          for (var i = 0; i < items.length; i++) {
            var interaction = items[i];
            if (interaction instanceof ol.interaction.DragPan) {
              this.dragPanInteraction = interaction;
              break;
            }
          }
        }
        return this.dragPanInteraction;
      };
      this.addMeasureRemoveBtn = function (coordinate) {
        var self = this;
        //添加移除按钮
        var tempLayer = self.getTempVectorLayer(appConfig.layerConfig.tempLayer.tempVectorLayer);
        var pos = [coordinate[0] - 5 * this.map.getView().getResolution(), coordinate[1]];
        var btnImg = document.createElement('img');
        btnImg.src = "images/map/map_range_end.png";
        btnImg.style.cursor = "pointer";
        btnImg.title = "清除测量结果";
        btnImg.groupId = this.drawSketch.get("uuid");
        btnImg.pos = coordinate;
        btnImg.onclick = function (evt) {
          // console.info(this.groupId);
          var imgSelf = this;
          var groupId = this.groupId;
          var overlays = self.map.getOverlays().getArray();
          $(overlays).each(function (i, overlay) {
            if (overlay.get("groupId") == groupId) {
              self.map.removeOverlay(overlay);
            }
          });
          if (tempLayer) {
            var source = tempLayer.getSource();
            var features = source.getFeatures();
            $(features).each(function (i, feat) {
              var lastCoord = feat.getGeometry().getLastCoordinate();
              if (lastCoord[0] == imgSelf.pos[0] && lastCoord[1] == imgSelf.pos[1]) {
                source.removeFeature(feat);
              }
            });
          }
        };
        var closeBtn = new ol.Overlay({
          element: btnImg,
          offset: [0, -5],
          positioning: 'bottom-center'
        });
        this.map.addOverlay(closeBtn);
        closeBtn.setPosition(pos);
        closeBtn.set("groupId", this.drawSketch.get("uuid"));
      };
      this._addMeasureOverLay = function (coordinate, length, type) {
        var self = this;
        var helpTooltipElement = document.createElement('label');
        helpTooltipElement.style.position = "absolute";
        helpTooltipElement.style.display = "inline";
        helpTooltipElement.style.cursor = "inherit";
        helpTooltipElement.style.border = "none";
        helpTooltipElement.style.padding = "0";
        helpTooltipElement.style.whiteSpace = "nowrap";
        helpTooltipElement.style.fontVariant = "normal";
        helpTooltipElement.style.fontWeight = "normal";
        helpTooltipElement.style.fontStretch = "normal";
        helpTooltipElement.style.fontSize = "12px";
        helpTooltipElement.style.lineHeight = "normal";
        helpTooltipElement.style.fontFamily = "arial,simsun";
        helpTooltipElement.style.color = "rgb(51, 51, 51)";
        helpTooltipElement.style.webkitUserSelect = "none";
        if (type == "止点") {
          helpTooltipElement.style.border = "1px solid rgb(255, 1, 3)";
          helpTooltipElement.style.padding = "3px 5px";
          helpTooltipElement.className = " BMapLabel BMap_disLabel";
          helpTooltipElement.innerHTML = "总长<span class='BMap_disBoxDis'>" + length + "</span>";
          this.addMeasureRemoveBtn(coordinate);
        } else {
          helpTooltipElement.className = "BMapLabel";
          helpTooltipElement.innerHTML = "<span class='BMap_diso'><span class='BMap_disi'>" + length + "</span></span>";
        }
        var tempMeasureTooltip = new ol.Overlay({
          element: helpTooltipElement,
          offset: [0, -5],
          positioning: 'bottom-center'
        });
        this.map.addOverlay(tempMeasureTooltip);
        tempMeasureTooltip.setPosition(coordinate);
        tempMeasureTooltip.set("groupId", this.drawSketch.get("uuid"));
      };
      /**
       * 气泡弹窗
       * @params obj<Obj> offset<num>
       * */
      this.showPopup = function (obj, offset) {
        if (this.popupOverlay && !obj.hasOwnProperty("disClear")) {
          this.popupOverlay.hide();
          this.map.removeOverlay(this.popupOverlay);
          this.popupOverlay = null;
        }
        var m = {
          positioning: 'center-center',
          id: "overlay" + Math.floor(Math.random() * 1000) + Math.floor(Math.random() * 1000)
        };
        if (offset) {
          m.offset = offset;
        }
        obj = $.extend(obj, m);
        this.popupOverlay = new ol.Overlay.Popup(obj);
        this.map.addOverlay(this.popupOverlay);
        this.popupOverlay.show(obj.coordinate, obj.content);
        if (obj.hasOwnProperty('layerName') && obj.layerName == "warnFeatures") {
          this.rangeSearchOverlay = this.popupOverlay;
        }
        //如果气泡超出地图范围自动平移
        this.panIntoView_(this.popupOverlay, obj.coordinate, null)
      };
      /**
       * 关闭气泡
       * @returns {boolean}
       */
      this.closePopup = function (exceptId) {
        window.ObservableObj.set("selectFeature", null);
        window.ObservableObj.set("mouseOnFeature", null);
        if (this.popupOverlay) {
          if (this.popupOverlay.getId() != exceptId) {
            this.popupOverlay.hide();
            this.popupOverlay = null;
          }
        }
        return false;
      };
      /**
       * 关闭预警点气泡
       * @returns {boolean}
       */
      this.closeRangeSearchOverlay = function () {
        window.ObservableObj.set("selectFeature", null);
        window.ObservableObj.set("mouseOnFeature", null);
        if (this.rangeSearchOverlay) {
          this.rangeSearchOverlay.hide();
          this.rangeSearchOverlay = null;
        }
        return false;
      };
      this.removeFeatureById = function (id, params) {
        if (this.map) {
          var layer = this.getlayerByName(params.layerName);
          if (layer) {
            var feature = layer.getSource().getFeatureById(id);
            if (feature != null) {
              layer.getSource().removeFeature(feature);
            }
          }
        }
      };

      /*右键标记里的确定被点击后*/
      this.showMarkPopupConfirm = function (obj) {
        console.log("点击了确定");
      };

      this.iQuery = function () {
        console.info("i查询");
      };
      this.addArcgisLayer = function (params, callback) {
        var layerName = params.layerName;
        var layerUrl = params.layerUrl;
        if (!layerName) {
          layerName = layerUrl;
        }
        if (!layerUrl) {
          console.info("必须传入切片地址！");
          return;
        }
        var self = this;
        $.ajax({
          url: layerUrl + "?f=pjson",
          type: "GET",
          dataType: 'jsonp',
          jsonp: 'callback',
          timeout: 5,
          success: function (data) {
            var fullExtent = [data.fullExtent.xmin, data.fullExtent.ymin, data.fullExtent.xmax, data.fullExtent.ymax];
            var projection = new ol.proj.Projection({
              code: String(data.spatialReference.wkid),
              extent: fullExtent
            });
            var isTiled = data.tileInfo;
            var tileArcGISXYZ = null;
            if (isTiled) {
              var resolutions = [];
              var origin = [data.tileInfo.origin.x, data.tileInfo.origin.y];
              var len = data.tileInfo.lods.length;

              for (var i = 0; i < len; i++) {
                resolutions.push(data.tileInfo.lods[i].resolution);
              }
              var tileGrid = new ol.tilegrid.TileGrid({
                tileSize: data.tileInfo.cols,
                origin: origin,
                extent: fullExtent,
                resolutions: resolutions
              });
              var urlTemplate = layerUrl + "/tile/{z}/{y}/{x}";
              tileArcGISXYZ = new ol.source.XYZ({
                tileGrid: tileGrid,
                projection: projection,
                tileUrlFunction: function (tileCoord) {
                  var url = urlTemplate.replace('{z}', (tileCoord[0]).toString())
                    .replace('{x}', tileCoord[1].toString())
                    .replace('{y}', (-tileCoord[2] - 1).toString());
                  return url;
                }
              });
            } else {
              tileArcGISXYZ = new ol.source.TileArcGISRest({
                projection: projection,
                url: layerUrl,
                wrapX: false,
                params: {
                  "DPI": 96
                }
              });
            }
            var tileLayer = new ol.layer.Tile({
              layerName: layerName,
              source: tileArcGISXYZ
            });
            self.map.addLayer(tileLayer);
            if (callback && typeof(callback) == 'function') {
              callback(data);
            }
          }
        });
      };
      this.getTempTileLayer = function (layerName, params) {
        var vectorLayer = null;
        if (this.map) {
          var layers = this.map.getLayers();
          layers.forEach(function (layer) {
            var layerNameTemp = layer.get("layerName");
            if (layer instanceof ol.layer.Tile && layerNameTemp === layerName) {
              vectorLayer = layer;
              return vectorLayer;
            }
          }, this);
        }
        if (vectorLayer) {
          return vectorLayer;
        }
        if (params && params.create) {
          var urlTemplate = params["urlTemplate"];
          var tileArcGISXYZ = new ol.source.XYZ({
            tileGrid: params.tileGrid,
            projection: params.projection,
            tileUrlFunction: function (tileCoord) {
              var url = urlTemplate.replace('{z}', (tileCoord[0]).toString())
                .replace('{x}', tileCoord[1].toString())
                .replace('{y}', (-tileCoord[2] - 1).toString());
              return url;
            }
          });
          vectorLayer = new ol.layer.Tile({
            source: tileArcGISXYZ
          });
        }
        return vectorLayer;
      };
      //创建临时图层，用来放绘制的要素
      //如果该临时图层存在，则直接返回，如果不存在，则重新创建
      this.getTempVectorLayer = function (layerName, params) {
        var vectorLayer = this.getlayerByName(layerName);
        if (!(vectorLayer instanceof ol.layer.Vector)) {
          vectorLayer = null;
        }
        if (!vectorLayer) {
          if (params && params.create) {
            var vectorSource = new ol.source.Vector({
              wrapX: false
            });
            vectorLayer = new ol.layer.Vector({
              layerName: layerName,
              params: params,
              source: vectorSource,
              style: new ol.style.Style({
                fill: new ol.style.Fill({
                  color: 'rgba(67, 110, 238, 0.4)'
                }),
                stroke: new ol.style.Stroke({
                  color: '#4781d9',
                  width: 2
                }),
                image: new ol.style.Circle({
                  radius: 7,
                  fill: new ol.style.Fill({
                    color: '#ffcc33'
                  })
                })
              })
            });
            if (layerName == "routestlayer") {
              vectorSource.on("addfeature", function (event) {
                var params = event.feature.get("params");
                if (!params || !params.hasOwnProperty('featureType'))
                  return;
                var type = params.featureType;
                var imgURL = appConfig.markConfig.getMarkConfig(type).imgURL;
                var iconStyle = new ol.style.Style({
                  image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                    anchor: [0.5, 25],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    opacity: 0.75,
                    src: imgURL
                  }))
                });
                event.feature.setStyle(iconStyle);
                var features = vectorSource.getFeatures();
                var tempFeatures = [];
                if (features.length >= 2) {
                  for (var i = 0; i < features.length; i++) {
                    var fea = features[i];
                    var feaType = fea.get("featureType");
                    if (type === "startPoint") {
                      if (feaType === type) {
                        tempFeatures.push(fea);
                      }
                    } else if (type === "endPoint") {
                      if (feaType === type) {
                        tempFeatures.push(fea);
                      }
                    }
                  }
                  for (var m = 0; m < tempFeatures.length - 1; m++) {
                    vectorSource.removeFeature(tempFeatures[m]);
                  }
                }
              }, this);
            }
          }
        }
        if (vectorLayer && (layerName == appConfig.layerConfig.tempLayer.plotDrawLayer || layerName == appConfig.layerConfig.tempLayer.perimeterSerach)) {
          ol.Observable.unByKey(vectorLayer.addFeatureHandler);
          vectorLayer.addFeatureHandler = vectorLayer.getSource().on("addfeature", function (event) {
            var params = event.feature.get("params");
            if (!params) {
              params = event.feature.getGeometry().get("params");
            }
            var config;
            if (params && params.featureType) {
              config = appConfig.markConfig.getMarkConfig(params.featureType);
            } else if (params && params.layerName) {
              config = appConfig.markConfig.getMarkConfigByetype(params.layerName);
            }

            if (config) {
              var imgURL = config.imgURL;
              if (imgURL) {
                var iconStyle = new ol.style.Style({
                  image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                    anchor: [0.5, 25],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    opacity: 0.75,
                    src: imgURL
                  }))
                });
                event.feature.setStyle(iconStyle);
              }
            }

          }, this);
        }

        if (this.map && vectorLayer) {
          if (!this.getlayerByName(layerName)) {
            //图层是否可以选择
            if (params && params.hasOwnProperty('selectable')) {
              vectorLayer.set("selectable", params.selectable);
            }
            this.map.addLayer(vectorLayer);
          }
        }
        return vectorLayer;
      };


      /**
       * 对距离的显示进行格式化
       * @param {ol.geom.LineString} line
       * @private
       * @return {string}
       */
      this.formatLength = function (coordinates) {
        var length = 0;
        for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
          length += this.wgs84Sphere.haversineDistance(coordinates[i], coordinates[i + 1]);
        }
        var output;
        if (length > 100) {
          output = (Math.round(length / 1000 * 100) / 100) +
            ' ' + '公里';
        } else {
          output = (Math.round(length * 100) / 100) +
            ' ' + '米';
        }
        return output;
      };


      /**
       * 对距离的显示进行格式化
       * @param {ol.geom.Polygon} area
       * @private
       * @return {string}
       */
      this.formatArea = function (area) {
        var output;
        if (area > 100000000000) {
          output = (Math.round(area / (1000 * 1000 * 10000) * 100) / 100) +
            ' ' + '万平方公里';
        }
        if (area > 10000000) {
          output = (Math.round(area / (1000 * 1000) * 100) / 100) +
            ' ' + '平方公里';
        } else {
          output = (Math.round(area * 100) / 100) +
            ' ' + '平方米';
        }
        return output;
      };

      this.createMeasureAreaTooltip = function () {
        this.measureAreaTooltipElement = document.createElement('div');
        this.measureAreaTooltipElement.style.marginLeft = "-6.25em";
        this.measureAreaTooltipElement.className = 'measureTooltip hidden';
        this.measureAreaTooltip = new ol.Overlay({
          element: this.measureAreaTooltipElement,
          offset: [15, 0],
          positioning: 'center-left'
        });
        this.map.addOverlay(this.measureAreaTooltip);
      };

      this.removeDrawInteraion = function () {
        if (this.draw) {
          this.map.removeInteraction(this.draw);
        }
        delete this.draw;
        this.draw = null;
      };

      this.addDrawInteraction = function (drawType, params) {
        var self = this;
        self.removeDrawInteraion();
        self.draw = self._createDraw(drawType, params);
        self.map.addInteraction(self.draw);
        if (drawType !== "Point") {
          self._getDragPanInteraction().setActive(false);
        }
        self.draw.on('drawstart', function (evt) {
          self.drawSketch = evt.feature;
          self.drawSketch.set("uuid", Math.floor(Math.random() * 100000000 + 1));
          /** @type {ol.Coordinate|undefined} */
          var tooltipCoord = evt.coordinate;
          if (self.mapTools.measureLength) {
            ol.Observable.unByKey(self.beforeMeasurePointerMoveHandler);
            self.listener = self.drawSketch.getGeometry().on('change', function (evt) {
              var geom = evt.target;
              if (geom instanceof ol.geom.LineString) {
                var output = self.formatLength(/** @type {ol.geom.LineString} */ (geom.getCoordinates()));
                self.drawSketch.length = output;
                self.measureHelpTooltip.getElement().firstElementChild.firstElementChild.innerHTML = output;
              }
            }, self);

            self.drawPointermove = self.map.on("pointermove", self._drawPointerMoveHandler, self);

          } else if (self.mapTools.measureArea) {
            var uuid = Math.floor(Math.random() * 100000000 + 1);
            self.drawSketch.set("uuid", uuid);
            self.measureAreaTooltip.set("groupId", uuid);
            self.listener = self.drawSketch.getGeometry().on('change', function (evt) {
              var coordinates = self.drawSketch.getGeometry().getCoordinates()[0];
              var area = Math.abs(self.wgs84Sphere.geodesicArea(coordinates));
              area = self.formatArea(area);
              if (self.measureAreaTooltip) {
                var poly = {
                  "type": "Feature",
                  "properties": {},
                  "geometry": {
                    "type": "Polygon",
                    "coordinates": [coordinates]
                  }
                };
                self.measureAreaTooltipElement.innerHTML = "面积:" + area;
                self.measureAreaTooltip.setPosition(truf.centroid(poly).geometry.coordinates);
              }
            }, self);
          }
        }, self);
        var drawEndEventName = "drawend";
        if (drawType == "drawBox") {
          drawEndEventName = "boxend";
        }
        self.draw.on(drawEndEventName, function (evt) {
          if (self.draw.getGeometry) {
            self.setLastDrawInteractionGemotry(self.draw.getGeometry().clone());
          } else if (self.drawSketch) {
            self.setLastDrawInteractionGemotry(self.drawSketch.getGeometry().clone());
          }
          if (evt.feature) {
            evt.feature.set("params", params);
          }
          self._getDragPanInteraction().setActive(true);
          if (drawEndEventName == "drawend") {
            self._activePointInteraction(true);
          }
          self.map.getTargetElement().style.cursor = "default";
          self.map.removeOverlay(self.measureHelpTooltip);
          self.measureHelpTooltip = null;
          if (self.mapTools.measureLength) {
            self._addMeasureOverLay(evt.feature.getGeometry().getLastCoordinate(), self.drawSketch.length, "止点");
            self.mapTools.measureLength = false;
            ol.Observable.unByKey(self.listener);
            ol.Observable.unByKey(self.drawPointermove);
            ol.Observable.unByKey(self.measureLengthClick);
          } else if (self.mapTools.measureArea) {
            ol.Observable.unByKey(self.listener);
            self.addMeasureRemoveBtn(self.drawSketch.getGeometry().getCoordinates()[0][0]);
          }
          if (params && params.drawend) {
            params.drawend(evt);
          }
          self.drawSketch = null;
          if (!params['notclear']) {
            self.removeDrawInteraion();
          }
        });
      };

      this._createDraw = function (drawType, params) {
        if (!params) {
          params = {};
        }
        var fill = {color: 'rgba(254, 164, 164, 1)'};
        var stroke = {color: 'rgba(252, 129, 129, 1)', width: 3};
        var image = {radius: 1, fill: new ol.style.Fill({color: '#ffcc33'})};
        if (!params.layerName) {
          params.layerName = appConfig.layerConfig.tempLayer.tempVectorLayer;
        }
        if (!params.fill) {
          params.fill = fill;
        }
        if (!params.stroke) {
          params.stroke = stroke;
        }
        if (!params.image) {
          params.image = image;
        }
        var draw = null;
        if (drawType == 'drawBox') {
          draw = new ol.interaction.DragBox({
            className: 'ol-dragbox'
          });
        } else {
          draw = new ol.interaction.Draw({
            source: this.getTempVectorLayer(params.layerName, {create: true}).getSource(),
            type: drawType,
            style: new ol.style.Style({
              fill: new ol.style.Fill(params.fill),
              stroke: new ol.style.Stroke(params.stroke),
              image: new ol.style.Circle(params.image)
            })
          });
        }
        return draw;
      };

      /*返回上一次ol.draw.Interaction工具绘制的Geometry* 地图标绘不是用ol.draw.Interaction*/
      this.getLastDrawInteractionGemotry = function () {
        return this._lastDrawInteractionGemotry;
      };
      this.setLastDrawInteractionGemotry = function (geometry) {
        if (geometry instanceof ol.geom.Geometry) {
          this._lastDrawInteractionGemotry = geometry;
        } else {
          console.error(geometry, "不是几何对象");
        }
      };

      this._drawPointerMoveHandler = function (event) {
        if (this.mapTools.measureLength) {
          if (event.dragging) {
            return;
          }
          var helpTooltipElement = this.measureHelpTooltip.getElement();
          helpTooltipElement.className = " BMapLabel BMap_disLabel";
          helpTooltipElement.style.position = "absolute";
          helpTooltipElement.style.display = "inline";
          helpTooltipElement.style.cursor = "inherit";
          helpTooltipElement.style.border = "1px solid rgb(255, 1, 3)";
          helpTooltipElement.style.padding = "3px 5px";
          helpTooltipElement.style.whiteSpace = "nowrap";
          helpTooltipElement.style.fontVariant = "normal";
          helpTooltipElement.style.fontWeight = "normal";
          helpTooltipElement.style.fontStretch = "normal";
          helpTooltipElement.style.fontSize = "12px";
          helpTooltipElement.style.lineHeight = "normal";
          helpTooltipElement.style.fontFamily = "arial,simsun";
          helpTooltipElement.style.color = "rgb(51, 51, 51)";
          helpTooltipElement.style.backgroundColor = "rgb(255, 255, 255)";
          helpTooltipElement.style.webkitUserSelect = "none";
          helpTooltipElement.innerHTML = "<span>总长:<span class='BMap_disBoxDis'></span></span><br><span style='color: #7a7a7a;'>单击确定地点,双击结束</span>";
          this.measureHelpTooltip.setPosition(event.coordinate);
        }
      };

      /*点击但是还没有开始测量*/
      this._beforeDrawPointMoveHandler = function (event) {
        if (!this.measureHelpTooltip) {
          var helpTooltipElement = document.createElement('label');
          helpTooltipElement.className = "BMapLabel";
          helpTooltipElement.style.position = "absolute";
          helpTooltipElement.style.display = "inline";
          helpTooltipElement.style.cursor = "inherit";
          helpTooltipElement.style.border = "none";
          helpTooltipElement.style.padding = "0";
          helpTooltipElement.style.whiteSpace = "nowrap";
          helpTooltipElement.style.fontVariant = "normal";
          helpTooltipElement.style.fontWeight = "normal";
          helpTooltipElement.style.fontStretch = "normal";
          helpTooltipElement.style.fontSize = "12px";
          helpTooltipElement.style.lineHeight = "normal";
          helpTooltipElement.style.fontFamily = "arial,simsun";
          helpTooltipElement.style.color = "rgb(51, 51, 51)";
          helpTooltipElement.style.webkitUserSelect = "none";
          helpTooltipElement.innerHTML = "<span class='BMap_diso'><span class='BMap_disi'>单击确定起点</span></span>";
          this.measureHelpTooltip = new ol.Overlay({
            element: helpTooltipElement,
            offset: [55, 20],
            positioning: 'center-center'
          });
          this.map.addOverlay(this.measureHelpTooltip);
        }
        this.measureHelpTooltip.setPosition(event.coordinate);
      };


      /**添加单个点*/
      this.addPoint = function (attr, obj/*对添加的要素的描述信息*/) {
        var geometry = null;
        if (!obj) {
          obj = {};
        }
        if (attr instanceof ol.geom.Geometry) {
          geometry = attr;
        } else if ($.isArray(attr.geometry)) {
          geometry = new ol.geom.Point(attr.geometry);
        } else {
          geometry = new ol.format.WKT().readGeometry(attr.geometry);
        }
        var iconFeature = new ol.Feature({
          geometry: geometry,
          params: obj
        });
        var featureType = obj.featureType;
        var imgURL;
        if (featureType) {
          imgURL = appConfig.markConfig.getMarkConfig(featureType).imgURL;
        } else {
          imgURL = appConfig.markConfig.getDefaultMrakConfig().imgURL;
        }
        var iconStyle = new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 25],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.75,
            src: imgURL
          })
        });
        iconFeature.setStyle(iconStyle);

        if (obj.layerName) {
          var layer = this.getTempVectorLayer(obj.layerName, {
            create: true
          });
          layer.getSource().addFeature(iconFeature);
        } else {
          this.tempVectorLayer.getSource().addFeature(iconFeature);
        }
        if (obj.drawend && typeof(obj.drawend) == "function") {
          obj.drawend({
            feature: iconFeature
          });
        }
        this.mapTools.addPoint = false;
        if (this.addPointHandlerClick) {
          ol.Observable.unByKey(this.addPointHandlerClick);//移除对key的监听
        }
        this.OrderLayerZindex();
        return iconFeature;
      };
      /**
       * 线的数据转换为坐标
       * @param lineString 线的空间数据 {geometry:} 传输数据格式必须是标准WKT格式
       * @returns {Array.<ol.Coordinate>|Array.<Array.<ol.Coordinate>>|ol.Coordinate|Array.<Array.<Array.<ol.Coordinate>>>|*}
       */
      this.formatCoordinates = function (lineString) {
        var WKT = new ol.format.WKT();
        var geom = WKT.readGeometry(lineString.geometry);
        return geom.getCoordinates();
      };

      /**
       * 根据names集合清除地图上的overlayer图层
       * @params{array} names 图层集合
       */
      this.clearOverlayerGraphicsByLayerName = function (names) {
        var overlays = this.map.getOverlays().getArray();
        var length = overlays.length;
        var self = this;
        for (var m = 0; m < length; m++) {
          var overlay = overlays[m];
          if (overlay && overlay.get('layerName') && overlay.get('layerName') == names) {
            self.map.removeOverlay(overlay);
            m--;
          }
        }
      };

      /*删除某个要素*/
      this.removeFeature = function (featuer) {
        var self = this;
        if (featuer instanceof ol.Feature) {
          var tragetLayer = this.getLayerByFeatuer(featuer);
          if (tragetLayer) {
            if (this.plotEdit && this.plotEdit.activePlot && this.plotEdit.activePlot === featuer) {
              this.plotEdit.deactivate();
            }
            var source = tragetLayer.getSource();
            if (source && source.removeFeature) {
              source.removeFeature(featuer);
              self.cursor_ = 'pointer'
            }
          }
        } else {
          console.error("传入的不是要素");
        }
      };

      this.addMarker = function (coordinate, color, it) {
        var marker = document.createElement('div');
        marker.className = 'g20-pop g20-green';
        var icondiv = document.createElement('div');
        icondiv.className = 'iconfont icon-qipao';
        var content = document.createElement('div');
        content.className = 'g20-pop-content';
        var innerHtml = "<h4>" + it.lxdm + "(" + it.lxmc + ")</h4>";
        innerHtml += "<ul>";
        innerHtml += "<li>" + parseFloat(it.todayT) + "/" + parseFloat(it.yestodayT) + "(" + it.zzl + ")</li>";
        /*innerHtml+="<li>昨日："+parseFloat(it.yestodayT)+"</li>";
         innerHtml+="<li>环比增长："+it.zzl+"</li>";*/
        innerHtml += "</ul>";
        content.innerHTML = innerHtml;
        if (color == undefined || color == null) {
          color = "#EB4F38";
        }
        /*marker.style.color = color;
         marker.style.fontFamily = "cursive";
         marker.style.fontSize = '20px';
         marker.style.fontWeight = 'bold';*/
        marker.appendChild(icondiv);
        marker.appendChild(content);
        var iconOverlay = new ol.Overlay({
          element: marker,
          positioning: 'top-left',
          offset: [-40, -50],
          stopEvent: false
        });
        this.map.addOverlay(iconOverlay);
        iconOverlay.setPosition(coordinate);
      };
      /**
       * 绘制圆
       * @param x
       * @param y
       * @param radius 半径 米
       * @param layerName 图层 可以为null
       * @param islayerclear 是否清除当前绘制图层的临时绘制
       * @param isclear 是否清除地图上所有绘制图层
       */
      this.drawCircle = function (x, y, radius, layerName, islayerclear, isclear) {
        if (layerName == null) {
          layerName = 'bufferlayer';
        }
        radius = parseFloat((radius / 111000).toFixed(4));
        var layer = this.getlayerByName(layerName);
        if (layer == null) {
          layer = this.getTempVectorLayer(layerName, {create: true});
          this.polygonLayers.push(layerName);
        }
        layer.setZIndex(1);
        if (islayerclear) {
          layer.getSource().clear();
        }
        if (isclear) {//绘制前是否需要清除地图上的所有临时绘制图层
          this.clearGraphics();
        }
        var style = new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(65,105,225, 0.5)'
          })
        });

        var feature = new ol.Feature({
          geometry: new ol.geom.Circle([x, y], radius)
        });
        feature.setStyle(style);
        layer.getSource().addFeature(feature);
        var extent = feature.getGeometry().getExtent();
        if (extent) {
          this.zoomToExtent(extent, false);
        }
        this.OrderLayerZindex();
      };


      /**
       * 调整图层的顺序，保证点压线，线压面
       */
      this.OrderLayerZindex = function () {
        var self = this;
        if (this.map) {
          var layerindex = 5;
          var layers = this.map.getLayers();
          //调整面图层
          layers.forEach(function (layer) {
            var layerNameTemp = layer.get("layerName");
            if (self.polygonLayers.indexOf(layerNameTemp) >= 0) {
              layer.setZIndex(layerindex++);
            }
          }, this);
          //调整线图层
          layers.forEach(function (layer) {
            var layerNameTemp = layer.get("layerName");
            if (self.lineLayers.indexOf(layerNameTemp) >= 0) {
              layer.setZIndex(layerindex++);
            }
          }, this);
          //调整点图层
          layers.forEach(function (layer) {
            var layerNameTemp = layer.get("layerName");
            if (self.pointLayers.indexOf(layerNameTemp) >= 0) {
              layer.setZIndex(layerindex++);
            }
          }, this);
        }
      };

      /**
       * 判断地图上是否已加载图层
       */
      this.getlayerByName = function (layername) {
        var targetLayer = null;
        if (this.map) {
          var layers = this.map.getLayers();
          layers.forEach(function (layer) {
            var layernameTemp = layer.get("layerName");
            if (layernameTemp === layername) {
              targetLayer = layer;
            }
          }, this);
        }
        return targetLayer;
      };


      this.removeLayerByName = function (layerName) {
        var layer = this.getlayerByName(layerName);
        if (layer) {
          this.map.removeLayer(layer);
        }
      };

      /*
       *@param{ol.Extent} extent缩放到的范围
       *@param{bool} isanimation是否使用动画
       *@param{number} duration可选的动画时常
       * */
      this.zoomToExtent = function (extent, isanimation, duration) {
        var view = this.map.getView();
        var size = this.map.getSize();
        /**
         *  @type {ol.Coordinate} center The center of the view.
         */
        var center = ol.extent.getCenter(extent);
        if (!isanimation) {
          view.fit(extent, size, {
            padding: [350, 200, 200, 350]
          });
          view.setCenter(center);
        } else {
          if (!duration) {
            duration = 100;
            var pan = ol.animation.pan({
              duration: duration,
              source: /** @type {ol.Coordinate} */ (view.getCenter())
            });
            var bounce = ol.animation.bounce({
              duration: duration,
              resolution: view.getResolution()
            });
            this.map.beforeRender(pan, bounce);
            view.setCenter(center);
            view.fit(extent, size, {
              padding: [200, 350, 200, 350]
            });
          }
        }
      };

      //通过id高亮 显示某个要素
      this.highLightFeatureByID = function (id, layerName) {
        if (id && id.trim() !== "''") {
          var feature = this.getFeatureByID(id, layerName);
          if (feature) {
            var selectStyle = feature.get("selectStyle");
            if (selectStyle && selectStyle instanceof ol.style.Style) {
              feature.setStyle(selectStyle);
            }
          }
          return feature;
        } else {
          console.log("查询的ID不能为空");
        }
      };

      //通过id取消高亮显示某个要素,layerName可不传，不传的时候在所有图层中查询
      this.unHighLightFeatureByID = function (id, layerName) {
        var feature = this.getFeatureByID(id, layerName);
        if (feature) {
          if (feature.get("unSelectStyle") && feature.get("unSelectStyle") instanceof ol.style.Style) {
            feature.setStyle(feature.get("unSelectStyle"));
          }
        }
        return feature;
      };
      this.getAllFeatures = function (layerName) {
        var layer = this.getlayerByName(layerName);
        var features = null;
        if (layer && layer instanceof ol.layer.Vector) {
          features = layer.getSource().getFeatures();
        }
        features.forEach(function (feature) {
          if (feature && feature instanceof ol.Feature) {
            var unselectStyle = feature.get('unSelectStyle');
            if (feature.getStyle() == selectStyle) {
              if (unselectStyle && unselectStyle instanceof ol.style.Style) {
                feature.setStyle(unselectStyle);
              }
            }
          }
        });
        return features;
      };
      //返回所有高亮显示的要素
      this.getHightFeatures = function () {
        var hightFeatures = [];
        var tempLayer = this.getTempVectorLayer("tempVectorLayer");
        var features = tempLayer.getSource();
        features.forEachFeature(function (feature) {
          var scale = feature.getStyle().getImage().getScale();
          if (scale > 1.0) {
            hightFeatures.push(feature);
          }
        }, this);
        return hightFeatures;
      };

      /**
       * 清除除地图上的临时绘制要素
       * @params{Array} Ids 要素id集合
       * @params{boolean} isclear 是否清除，若为true,则根据ids清除，若为false，则是除ids集合其它全部清除
       */
      this.ClearGraphicsByIds = function (Ids, isclear) {
        if (isclear) {//根据ids清除overlay popup
          var tempIds = [];
          for (var i = 0; i < Ids.length; i++) {
            var id = Ids[i];
            var overlay = this.map.getOverlayById(id);
            if (overlay == null)
              tempIds.push(id);
            else {
              this.map.removeOverlay(overlay);
            }
          }

          //清除临时要素
          for (var j = 0; j < tempIds.length; j++) {
            var id = tempIds[j];
            var layers = appConfig.hdmap.map.getLayers();
            layers.forEach(function (layer) {
              if (layer instanceof ol.layer.Vector) {
                var targetFeature = layer.getSource().getFeatureById(id);
                if (targetFeature != null)
                  layer.getSource().removeFeature(targetFeature);
              }
            }, this);
          }

        } else {//保留ids其它全部清除
          var tempIds = [];
          var overlays = this.map.getOverlays;
          for (var i = 0; i < overlays.length; i++) {
            var overlay = overlays[i];
            if (Ids.indexOf(overlay.getId()) >= 0) {
              tempIds.push(overlay.getId());
              continue;
            }
            this.map.removeOverlay(overlay);
          }
          //临时要素
          var layers = appConfig.hdmap.map.getLayers();
          layers.forEach(function (layer) {
            var idss = [];
            var features = [];
            for (var k = 0; k < Ids.length; k++) {
              if (tempIds.indexOf(Ids[k]) < 0)
                idss.push(Ids[k]);
            }
            Ids = idss;
            if (Ids.length > 0) {
              if (layer instanceof ol.layer.Vector) {
                for (var nn = 0; nn < Ids.length; nn++) {
                  var id = Ids[nn];
                  var targetFeature = layer.getSource().getFeatureById(id);
                  if (targetFeature != null) {
                    features.push(targetFeature);
                    tempIds.push(id);
                  }
                }

              }
            }
            layer.getSource().clear;
            if (features.length > 0)
              layer.getSource().addFeatures(features);
          }, this);
        }

      };

      this.clearOverLayers = function (ids) {
        for (var i = 0; i < ids.length; i++) {
          var overlay = appConfig.hdmap.map.getOverlayById(ids[i]);
          if (overlay) {
            appConfig.hdmap.map.removeOverlay(overlay);
          }
        }

      };
      this.clearOverLayer = function (id) {
        if (id != null) {
          var overlay = appConfig.hdmap.map.getOverlayById(id);
          if (overlay) {
            appConfig.hdmap.map.removeOverlay(overlay);
          }
        }
      };

      this.changeBaseLayer = function (layerName) {
        this.map.getLayers().forEach(function (layer) {
          if (layer.get("isBaseLayer")) {
            layer.set("isCurrentBaseLayer", false);
            layer.setVisible(false);
          }
        });
        var baseLayer = this.getlayerByName(layerName);
        if (baseLayer) {
          baseLayer.setVisible(true);
          baseLayer.set("isCurrentBaseLayer", true);
          if (layerName == 'img') {//添加影像注记
            var yxlayer = this.getlayerByName('tdtyxzj');
            yxlayer.setVisible(true);
          }
        }
      };

      /*在初始化地图的时候调用，其他情况不允许调用*/
      this._addImageBaseLayer = function () {
        var layerConfig = this.getLayerConfigByName('img');
        var baseLayer = this.initTdtLayer(layerConfig);
        var imglayerConfig = {
          layerName: 'tdtyxzj',
          layer: 'cia',
          layerUrl: 'http://t0.tianditu.cn/cia_c/wmts'
        };
        var imgtitlelayer = this.initTdtLayer(imglayerConfig);
        this.map.getLayers().insertAt(0, baseLayer);
        this.map.getLayers().insertAt(1, imgtitlelayer);
      };
      /*在初始化(影像)地图的时候调用，其他情况不允许调用*/
      /*this._addImageBaseLayer = function () {
       var self = this;
       var layerConfig = this.getLayerConfigByName('img');
       if (!layerConfig || !layerConfig['layerName']) {
       sui.alert('fail', '未配置此地图!', 1500);
       console.error("未配置此地图");
       return null;
       }
       var tileArcGISXYZ = new ol.source.XYZ({//XYZ 格式的切片数据，继承自 ol.source.TileImage
       wrapX: false,//是否包含世界地图，默认true
       url: layerConfig.layerUrl + '?T=img_w&x={x}&y={y}&l={z}'
       });
       var baseLayer = new ol.layer.Tile({//基本图层：二维，影像，DOM
       isBaseLayer: true,//通用基本图层
       isCurrentBaseLayer: false,//当前通用基本图层
       layerName: layerConfig.layerName,
       source: tileArcGISXYZ,
       wrapX: false
       });
       self.map.addLayer(baseLayer);
       baseLayer.setVisible(false);
       };*/
      /*在初始化（DEM）地图的时候调用，其他情况不允许调用*/
      /*this._addDemBaseLayer = function () {
       var self = this;
       var layerConfig = this.getLayerConfigByName('ter');
       if (!layerConfig || !layerConfig['layerName']) {
       console.error("未配置此地图");
       return null;
       }
       var urlTemplate = layerConfig.layerUrl + "?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}";
       var tileArcGISXYZ = new ol.source.XYZ({//XYZ 格式的切片数据，继承自 ol.source.TileImage
       wrapX: false,//是否包含世界地图，默认true
       tileUrlFunction: function (tileCoord) {//获得给定一个瓦片地图URL坐标和投影
       var url = urlTemplate.replace('{z}', (tileCoord[0]).toString())
       .replace('{x}', tileCoord[1].toString())
       .replace('{y}', (-tileCoord[2] - 1).toString());
       return url;
       }
       });
       var baseLayer = new ol.layer.Tile({//基本图层：二维，影像，DOM
       isBaseLayer: true,//通用基本图层
       isCurrentBaseLayer: false,//当前通用基本图层
       layerName: layerConfig.layerName,
       source: tileArcGISXYZ,
       wrapX: false
       });
       baseLayer.setVisible(false);
       self.map.addLayer(baseLayer);
       };*/
      /**
       * 初始化天地图服务，支持wmmts
       * @param layerConfig{layerName,layer,layerUrl} 这三个参数为必须
       */
      this.initTdtLayer = function (layerConfig) {
        if (!layerConfig || !layerConfig['layerName']) {
          return null;
        }
        var _projection = ol.proj.get('EPSG:4326');
        var size = ol.extent.getWidth(_projection.getExtent()) / 256;
        var _resolutions = new Array(19);
        var matrixIds = new Array(19);
        for (var z = 0; z < 19; ++z) {
          // generate resolutions and matrixIds arrays for this WMTS
          _resolutions[z] = size / Math.pow(2, z);
          matrixIds[z] = z;
        }
        var layer = new ol.layer.Tile({
          isBaseLayer: true,
          isCurrentBaseLayer: true,
          layerName: layerConfig['layerName'],
          opacity: 1,
          visible: false,
          source: new ol.source.WMTS({
            url: layerConfig['layerUrl'],
            layer: layerConfig['layer'],
            matrixSet: 'c',
            format: 'tiles',
            projection: _projection,
            tileGrid: new ol.tilegrid.WMTS({
              origin: ol.extent.getTopLeft(_projection.getExtent()),
              resolutions: _resolutions,
              matrixIds: matrixIds
            }),
            style: 'default',
            wrapX: false
          })
        });
        return layer;
      };

      this.getBaseLayer = function () {
        var baseLayer = null;
        this.map.getLayers().forEach(function (layer) {
          if (layer.get("isBaseLayer") && layer.get("isCurrentBaseLayer")) {
            baseLayer = layer;
          }
        });
        if (!baseLayer) {
          console.error("获取基础底图出错!");
        }
        return baseLayer;
      };

      this.getLayerConfigByName = function (layerName) {
        var baseLayerConfig = appConfig.layerConfig.baseLayers;
        var featureLayers = appConfig.layerConfig.featureLayers;
        var layers = baseLayerConfig.concat(featureLayers);
        var layer = null;
        for (var length = layers.length, i = 0; i < length; i++) {
          layer = layers[i];
          if (layerName === layer.layerName) {
            return layer;
          }
        }
        return null;
      };
      /**
       * 将图表添加到地图上
       * @param {object} option echart option
       * @param {object} style {height:200px，widht:200px}
       * @param {Array.<number>} position [118.41, 48.82]类型的地址
       * */
      this.addChart = function (option, style, position, id) {
        if (!echarts) {
          throw new Error("请引入echart");
        }
        if (id == undefined || id == null) {
          id = util.getuuid();
        }
        var ele = document.createElement("div");
        ele.style.setProperty("height", style.height);
        ele.style.setProperty("width", style.width);
        ele.setAttribute("id", id);
        // document.body.appendChild(ele);
        var myChart = echarts.init(ele);
        myChart.setOption(option);
        var popup = new ol.Overlay({
          id: id,
          positioning: 'center-center',
          autoPan: true,
          element: ele
        });
        this.map.addOverlay(popup);
        popup.setPosition(position);
        return popup;
      };
      this.addScatter = function (element, position, id) {
        if (id == undefined || id == null) {
          id = util.getuuid();
        }
        var popup = new ol.Overlay({
          id: id,
          positioning: 'center-center',
          autoPan: true,
          element: element
        });
        this.map.addOverlay(popup);
        popup.setPosition(position);
        return popup;
      };
      /**
       * 添加面
       * */
      this.addPolygon = function (feature, params, isclear) {
        if (isclear) {
          this.removeFeatureById(params.id, params.layerName);
        }
        if (!feature) {
          return;
        }
        var layer = null;
        var geometry, Polygonfeature;
        if (params.layerName) {
          params["create"] = true;
          layer = this.getTempVectorLayer(params.layerName, params);
        } else {
          var layer = this.tempVectorLayer;
        }
        var Polygonstyle = new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(67, 110, 238, 0.4)'
          }),
          stroke: new ol.style.Stroke({
            color: '#4781d9',
            width: 2
          }),
          image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
              color: '#ffcc33'
            })
          })
        });
        if (feature.geometry.hasOwnProperty('rings')) {
          Polygonfeature = (new ol.format.EsriJSON()).readFeature(feature, {
            featureProjection: this.map.getView().getProjection()
          });
        } else {
          geometry = new ol.format.WKT().readGeometry(feature.geometry);
          Polygonfeature = new ol.Feature({
            geometry: geometry
          });
        }
        Polygonfeature.setId(params.id);
        Polygonfeature.setStyle(Polygonstyle);
        layer.getSource().addFeature(Polygonfeature);
      };
      /**
       * 清除地图上的东西
       */
      this.clearGraphics = function () {
        this.removeDrawInteraion();
        this.deactiveAll();
        this.map.getOverlays().clear();
        //thematicset.initparams();
        /*销毁文字标记中的编辑器*/
        if (this.editor) {
          this.editor.destroy();
          delete this.editor;
        }
        this.circleSerachFea = null;
        this._lastDrawInteractionGemotry = null;
        this._removeYJTitle();
        this.cleartempgraphiclayers();
        this.removeAllTileLayer();
        /*拉框搜索范围内地图不能拖动，需要禁用app.Drag*/
        this._activePointInteraction(true);
        window.ObservableObj.dispatchEvent("clearGraphics");
      };

      /**
       * 根据names集合清除地图上的临时绘制图层
       * @params{array} names 图层集合
       * @params{boolean} overlayclear 是否清除临时叠加图层
       * @params{array} saveNames 除了图层
       */
      this.clearGraphicsByLayerNames = function (names, overlayclear, saveNames) {
        if (names == undefined || names == null || names.length == 0) {
          return;
        }
        for (var i = 0; i < names.length; i++) {
          if (saveNames != undefined && saveNames != null) {
            if (saveNames.indexOf(names[i]) >= 0)
              continue;
          }
          var layer = this.getlayerByName(names[i]);
          if (layer != null) {
            layer.getSource().clear();
          }
        }
        if (overlayclear) {
          this.map.getOverlays().clear();
        }
      };
      /**
       * 根据layerName清除图层
       * */
      this.clearGraphicByLayerName = function (layerName) {
        if (layerName == undefined || layerName == null) {
          return;
        }
        var layer = this.getlayerByName(layerName);
        if (layer != null) {
          layer.getSource().clear();
        }
      };

      /**
       * 根据featureid进行清除
       */
      this.clearGraphicsByFeaturesIds = function (layerName, ids) {
        layerName = layerName.toUpperCase();
        if (ids == null || ids.length == 0)
          return;
        var layer = this.getlayerByName(layerName);
        if (layer != null) {
          var source = layer.getSource();
          for (var i = 0; i < ids.length; i++) {
            var feature = layer.getSource().getFeatureById(ids[i]);
            if (feature == null)
              continue;
            layer.getSource().removeFeature(feature);
          }
        }
      };

      /**
       * 清除临时绘制图层
       */
      this.cleartempgraphiclayers = function () {
        if (this.map) {
          var layers = this.map.getLayers();
          if (layers) {
            layers.forEach(function (layer) {
              if (layer instanceof ol.layer.Vector) {
                if (layer.getSource() && layer.getSource().clear) {
                  layer.getSource().clear();
                }
              }
            }, this);
          }
        }
        this.tempAddline = [];
      };

      /*使所有工具处于非激活状态
       * */
      this.deactiveAll = function () {
        for (var key in this.mapTools) {
          if (typeof this.mapTools[key] == 'boolean')
            this.mapTools[key] = false;
        }
        this.removeDrawInteraion();
        if (this.plotDraw) {
          this.plotDraw.deactivate();
          this.plotEdit.deactivate();
        }
      };

      /**保存标绘方案*/
      this.savePlotDraw = function () {
        var self = this;
        if (appConfig.currentWarnId) {
          var plotDrowData = [];
          var plotDrawLayer = self.getlayerByName(appConfig.layerConfig.tempLayer.plotDrawLayer);
          if (plotDrawLayer) {
            /**应急处置的标题*/
            var yjTitle = $("#yingjiTitle").text();
            plotDrawLayer.getSource().forEachFeature(function (fea) {
              var targetFea, targetPoints = [];
              if (fea.getGeometry() instanceof ol.geom.Point) {
                targetPoints.push({
                  x: fea.getGeometry().getCoordinates()[0],
                  y: fea.getGeometry().getCoordinates()[1]
                });
                var params = fea.get("params");
                if (!params) {
                  params = fea.getGeometry().get("params");
                }
                if (!params) {
                  console.error("无法获取保存标绘要素的参数信息");
                }
                var featureType = params.featureType;
                if (!featureType) {
                  featureType = params.type;
                }
                if (!featureType) {
                  console.error("无法获取保存标绘要素的参数信息");
                }
                targetFea = {
                  action: appConfig.markConfig.getMarkConfig(featureType).actionCode,
                  points: targetPoints,
                  mark: yjTitle,
                  fk_event: appConfig.currentWarnId,
                  action_describe: "描述文字"
                };
              } else {
                var feaPoints = fea.getGeometry().points;
                var length = feaPoints.length;
                var style = fea.getStyle();
                if (!style) {
                  style = plotDrawLayer.getStyle()
                }
                var geoStyle = {
                  fillOpacity: style.getFill().getColor(),
                  lineWidth: style.getStroke().getWidth(),
                  lineColor: style.getStroke().getColor()
                };
                for (var m = 0; m < length; m++) {
                  targetPoints.push({
                    x: feaPoints[m][0],
                    y: feaPoints[m][1]
                  });
                }
                var featureType = fea.getGeometry().get("params").featureType;
                if (!featureType) {
                  featureType = fea.getGeometry().get("params").type;
                }
                if (!featureType) {
                  featureType = fea.get("params").featureType;
                }
                if (!featureType) {
                  featureType = fea.get("params").type;
                }
                if (!featureType) {
                  console.error("标绘类型缺失");
                }
                targetFea = {
                  action: appConfig.markConfig.getMarkConfig(featureType).actionCode,
                  points: targetPoints,
                  geoStyle: geoStyle,
                  mark: yjTitle,
                  fk_event: appConfig.currentWarnId,
                  action_describe: "描述文字"
                };
              }
              plotDrowData.push(targetFea);
            });
            var overlays = self.map.getOverlays();
            var targetOverlays = [];
            overlays.forEach(function (overlay) {
              if (overlay.get("isEditorContainer")) {
                var content = overlay.getElement().editor.$txt.html();
                var points = {
                  x: overlay.getPosition()[0],
                  y: overlay.getPosition()[1]
                };
                var targetFea = {
                  action: appConfig.markConfig.getMarkConfig("气泡").actionCode,
                  points: [points],
                  mark: content,
                  fk_event: appConfig.currentWarnId,
                  action_describe: ""
                };
                plotDrowData.push(targetFea);
              }
            });
          }
          if (plotDrowData.length > 0) {
            $.ajax({
              url: appConfig.webapp + "/plotOperationRest/addPlots/" + appConfig.currentWarnId,
              //url: "http://127.0.0.1:8085/tnms-webapp/plotOperationRest/addPlots/" + appConfig.currentWarnId,
              type: "post",
              contentType: "application/json",
              data: JSON.stringify(plotDrowData),
              success: function (data) {
                window.hdsxRootScope.$broadcast(broadcastNameEnum.alertWindowShow, {
                  flag: true,
                  data: {
                    title: "提示",
                    content: "保存预警处置成功"
                  }
                });//重新加载预警
              }, error: function (err) {
                console.error("保存标绘失败：", err);
                window.hdsxRootScope.$broadcast(broadcastNameEnum.alertWindowShow, {
                  flag: true, data: {
                    title: "提示",
                    content: "保存预警处置失败!"
                  }
                });
              }
            })
          }
        }
      };

      /**
       * 还原标绘方案中的标绘制。
       * @parmar id 应急id
       * */
      this.reDrawPlotDraw = function (fk_eventID) {
        try {
          var features = [];
          var self = this;
          $.ajax({
            url: appConfig.webapp + "/plotOperationRest/getPlots/" + fk_eventID,
            type: "get",
            dataType: 'json',
            contentType: "application/json",
            success: function (data) {
              var dataLength = data.length;
              /*添加标题*/
              if (dataLength > 0) {
                for (var m = 0; m < dataLength; m++) {
                  var type = data[m].action;
                  if (type && type.substr(0, 2) !== "02") {
                    self.addYJTitle(data[m].mark);
                    break;
                  }
                }
              }
              var features = [];
              for (var n = 0; n < dataLength; n++) {
                var datan = data[n];
                var actionLocation = eval(datan.action_location);
                var fea = null, points = [];
                for (var j = actionLocation.length, k = 0; k < j; k++) {
                  points.push([Number(actionLocation[k].x), Number(actionLocation[k].y)]);
                }
                //标记点都标记到plotDrawLayer中，以便对要素进行符号化
                var action = data[n].action;
                /*标绘类型的编码，在appConfig中可找到对应项*/
                var plotConfig = appConfig.markConfig.getPlotConfigByActionCode(action);
                if (action && action.substr(0, 2) == "01") {/*点要素*/
                  fea = new ol.Feature({
                    geometry: new ol.geom.Point([actionLocation[0].x, actionLocation[0].y]),
                    params: {
                      moveable: true,
                      isPlot: true,
                      featureType: appConfig.markConfig.getPlotConfigByActionCode(action).type,
                      layerName: appConfig.layerConfig.tempLayer.plotDrawLayer
                    }
                  });
                } else if (action && action.substr(0, 2) == "02") {/*气泡*/
                  var content = datan.mark;
                  self._addTextPopup([Number(actionLocation[0].x), Number(actionLocation[0].y)], content);
                } else if (action && action.substr(0, 2) == "03") { /*军标*/
                  var plot = P.PlotFactory.createPlot(eval(plotConfig.plotType), points);
                  plot.generate();
                  fea = new ol.Feature({
                    geometry: plot,
                    params: {
                      moveable: true,
                      isPlot: true,
                      featureType: appConfig.markConfig.getPlotConfigByActionCode(action).type,
                      layerName: appConfig.layerConfig.tempLayer.plotDrawLayer
                    }
                  });
                }
                if (fea) {
                  features.push(fea);
                }
              }
              self.getTempVectorLayer(appConfig.layerConfig.tempLayer.plotDrawLayer, {create: true}).getSource().addFeatures(features);
            }, error: function (err) {
              console.error("还原标绘失败!");
            }
          })
        } catch (e) {
          console.error(e);
        }
      };

      /*添加应急标绘标题*/

      this.addYJTitle = function (title) {
        if (!title) {
          return;
        }
        var yjtitle = document.getElementById("yingjiTitle");
        if (!yjtitle) {
          /*id='yingjiTitle' 不要修改和删除*/
          yjtitle = document.getElementById("yingjiTitle");
          if (!yjtitle) {
            yjtitle = "<div id='yingjiTitle'" +
              "contenteditable='true' style='position: absolute;left:430px;right:400px;" +
              "top: 85px;font-size: 30px;background-color:#fff;font-family:SimHei;opacity:0.7;text-align: center;z-index: 1'>" +
              "<p contenteditable='true' style='border-width: 1px;margin: 0 auto;'>请输入标题</p></div>";
            yjtitle = yjtitle.replace("请输入标题", title);
            $(document.body).append(yjtitle);
          }
        }
        $("#yingjiTitle").find("p").text(title);
      };
      /*删除应急标绘标题*/
      this._removeYJTitle = function () {
        if ($("#yingjiTitle"))
          $("#yingjiTitle").remove();
      };

      /**
       * 打印地图
       */
      this.printMap = function () {
        ol.util.print();
      };

      /**
       * 将地图保存为图片
       */
      this.saveMapToImage = function () {
        var exportPNGElement = document.getElementById('export-png');
        this.map.once('postcompose', function (event) {
          var canvas = event.context.canvas;
          exportPNGElement.href = canvas.toDataURL('image/png');
        });
        this.map.renderSync();
      };

      /**
       * 全图
       */
      this.zoomMaxExtent = function () {
        //
        this.deactiveAll();
        this.map.getView().setCenter(appConfig.mapConfig.center);
        this.map.getView().setZoom(appConfig.mapConfig.zoom);
      };

      this.activeTool = function (toolType, params) {
        this.deactiveAll();
        if (this.addPointHandlerClick) {
          ol.Observable.unByKey(this.addPointHandlerClick);
        }
        var self = this;
        if (this.mapTools.hasOwnProperty(toolType)) {
          this.mapTools[toolType] = true;
          if (toolType === this.mapTools.toolsType.measureLength) {
            self.measureLengthClick = self.map.on("singleclick", function (event) {
              self.measureLengthClick.clickCount += 1;
              if (self.mapTools.measureLength) {
                if (self.measureLengthClick.clickCount == 1) {
                  self.drawSketch.length = "起点";
                }
                self._addMeasureOverLay(event.coordinate, self.drawSketch.length);
              }
            });
            self.measureLengthClick.clickCount = 0;
            this.addDrawInteraction("LineString", {
              featureType: "长度"
            });
            /*设置鼠标光标样式*/
            this.map.getTargetElement().style.cursor = "url(images/map/cur/ruler.cur), default";
            /*当鼠标移动时的一些处理*/
            this.beforeMeasurePointerMoveHandler = this.map.on('pointermove', this._beforeDrawPointMoveHandler, this);
          } else if (toolType === this.mapTools.toolsType.measureArea) {
            this.createMeasureAreaTooltip();
            /*设置鼠标光标样式*/
            this.map.getTargetElement().style.cursor = "url(images/map/cur/ruler.cur), default";
            self.measureAreaClick = self.map.on("singleclick", function (event) {
              self.measureAreaClick.clickCount += 1;
              if (self.mapTools.measureLength) {
                if (self.measureAreaClick.clickCount == 1) {
                  self.drawSketch.length = "起点";
                }
                self._addMeasureOverLay(event.coordinate, self.drawSketch.length);
              }
            });
            self.measureAreaClick.clickCount = 0;
            this.addDrawInteraction("Polygon", {
              featureType: "面积"
            });
          }
          else if (toolType === this.mapTools.toolsType.drawLine) {
            this.addDrawInteraction("LineString");
          } else if (toolType === this.mapTools.toolsType.drawPolygon) {
            this.addDrawInteraction("Polygon", params);
          } else if (toolType === this.mapTools.toolsType.zoomIn) {
            this.zoomIn();
          } else if (toolType === this.mapTools.toolsType.zoomOut) {
            this.zoomOut();
          } else if (toolType === this.mapTools.toolsType.addPoint) {
            self.addPointHandlerClick = self.map.once("singleclick", function (event) {
              self.addPoint({
                geometry: event.coordinate
              }, params);
            });
          } else if (toolType === this.mapTools.toolsType.iQuery) {
            this.queryparams = params;
          } else if (toolType === this.mapTools.toolsType.addTitle) {
          } else if (toolType === this.mapTools.toolsType.addTextArea) {
            this.mapTools.addTextArea = true;
          } else if (toolType === this.mapTools.toolsType.drawPlot) {
            if (!self.plotEdit) {
              self.plotDraw = new P.PlotDraw(self.map);
              self.plotEdit = new P.PlotEdit(self.map);
              self.plotDraw.on(P.Event.PlotDrawEvent.DRAW_END, function (event) {
                var feature = event.feature;
                self.setLastDrawInteractionGemotry(feature.getGeometry().clone());
                self.plotEdit.activate(feature);
                self.getTempVectorLayer(appConfig.layerConfig.tempLayer.plotDrawLayer, {create: true}).getSource().addFeature(feature);
                window.ObservableObj.set("PlotFeature", feature);
                window.ObservableObj.dispatchEvent("PlotFeatureEvt");

              }, false, self);
            }
            self.plotEdit.deactivate();
            self.plotDraw.activate(eval(params.plotType), params);
          } else if (toolType === this.mapTools.toolsType.drawSquare) {
            this.addDrawInteraction("Square", params);
          } else if (toolType === this.mapTools.toolsType.drawBox) {
            this.addDrawInteraction("drawBox", params);
          } else if (toolType === this.mapTools.toolsType.ljQuery) {
            this.queryparams = params;
            ol.Observable.unByKey(self.addPointHandlerClick);//移除对key的监听
            self.addPointHandlerClick = self.map.on("singleclick", function (event) {
              if (self.mapTools.ljQuery) {
                self.addPoint({
                  geometry: event.coordinate
                }, params);
              }
            });
          } else if (toolType === this.mapTools.toolsType.showMark) {
            this.queryparams = params;
            ol.Observable.unByKey(self.addPointHandlerClick);//移除对key的监听
            self.addPointHandlerClick = self.map.on("singleclick", function (event) {
              if (self.mapTools.showMark) {
                self.showMarkPopup({
                  width: "280px",
                  height: "200px",
                  title: "添加标记",
                  showMarkFea: true,
                  content: params,
                  coordinate: event.coordinate
                })
              }
            });
          } else if (toolType === this.mapTools.toolsType.showzhMark) {
            this.queryparams = params;
            ol.Observable.unByKey(self.addPointHandlerClick);//移除对key的监听
            self.addPointHandlerClick = self.map.on("singleclick", function (event) {
              if (self.mapTools.showzhMark) {
                self.showMarkPopup({
                  width: "280px",
                  height: "170px",
                  title: "桩号定位",
                  showMark: false,
                  content: params,
                  coordinate: event.coordinate,
                  imgData: 'images/marker/img_zhuanghaodingwei.png'
                })
              }
            });
          }
        }
        if (this.mapTools.drawBox || this.mapTools.measureLength || this.mapTools.measureArea) {
          this._activePointInteraction(false);
        } else {
          this._activePointInteraction(true);
        }
      };

      /**
       * 使某个工具处于激活状态
       * @param {HDMap.mapTools.toolsType} toolType 具体的工具
       * */
      this.deactiveTool = function (toolType) {
        if (this.mapTools[toolType]) {
          this.mapTools[toolType] = false;
        } else {
          console.error("没有这种工具");
        }
      };

      /**************************************
       * 专题图测试 2016-3-2
       **************************************/
      /**
       * 测试热力图
       * @param layerName
       * @param year 年份
       */
      this.testheat = function (layerName, year) {
        this.clearGraphics();
        var feature = thematicset.xzqhparams['360800'];
        var geometry = new ol.format.WKT().readGeometry(feature.geometry);
        var extent = geometry.getExtent();
        //100个热力点作为测试
        var heatlayerName = layerName + "_" + year;
        var count = 100;
        for (var i = 0; i < count; i++) {
          this.createheatpointintofeature(heatlayerName, extent, geometry);
        }
      };

      /**
       * 随机插值
       */
      this.createheatpointintofeature = function (heatlayerName, extent, geometry) {
        var ptx = util.getrandom(extent[0], extent[2], 6);//x坐标
        var pty = util.getrandom(extent[1], extent[3], 6);//y坐标
        if (this.isinside(geometry, [ptx, pty])) {
          var heatlayer = this.getlayerByName(heatlayerName);
          if (heatlayer == null)
            heatlayer = this.initthematiclayer(heatlayerName);
          var pointfeature = new ol.Feature({
            geometry: new ol.geom.Point([ptx, pty])
          });
          heatlayer.getSource().addFeature(pointfeature);
        } else {
          this.createheatpointintofeature(heatlayerName, extent, geometry);
        }
      };

      this.AddHeatFeatures = function (layerName, features) {
        var heatlayer = this.getlayerByName(layerName);
        if (heatlayer == null)
          heatlayer = this.initthematiclayer(layerName);
        heatlayer.getSource().clear();
        for (var i = 0; i < features.length; i++) {
          var feature = features[i];
          if (!feature.geometry) {
            continue;
          }
          var feat = new ol.Feature({
            geometry: new ol.format.WKT().readGeometry(feature.geometry)
          });
          heatlayer.getSource().addFeature(feat);
        }
      };

      /**
       * 初始化热力专题图
       */
      this.initthematiclayer = function (layerName, blur, radius) {
        if (blur == undefined || blur == null) {
          blur = 8;
        }
        if (radius == undefined || radius == null) {
          radius = 5;
        }
        var layer = new ol.layer.Heatmap({
          layerName: layerName,
          gradient: ['#00f', '#0ff', '#0f0', '#ff0', '#f00'],
          source: new ol.source.Vector({}),
          blur: blur,
          radius: radius
        });
        layer.setVisible(true);
        if (this.map && layer) {
          this.map.addLayer(layer);
        }
        return layer;
      };

      /**
       * 根据范围绘制点密度图（插值点随机）
       * @param feature 插值区域
       * @param desitycount 插值个数
       */
      this.drawdensitypoints = function (feature, desitycount) {
        var geometry = new ol.format.WKT().readGeometry(feature.geometry);
        var extent = geometry.getExtent();
        for (var i = 0; i < desitycount; i++) {
          this.createpointintofeature(extent, geometry);
        }
      };

      this.createpointintofeature = function (extent, geometry) {
        var ptx = util.getrandom(extent[0], extent[2], 6);//x坐标
        var pty = util.getrandom(extent[1], extent[3], 6);//y坐标
        if (this.isinside(geometry, [ptx, pty])) {
          var layer = this.getlayerByName('densitylayer');
          if (layer == null) {
            layer = this.getTempVectorLayer('densitylayer', {create: true});
          }
          var feature = new ol.Feature({
            geometry: new ol.geom.Point([ptx, pty])
          });
          var imgURL = appConfig.markConfig.getMarkConfig('densityPoint').imgURL;
          var iconStyle = new ol.style.Style({
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
              anchor: [0.5, 25],
              anchorXUnits: 'fraction',
              anchorYUnits: 'pixels',
              opacity: 0.75,
              src: imgURL
            }))
          });
          feature.setStyle(iconStyle);
          layer.getSource().addFeature(feature);
        } else {
          this.createpointintofeature(extent, geometry);
        }
      };

      /**
       * 判断点是否在多边形内
       */
      this.isinside = function (geometry, point) {
        var extent = geometry.getExtent();
        return ol.extent.containsXY(extent, point[0], point[1]);
      };

      this.createSreachCircle = function (obj, radius) {
        var self = this;
        if (!radius) {
          radius = 5000;
        }
        var style = new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(65,105,225, 0.5)'
          })
        });
        var config = {
          radius: radius,
          maxRadius: 500000,
          map: this.map,
          layerName: appConfig.layerConfig.tempLayer.perimeterSerach,
          style: style
        };
        if (config.radius > config.maxRadius) {
          config.radius = config.maxRadius
        }

        obj = $.extend(config, obj);
        if (!this.circleSerachFea) {
          self.circleSerachFea = P.Plot.Circle.createCircleByCenterRadius(obj);
          var extent = self.circleSerachFea.feature.getGeometry().getExtent();
          self.zoomToExtent(extent);
        } else {
          this.circleSerachFea.setCenter(obj.center);
          this.circleSerachFea.setRadius(obj.radius);
        }
        var circle = new ol.geom.Circle({
          center: self.circleSerachFea.getCircle().getCenter(),
          radius: self.circleSerachFea.getCircle().getRadius()
        });
        self.setLastDrawInteractionGemotry(circle);
        return self.circleSerachFea;
      };

      /*想要移除的要素的类型，如果为空，则移除所有要素,赋给feature的layerName*/
      this.removePerimeterSreach = function (obj) {
        var vectorLayer = this.getTempVectorLayer(appConfig.layerConfig.tempLayer.perimeterSerach);
        if (vectorLayer) {
          var source = vectorLayer.getSource();
          var features = source.getFeatures();
          if (obj && obj.layerNames) {
            for (var length = features.length, i = 0; i < length; i++) {
              if ($.isArray(obj.layerNames)) {
                $(obj.layerNames).each(function (index, itemLayerName) {
                  if (features[i].get("layerName") == itemLayerName) {
                    source.removeFeature(features[i]);
                  }
                });
              } else {
                if (features[i].get("layerName") == obj.layerNames) {
                  source.removeFeature(features[i]);
                }
              }
            }
          } else {
            if (obj && obj.keepCircle) {
              if (this.circleSerachFea) {
                var layer = this.getLayerByFeatuer(this.circleSerachFea);
                if (layer) {
                  var source = layer.getSource().getFeatures();
                  for (var length = source.length, m = 0; m < length; m++) {
                    var fea = source[m];
                    if (fea !== this.circleSerachFea) {
                      source.removeFeature(fea)
                    }
                  }
                }
              }
            } else {
              if (this.circleSerachFea) {
                this.circleSerachFea.destroy();
                this.circleSerachFea = null;
              }
            }
          }
        }
      };

      /*应急标绘制调用，用来绘制文本气泡*/
      this._addTextPopup = function (coordinate, content) {
        var self = this;
        require(["wangEditor"], function (wangEditor) {
          setTimeout(function () {
            var randomID = "holdeditor" + Math.floor(Math.random() * Math.random() * 1000000);
            self.mapTools.addTextArea = false;
            var textArea = document.createElement('div');
            /*textAreaOvarLay与textArea的宽度差2个像素*/
            var width = 198;
            var textAreaOvarLay = new ol.Overlay.Popup({
              id: randomID,
              width: width + "px",
              height: "auto",
              offset: [-110, -70]
            });
            self.map.addOverlay(textAreaOvarLay);
            $("#" + randomID).css("height", "auto");
            textAreaOvarLay.show(coordinate, textArea);
            textAreaOvarLay.set("isEditorContainer", true);
            textArea.setAttribute("id", randomID);
            textArea.style.height = "32px";
            textArea.style.width = width + 2 + "px";
            wangEditor.config.printLog = false;
            // 自定义菜单
            wangEditor.config.menus = ['bold', 'italic', 'fontsize', 'bgcolor', 'myclose'];
            var popupElement = textAreaOvarLay.getElement();
            popupElement.editor = new wangEditor(randomID);
            popupElement.editor.keyId = randomID;
            var currentHeight = 22;
            // 配置 onchange 事件
            popupElement.editor.onchange = function () {
              textAreaOvarLay.updateSize();
              if (currentHeight - $("#" + randomID).height() !== 0) {
                var tempoffset = textAreaOvarLay.getOffset();
                textAreaOvarLay.setOffset([tempoffset[0], tempoffset[1] - ($("#" + randomID).height() - currentHeight)]);
                currentHeight = $("#" + randomID).height();
              }
            };
            popupElement.editor.create();
            textArea.style.height = "auto";
            if (content) {
              popupElement.editor.$txt.html(content);
            }
            textAreaOvarLay.updateSize();
            $("#" + randomID).css("height", "auto");
            $(popupElement).on("click", function (event) {
              if (popupElement.editor.isDestroy) {
                popupElement.editor.undestroy();
                textAreaOvarLay.updateSize();
                /*33.4为菜单栏(包含border)，20.8为小三角*/
                textAreaOvarLay.setOffset([-110, -33.4 - 20.8 + 4 - $("#" + randomID).height()]);
                $(popupElement).find("p").parent().focus();
                popupElement.editor.isDestroy = false;
              }
            });
          }, 200);
        });
      };

      this._clearPlotGraphics = function (removeCircle) {
        var self = this;
        var layer = this.getlayerByName(appConfig.layerConfig.tempLayer.plotDrawLayer);
        if (layer) {
          layer.getSource().clear(true);
        }
        var overlays = this.map.getOverlays().getArray();
        for (var len = overlays.length, m = 0; m < len; m++) {
          var overlay = overlays[m];
          if (overlay && overlay.get("isEditorContainer")) {
            self.map.removeOverlay(overlay);
            m--;
          }
        }
        this._removeYJTitle();
      };
      /*将周边搜索的要素添加到应急标绘中去*/
      this.addPlotFeaFromPerimeterSearch = function (fea) {
        var plotDrawLayer = this.getTempVectorLayer(appConfig.layerConfig.tempLayer.plotDrawLayer, {create: true});
        var feature = fea.clone();
        var layerName = fea.get("layerName");
        var config = appConfig.markConfig.getMarkConfigByetype(layerName);
        config.layerName = layerName;
        config.isPlot = true;
        feature.set("params", config);
        plotDrawLayer.getSource().addFeature(feature);
        this.removeFeature(fea);
      };

      this.removeSomeFeature = function (fromStateName, toStateName) {
        /*不是周边搜索页面则清空周边搜索页面结果*/
        if ("app.composite.yjDetail" !== toStateName && "app.composite.plot" !== toStateName) {
          this._removeYJTitle();
        }
        if ("app.composite.plot" == toStateName) {
          if (this.circleSerachFea) {
            this.circleSerachFea.destroy();
            this.circleSerachFea = null;
          }
          this.removeLayerByName(appConfig.layerConfig.tempLayer.perimeterSerach);
        }
        if ("app.composite.warnDetail" == toStateName) {
          window.addTitleTimer = setInterval(function () {
            if (appConfig.yjTitle) {
              window.clearInterval(window.addTitleTimer);
              appConfig.hdmap.addYJTitle(appConfig.yjTitle);
            }
          }, 500);
          if (appConfig.currentWarnId) {
            var lay = appConfig.hdmap.getTempVectorLayer(appConfig.layerConfig.tempLayer.plotDrawLayer);
            if (lay) {
              lay.getSource().clear();
            }
            appConfig.hdmap.reDrawPlotDraw(appConfig.currentWarnId);
          }
        }
      };

      this.getFeatureByWarnOverlayID = function (id) {
        var feature = null;
        var overlay = this.getWarnOverlay(id);
        if (overlay) {
          var properties = overlay.getProperties();
          feature = new ol.Feature({
            geometry: new ol.format.WKT().readGeometry(properties.geometry)
          });
          feature.setProperties(properties.attributes);
        }
        return feature;
      };


      this.getWarnOverlay = function (id) {
        var overLay = this.map.getOverlayById(id);
        if (overLay && overLay.get("type") == "warn") {
          return overLay;
        } else {
          return null;
        }
      };

      this.removeWarnOverlay = function (id) {
        var overlay = this.map.getOverlayById(id);
        if (overlay) {
          this.map.removeOverlay(overlay);
        }
      };

      /**
       * 清除预警
       */
      this.clearWarnOvers = function () {
        var overLay = this.map.getOverlays().getArray();
        for (var i = 0; i < overLay.length; i++) {
          var obj = overLay[i];
          if (obj.get("type") === "warn") {
            this.map.removeOverlay(obj);
          }
        }
      };
      /**
       * 获取预警要素
       */
      this.getWarnOverlays = function () {
        var warnOverlays = [];
        var overLay = this.map.getOverlays().getArray();
        for (var i = 0; i < overLay.length; i++) {
          var obj = overLay[i];
          if (obj.get("type") == "warn") {
            warnOverlays.push(obj);
          }
        }
        return warnOverlays;
      };

      this.getFeatureByID = function (id, layerName) {
        var tempLayer = null, feature = null;
        if (id && id.trim() !== "''") {
          if (layerName) {
            tempLayer = this.getTempVectorLayer(layerName);
            if (tempLayer && tempLayer.getSource && typeof tempLayer.getSource == "function") {
              var source = tempLayer.getSource();
              if (source.getFeatureById && typeof source.getFeatureById == "function") {
                feature = tempLayer.getSource().getFeatureById(id);
              }
            }
          } else {
            var layers = this.map.getLayers();
            layers.forEach(function (layer) {
              if (layer.getSource && typeof layer.getSource == "function") {
                if (!feature) {
                  var source = layer.getSource();
                  if (source.getFeatureById && typeof source.getFeatureById == "function") {
                    feature = layer.getSource().getFeatureById(id);
                  }
                }
              }
            });
          }
          return feature;
        } else {
          console.log("查询的ID不能为空");
        }
      };

      this._activePointInteraction = function (b) {
        var interactions = this.map.getInteractions();
        if (b) {
          var hasAppDrag = false;
          var tempInteractions = interactions.getArray();
          var length = tempInteractions.length;
          for (var m = 0; m < length; m++) {
            var tempInteraction = tempInteractions[m];
            if (tempInteraction && tempInteraction.customType && tempInteraction.customType == "appDrag") {
              hasAppDrag = true;
              break;
            }
          }
          if (!hasAppDrag) {
            this.map.addInteraction(new app.Drag());
          }
        } else {
          var tempInteractions = interactions.getArray();
          var length = tempInteractions.length;
          for (var m = 0; m < length; m++) {
            var tempInteraction = tempInteractions[m];
            if (tempInteraction && tempInteraction.customType && tempInteraction.customType == "appDrag") {
              this.map.removeInteraction(tempInteraction);
              tempInteraction = null;
              break;
            }
          }
        }
      };
      this.getMouseCursor = function (type) {
        var cursor = "default";
        if (type == "测距") {
          cursor = "url(http://127.0.0.1:8084/tnmsweb/dist/images/cur/meareArea.cur)";
        }
        return cursor;
      };

      /*********对路段插值计算***********/
      /**
       * 根据桩号和线段的空间数据进行插值计算，返回坐标信息
       * @params start<num> end<num> line<Obj>
       * */
      this.matchCoordinate = function (start, end, line, step) {
        var coords = line.getGeometry().getCoordinates();
        var startPoint = coords[0], endPoint = coords[coords.length - 1];
        var length = this.getLength(coords);
        //获取每段长度和总长度
        var lengths = length.lengths;
        var lengthAll = length.lengthAll;
        //获取每一桩号代表的长度
        var each = lengthAll / (end - start);
        //获取每一步的长度
        var stepLength = each * step;
        var stepCoor = [startPoint];
        this.mathCoor(stepLength, stepCoor, coords, lengths)
        /*******最后对坐标进行合并********/
        //this.testMathCoor(stepCoor);
        stepCoor.push(endPoint);
        return stepCoor;
      };
      /**
       * 根据坐标获取长度
       * @params coords<arr>
       * @return lengths<arr> lengthAll<num>
       * */
      this.getLength = function (coords) {
        var lengths = [], lengthAll = null;
        var sourceProj = this.map.getView().getProjection();
        for (var i = 0, ii = coords.length - 1; i < ii; ++i) {
          var attr = null;
          var c1 = ol.proj.transform(coords[i], sourceProj, 'EPSG:4326');
          var c2 = ol.proj.transform(coords[i + 1], sourceProj, 'EPSG:4326');
          attr = this.wgs84Sphere.haversineDistance(c1, c2);
          lengths.push(attr);
          lengthAll += attr;
        }
        return {
          lengths: lengths,
          lengthAll: lengthAll
        }
      };
      this.mathCoor = function (stepLength, stepCoor, coords, lengths) {
        for (var i = 0; i < coords.length - 1; i++) {
          var s1 = coords[i], s2 = coords[i + 1];
          //var stepCoorX = Math.abs((s2[0] - s1[0]) / lengths[i] * stepLength);
          var stepCoorX = (s2[0] - s1[0]) / lengths[i] * stepLength;
          //var stepCoorY = Math.abs((s2[1] - s1[1]) / lengths[i] * stepLength);
          var stepCoorY = (s2[1] - s1[1]) / lengths[i] * stepLength;
          //分段计算
          for (var j = 0; j < Math.round(lengths[i] / stepLength); ++j) {
            var nextCoor = [];
            if (j > (lengths[i] / stepLength)) {
              nextCoor = [coords[i]];
            } else {
              nextCoor = [stepCoorX * j + coords[i][0], stepCoorY * j + coords[i][1]];
            }
            stepCoor.push(nextCoor);
          }
        }
      };
      /**
       * 测试插值后的数据是否合格
       * @params array<arr>
       * */
      this.testMathCoor = function (array) {
        var geometry = "LINESTRING (";
        for (var i = 0; i < array.length; i++) {
          if (i == array.length - 1) {
            geometry += array[i][0] + " " + array[i][1] + ")";
          } else {
            geometry += array[i][0] + " " + array[i][1] + ",";
          }
        }
        var lineString = {
          geometry: geometry
        };
        var linefeature = new ol.Feature({
          geometry: new ol.format.WKT().readGeometry(lineString.geometry)
        });
        var extent = linefeature.getGeometry().getExtent();
        this.tempAddline.push([[extent[0], extent[1]], [extent[2], extent[3]]]);
        this.zoomToExtent(extent, false);
        var layer = this.getTempVectorLayer("testMathCoor", {create: true});
        var lineStyle = new ol.style.Style({
          stroke: new ol.style.Stroke({
            width: 4,
            color: "red"
          })
        });
        linefeature.setStyle(lineStyle);
        layer.getSource().addFeature(linefeature);
      };

      /**
       * 读取esriLine空间数据,返回数据范围
       * @params fearures<obj>
       * */
      this.readEsriLineExtent = function (features) {
        var geometry = null;
        if (features && features.length > 0) {
          var tempLine = new ol.geom.MultiLineString([]);
          for (var i = 0; i < features.length; i++) {
            var _feat = features[i];
            if (_feat.geometry.hasOwnProperty('paths')) {
              var feat = {
                'type': 'Feature',
                'geometry': {
                  'type': 'MultiLineString',
                  'coordinates': _feat.geometry.paths
                }
              };
              geometry = (new ol.format.GeoJSON()).readFeature(feat).getGeometry();
            } else {
              geometry = new ol.format.WKT().readGeometry(_feat.geometry);
            }
            tempLine.appendLineString(geometry);
          }
          if (tempLine.getLineStrings().length > 0) {
            var extent = tempLine.getExtent();
            var bExtent = true;
            for (var m = 0; m < 4; m++) {
              if (extent[m] == Infinity || extent[m] == NaN) {
                bExtent = false;
                break;
              }
            }
            if (bExtent) {
              this.zoomToExtent(extent, true);
            }
          }
        }
      };
      /**
       * 清除叠加图层
       * @param layerName
       */
      this.removeTileLayer = function (layerName) {
        var self = this;
        if (this.map) {
          var layers = this.map.getLayers();
          layers.forEach(function (layer) {
            var titleTemp = layer.get("layerName");
            if (titleTemp === layerName) {
              self.map.removeLayer(layer);
            }
          }, this);
        }
      };
      /**
       * 清除所有的TileArcGISRest图层
       * @params null
       * */
      this.removeAllTileLayer = function () {
        var self = this;
        if (this.map) {
          var layers = this.map.getLayers();
          layers.forEach(function (layer) {
            if (layer.get('isImageType')) {
              self.map.removeLayer(layer);
            }
          }, this);
        }
      };
      /**********2016.10.26新增*********/
      /**
       * 预警详情自定义样式
       * */
      this.setRangePointStyle = function (point) {
        return domtoimage.toPng(document.querySelector("#warningPoint")).then(function (dataUrl) {
          var unSelectStyle = new ol.style.Style({
            image: new ol.style.Icon({
              anchor: [0.5, 0.5],
              anchorXUnits: 'fraction',
              anchorYUnits: 'fraction',
              opacity: 0.65,
              src: dataUrl
            })
          });
          var selecstyle = new ol.style.Style({
            image: new ol.style.Icon({//标绘点的样式
              anchor: [0.5, 0.5],
              anchorXUnits: 'fraction',
              anchorYUnits: 'fraction',
              opacity: 1,
              src: dataUrl
            })
          });
          point.set('selectStyle', selecstyle);
          point.set('unSelectStyle', unSelectStyle);
          // 应用具有不规则几何图形的样式到Feature
          point.setStyle(unSelectStyle);
          return dataUrl;
        });
      };
      /**
       * 判断气泡是否在地图范围内
       * @params overlay,coordinate,duration
       * */
      this.panIntoView_ = function (overlay, coordinate, duration) {
        var self = this;
        var popSize = {
            width: overlay.getElement().clientWidth + 20,
            height: overlay.getElement().clientHeight + 20
          },
          mapSize = self.map.getSize();
        var tailHeight = 40,
          tailOffsetLeft = 60,
          tailOffsetRight = popSize.width - tailOffsetLeft,
          popOffset = overlay.getOffset(),
          popPx = self.map.getPixelFromCoordinate(coordinate);

        var fromLeft = (popPx[0] - tailOffsetLeft),
          fromRight = mapSize[0] - (popPx[0] + tailOffsetRight);

        var fromTop = popPx[1] - popSize.height + popOffset[1],
          fromBottom = mapSize[1] - (popPx[1] + tailHeight) - popOffset[1];

        var center = self.map.getView().getCenter(),
          curPx = self.map.getPixelFromCoordinate(center),
          newPx = curPx.slice();

        if (fromRight < 0) {
          newPx[0] -= fromRight;
        } else if (fromLeft < 0) {
          newPx[0] += fromLeft;
        }

        if (fromTop < 0) {
          newPx[1] += fromTop;
        } else if (fromBottom < 0) {
          newPx[1] -= fromBottom;
        }
        //平移地图
        if (!duration) {
          duration = 1000;
          var start = +new Date();
          var pan = ol.animation.pan({
            duration: duration,
            source: /** @type {ol.Coordinate} */ (self.map.getView().getCenter()),
            start: start
          });
          var bounce = ol.animation.bounce({
            duration: duration,
            resolution: self.map.getView().getResolution(),
            start: start
          });
          this.map.beforeRender(pan);
        }
        if (newPx[0] !== curPx[0] || newPx[1] !== curPx[1]) {
          self.map.getView().setCenter(self.map.getCoordinateFromPixel(newPx));
        }
        return self.map.getView().getCenter();
      };
      /**
       * 右键标记(桩号定位)的时候调用，允许存在多个Popup
       * @params obj
       * */
      this.showMarkPopup = function (obj) {
        var id = appConfig.utils.generateGUID();
        var m = {
          positioning: 'center-center',
          offset: [-40, 13],
          id: id
        };
        obj = $.extend(obj, m);
        var popup = new ol.Overlay.Popup(obj);
        this.map.addOverlay(popup);
        if (!obj.content) {
          obj.content = util.getMarkPopupOverContextTemplate();
        }
        popup.show(obj.coordinate, obj.content);
        var feature = popup.getBottomMarkFea();
        if (feature) {
          feature.set("params", {
            moveable: true,
            popupFeature: true
          });
        }
        /*确定按钮*/
        $(".iw_bt.button-xz").unbind("click").on("click", function (event) {
          var input = $(event.target).parent().siblings("div").find("input");
          var inputTitle = input.val();
          var overLayId = $(event.target).closest(".ol-popup")[0].id;
          var popup = appConfig.hdmap.map.getOverlayById(overLayId);
          appConfig.hdmap.showMarkPopupConfirm(overLayId);
          popup.showMin();
          if (inputTitle && inputTitle !== "") {
            popup.setMinText(inputTitle);
          }
        });
        /*取消按钮*/
        $(".iw_bt.button-bxz").unbind("click").on("click", function (event) {
          var input = $(event.target).parent().siblings("div").find("input");
          var overLayId = $(event.target).closest(".ol-popup")[0].id;
          appConfig.hdmap.removeMarkPopupById(overLayId);
        });


        this.mapTools.showMark = false;
        if (this.addPointHandlerClick) {
          ol.Observable.unByKey(this.addPointHandlerClick);//移除对key的监听
        }
      };

      this.removeMarkPopupById = function (id) {
        if (this.map) {
          var targetOverlay = this.map.getOverlayById(id);
          if (targetOverlay) {
            if (targetOverlay instanceof ol.Overlay.Popup) {
              this.removeFeature(targetOverlay.getBottomMarkFea());
            }
            this.map.removeOverlay(targetOverlay);
          }
        }
      };

      /**
       * 根据feature得到该feature所在的图层
       * @param feature
       * @returns {*}
       */
      this.getLayerByFeatuer = function (feature) {
        var tragetLayer = null;
        if (feature instanceof ol.Feature) {
          var bin = false, source = null;
          var layers = this.map.getLayers().getArray();
          var length = layers.length;
          for (var i = 0; i < length; i++) {
            if (!tragetLayer) {
              var source = layers[i].getSource();
              if (source.getFeatures) {
                var features = source.getFeatures();
                var feaLength = features.length;
                for (var j = 0; j < feaLength; j++) {
                  var fea = features[j];
                  if (fea == feature) {
                    tragetLayer = layers[i];
                    break;
                  }
                }
              }
            } else {
              break;
            }
          }
        } else {
          console.error("传入的不是要素");
        }
        return tragetLayer;
      };
      /**
       * 调整地图范围
       * @param extent
       * @returns {*}
       */
      this.adjustExtent = function (extent) {
        var width = ol.extent.getWidth(extent);
        var height = ol.extent.getHeight(extent);
        var adjust = 0.2;
        if (width < 0.05) {
          var bleft = ol.extent.getBottomLeft(extent);//获取xmin,ymin
          var tright = ol.extent.getTopRight(extent);//获取xmax,ymax
          var xmin = bleft[0] - adjust;
          var ymin = bleft[1] - adjust;
          var xmax = tright[0] + adjust;
          var ymax = tright[1] + adjust;
          extent = ol.extent.buffer(extent, adjust);
        }
        return extent;
      };
      /**
       * 移除多个要素
       * @param features
       */
      this.removeFeatures = function (features) {
        var self = this;
        for (var i = 0; i < features.length; i++) {
          this.removeFeature(features[i]);
        }
      };
      /**
       * 根据features集合缩放至合适的地图范围
       * @param features
       */
      this.zoomFeaturesExtent = function (features) {
        var points = [];
        if (features == null || features.length == 0) {
          return;
        }
        for (var i = 0; i < features.length; i++) {
          points.push(this.getFeatureCenter(features[i]));
        }
        var extent = new ol.geom.MultiPoint(points, null).getExtent();
        extent = this.adjustExtent(extent);
        this.zoomToExtent(extent, false);
      };
      /**
       * 根据feature获取中心点
       * @param feature
       * @returns {ol.Coordinate}
       */
      this.getFeatureCenter = function (feature) {
        var extent = feature.getGeometry().getExtent();
        return ol.extent.getCenter(extent);
      };

      /**
       * 获取当前地图的范围
       * @returns {ol.Extent}
       */
      this.getMapCurrentExtent = function () {
        return this.map.getView().calculateExtent(this.map.getSize());
      };

      /**
       * 判断点是否在视图内，如果不在地图将自动平移
       */
      this.MovePointToView = function (coord) {
        var extent = this.getMapCurrentExtent();
        if (!(ol.extent.containsXY(extent, coord[0], coord[1]))) {
          this.map.getView().setCenter([coord[0], coord[1]]);
        }
      };

      /**
       * 当前范围是否包含该点
       */
      this.containposition = function (postion) {
        var extent = this.map.getView().calculateExtent(this.map.getSize());
        if (extent[0] < postion[0] && postion[0] < extent[2]) {
          if (extent[1] < postion[1] && postion[1] < extent[3])
            return true;
        }
        return false;
      };
      /**
       * 更新地图大小
       */
      this.updateSize = function () {
        this.map.updateSize();
      };
      /**
       * 放大
       */
      this.zoomIn = function () {
        var zoom = this.map.getView().getZoom();
        this.map.getView().setZoom(zoom + 1);
      };
      /**
       * 缩小
       */
      this.zoomOut = function () {
        var zoom = this.map.getView().getZoom();
        this.map.getView().setZoom(zoom - 1);
      };

      /**
       * 添加路线集合
       * @param layerName 图层名称
       * @param features 集合
       * @param isclear 是否添加之前清空地图
       * @param showStyle
       */
      this.addPolylines = function (layerName, features, isclear, showStyle) {
        if (isclear == undefined)
          isclear = true;
        this.tempAddline = [];
        if (isclear)
          this.clearGraphics();
        if (features != null && features.length > 0) {
          for (var i = 0; i < features.length; i++) {
            this.addPolyline(layerName, features[i], null, showStyle);
          }
          var extent = new ol.geom.MultiLineString(this.tempAddline, null).getExtent();
          extent = this.adjustExtent(extent);
          this.zoomToExtent(extent, false);
        }
      };

      /**
       * 添加线要素
       * @param layerName 图层名
       * @param feature 要素
       * @param style 样式
       * @param showStyle 是否显示样式信息
       * @returns {*}
       */
      this.addPolyline = function (layerName, feature, style, showStyle) {
        var lineStyle = null;
        if (!style) {
          style = {width: 4, color: '#0000EE'};
        }
        lineStyle = new ol.style.Style({
          stroke: new ol.style.Stroke(style)
        });
        var features = [];
        if (feature instanceof Array) {
          features = feature;
        } else {
          features.push(feature);
        }
        var linefeature;
        for (var i = 0; i < features.length; i++) {
          var _feat = features[i];
          if (_feat.geometry.hasOwnProperty('paths')) {
            var feat = {
              'type': 'Feature',
              'geometry': {
                'type': 'MultiLineString',
                'coordinates': _feat.geometry.paths
              }
            };
            this.tempAddline = this.tempAddline.concat(_feat.geometry.paths);
            linefeature = (new ol.format.GeoJSON()).readFeature(feat);
          } else {
            linefeature = new ol.Feature({
              geometry: new ol.format.WKT().readGeometry(_feat.geometry)
            });
            var extent = linefeature.getGeometry().getExtent();
            this.tempAddline.push([[extent[0], extent[1]], [extent[2], extent[3]]]);
            this.zoomToExtent(extent, false);
          }
          if (showStyle && showStyle['unSelectStyle']) {
            linefeature.set('unSelectStyle', showStyle['unSelectStyle']);
          } else {
            linefeature.set('unSelectStyle', lineStyle);
          }
          if (showStyle && showStyle['selectStyle']) {
            linefeature.set('selectStyle', showStyle['selectStyle']);
          } else {
            var sstyle = {width: 6, color: '#FF0000'};
            var selectStyle = new ol.style.Style({
              stroke: new ol.style.Stroke(sstyle)
            });
            linefeature.set('selectStyle', selectStyle);
          }
          if (!_feat['attributes']) {
            _feat['attributes'] = {};
            _feat.attributes['layername'] = layerName;
          }
          if (_feat.attributes['ID']) {
            linefeature.setId(_feat.attributes['ID']);
            linefeature.set('layerName', layerName);
            linefeature.setProperties(_feat.attributes);
          }
          if (lineStyle != null) {
            linefeature.setStyle(lineStyle);//设置线段样式
          }
          var layer = this.getlayerByName(layerName);
          if (layer == null) {
            layer = this.getTempVectorLayer(layerName, {create: true});
            layer.set("selectable", true);
            this.lineLayers.push(layerName);
          }
          layer.getSource().addFeature(linefeature);
          this.OrderLayerZindex();
          return linefeature;
        }

      };
      /**
       * 根据线要素进行定位
       * @param feature
       */
      this.zoomByLineFeature = function (feature) {
        var linefeature = null;
        if (feature.geometry.hasOwnProperty('paths')) {
          var feat = {
            'type': 'Feature',
            'geometry': {
              'type': 'LineString',
              'coordinates': feature.geometry.paths[0]
            }
          };
          linefeature = (new ol.format.GeoJSON()).readFeature(feat);
        } else {
          linefeature = new ol.Feature({
            geometry: new ol.format.WKT().readGeometry(feature.geometry)
          });
        }
        if (linefeature != null) {
          var extent = linefeature.getGeometry().getExtent();
          this.zoomToExtent(extent, false);
        }

      };
      /**
       * 兼容feature类型和overlay类型点标绘
       * @param array <points>
       * @param drawType<标绘类型feature and overlay>
       * @param params <图层参数>
       * @param isClear <是否清空上次标绘>
       * @param diszoomToExtent<标绘时不进行缩放>
       * @returns {Array|*}
       */
      this.addTypePoints = function (array, drawType, params, isClear, diszoomToExtent) {
        if (isClear) {//是否清空地图
          this.clearGraphics();
        }
        if (!params) params = {};//参数
        if (!array || array.length == 0) {//判断points数据
          return;
        }
        var multiPoint = new ol.geom.MultiPoint([]);
        var addedPoints = [];
        for (var i = 0; i < array.length; i++) {
          var attr = array[i], geometry = null, imgSrcHover, imgSrc;

          if (!attr) {
            continue;
          }
          if (!attr.geometry) {
            continue;
          }
          if (attr instanceof ol.geom.Geometry) {
            geometry = attr;
          } else if ($.isArray(attr.geometry)) {
            geometry = new ol.geom.Point(attr.geometry);
          } else {
            geometry = new ol.format.WKT().readGeometry(attr.geometry);
          }

          var feature = new ol.Feature({
            geometry: geometry
          });
          multiPoint.appendPoint(geometry);

          //设置标识参数
          if (params) {
            feature.set("params", params);
            if (params.layerName) {
              feature.set("layerName", params.layerName);
            }
          }
          if (!attr['attributes']) {
            attr['attributes'] = {};
          }
          if (attr.attributes['ID'] || attr.attributes['id']) {
            feature.setId(attr.attributes['ID'] ? attr.attributes['ID'] : attr.attributes['id']);
            feature.setProperties(attr.attributes);
          } else {
            console.error("传入的数据缺少id");
            continue;
          }
          //样式
          if (attr.attributes['ImgURL']) {
            imgSrc = attr.attributes.ImgURL;
            if (attr.attributes['imgSrcHover']) {
              imgSrcHover = attr.attributes["imgSrcHover"];
            } else {
              imgSrcHover = attr.attributes.ImgURL;
            }
          } else if (attr.attributes['type']) {
            imgSrc = appConfig.markConfig.getMarkConfigByetype(attr.attributes.type).imgURL;
            imgSrcHover = appConfig.markConfig.getMarkConfigByetype(attr.attributes.type).imgURL;
          } else {
            imgSrc = appConfig.markConfig.getDefaultMrakConfig().imgURL;
            imgSrcHover = appConfig.markConfig.getDefaultMrakConfig().imgURL;
          }
          var selecStyle, unSelectStyle;
          if (params && params['orderBy']) {
            selecStyle = new ol.style.Style({
              image: new ol.style.Icon({//标绘点的样式
                anchor: [0.5, 0.5],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                src: imgSrc
              }),
              text: new ol.style.Text({
                text: i + 1 + "",
                offsetX: 0.5,
                offsetY: -18,
                fill: new ol.style.Fill({
                  color: "#fff"
                })
              })
            });
            unSelectStyle = new ol.style.Style({
              image: new ol.style.Icon({//标绘点选中的样式
                anchor: [0.5, 0.5],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                src: imgSrcHover
              }),
              text: new ol.style.Text({
                text: i + 1 + "",
                offsetX: 0.5,
                offsetY: -18,
                fill: new ol.style.Fill({
                  color: "#fff"
                })
              })
            });
          } else {
            selecStyle = new ol.style.Style({
              image: new ol.style.Icon({//标绘点的样式
                anchor: [0.5, 0.5],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                src: imgSrcHover
              })
            });
            unSelectStyle = new ol.style.Style({
              image: new ol.style.Icon({//标绘点选中的样式
                anchor: [0.5, 0.5],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                src: imgSrc
              })
            });
          }
          //是否存储样式
          if (params.showStyle) {
            if (params.showStyle['unSelectStyle']) {
              feature.set('unSelectStyle', params.showStyle['unSelectStyle']);
            } else {
              feature.set('unSelectStyle', unSelectStyle);
            }
            if (params.showStyle['selectStyle']) {
              feature.set('selectStyle', params.showStyle['selectStyle']);
            } else {
              feature.set('selectStyle', selecStyle);
            }
          }
          if (unSelectStyle != null) {
            feature.setStyle(unSelectStyle);//设置样式
          }
          if (drawType && drawType == "overlayer") {
            this.addTypeOverlay(feature, attr.attributes, params, i);
          } else {
            var layer = null;
            if (params["layerName"]) {
              layer = this.getlayerByName(params["layerName"]);
              if (!layer) {
                params["create"] = true;
                layer = this.getTempVectorLayer(params["layerName"], params);
              }
            } else {
              layer = this.tempVectorLayer;
            }
            layer.getSource().addFeature(feature);
          }
        }
        if (!diszoomToExtent) {
          this.getExtent(multiPoint);
        }
        $("div.overlayers-pin.iconfont.icon-dingwei1.marker-raise").removeClass("marker-raise");
        return addedPoints;
      };
      /**
       * 公共字体图标方案
       * @param feature
       * @param attributes
       * @param params
       * @param i
       */
      this.addTypeOverlay = function (feature, attributes, params, i) {
        var marker = document.createElement('div');
        marker.className = "overlayers-pin iconfont icon-dingwei1 marker-raise";
        var color = "#EB4F38", fontSize = "31px";
        var id = null, coordinate = [];
        if (attributes.hasOwnProperty('icon')) {
          var icon = attributes.icon;
          //字体图标
          if (icon && icon.className) {
            $(marker).removeClass("icon-qipao");
            $(marker).addClass(icon.className);
          }
          //图标颜色
          if (icon && icon.color) {
            color = icon.color;
          }
          //字体图标大小
          if (icon && icon.fontSize) {
            fontSize = icon.fontSize;
          }
        }
        //是否显示顺序【0，1，2】
        var span = document.createElement('span');
        var m = 0;
        if (params && params["orderBy"]) {
          m = i + 1;
        } else if (params && params["orderByNum"] && attributes.hasOwnProperty('number')) {
          m = attributes.number + 1;
        }
        span.innerHTML = m;
        marker.appendChild(span);
        marker.style.color = color;
        marker.style.fontSize = fontSize;
        marker.selectColor = "#1b9de8";
        marker.unSelectColor = "#EB4F38";
        marker.onmousedown = function (ev) {
          if (ev.button == 2) {//鼠标右键
            window.ObservableObj.set("rightMenuFeature", feature);
            window.ObservableObj.dispatchEvent("rightMenuEvt");
          } else if (ev.button == 0) {//鼠标左键
            window.ObservableObj.set("overlay", feature);
            window.ObservableObj.dispatchEvent("overlayEvt");
          }
        };
        if (feature) {
          id = feature.getId();
          var overlaytemp = this.map.getOverlayById(id);
          if (!overlaytemp) {
            coordinate = feature.getGeometry().getCoordinates();
            var iconOverlay = new ol.Overlay({
              element: marker,
              positioning: 'center-center',
              id: id,
              offset: [0, -10],
              stopEvent: true
            });
            iconOverlay.set('feature', feature);
            iconOverlay.setPosition(coordinate);
            //设置标识参数
            if (params) {
              iconOverlay.set("params", params);
              if (params.layerName) {
                iconOverlay.set("layerName", params.layerName);
              }
            }
            this.map.addOverlay(iconOverlay);
          }
        }
      };
      /**
       * 按照顺序标绘
       * @param array
       * @param params
       * @param isClear
       */
      this.addPointsOrderBy = function (array, params, isClear) {
        if (isClear) {//是否清空地图
          this.clearGraphics();
        }
        if (!params) params = {};//参数
        if (!array || array.length == 0) {//判断points数据
          return;
        }
        var multiPoint = new ol.geom.MultiPoint([]);
        for (var i = 0; i < array.length; i++) {

          var attr = array[i], geometry = null, imgSrcHover, imgSrc;

          if (!attr) {
            continue;
          }
          if (!attr.geometry) {
            continue;
          }
          if (attr instanceof ol.geom.Geometry) {
            geometry = attr;
          } else if ($.isArray(attr.geometry)) {
            geometry = new ol.geom.Point(attr.geometry);
          } else {
            geometry = new ol.format.WKT().readGeometry(attr.geometry);
          }

          var feature = new ol.Feature({
            geometry: geometry
          });
          multiPoint.appendPoint(geometry);
          //设置标识参数
          if (params) {
            feature.set("params", params);
            if (params.layerName) {
              feature.set("layerName", params.layerName);
            }
          }
          if (!attr['attributes']) {
            attr['attributes'] = {};
          }
          if (attr.attributes['ID'] || attr.attributes['id']) {
            feature.setId(attr.attributes['ID'] ? attr.attributes['ID'] : attr.attributes['id']);
            feature.setProperties(attr.attributes);
          } else {
            console.error("传入的数据缺少id");
            continue;
          }
          if (attr.attributes['type']) {
            imgSrc = appConfig.markConfig.getMarkConfigByetype(attr.attributes.type).imgURL;
            imgSrcHover = appConfig.markConfig.getMarkConfigByetype(attr.attributes.type + 'Hover').imgURL;
          } else {
            imgSrc = appConfig.markConfig.getDefaultMrakConfig().imgURL;
            imgSrcHover = appConfig.markConfig.getHightImgURL().imgURL;
          }
          var unSelectStyle = new ol.style.Style({
            image: new ol.style.Icon({
              anchor: [0.5, 0.5],
              anchorXUnits: 'fraction',
              anchorYUnits: 'fraction',
              src: imgSrc
            }),
            text: new ol.style.Text({
              text: i + 1 + "",
              offsetX: 0.5,
              offsetY: -28,
              font: "16px serif",
              fill: new ol.style.Fill({
                color: "#636363"
              })
            })
          });
          var selecStyle = new ol.style.Style({
            image: new ol.style.Icon({
              anchor: [0.5, 0.5],
              anchorXUnits: 'fraction',
              anchorYUnits: 'fraction',
              src: imgSrcHover
            }),
            text: new ol.style.Text({
              text: i + 1 + "",
              offsetX: 0.5,
              offsetY: -28,
              font: "16px serif",
              fill: new ol.style.Fill({
                color: "#636363"
              })
            })
          });
          feature.set('unSelectStyle', unSelectStyle);
          feature.set('selectStyle', selecStyle);
          feature.setStyle(unSelectStyle);
          var layer = null;
          if (params["layerName"]) {
            layer = this.getlayerByName(params["layerName"]);
            if (!layer) {
              params["create"] = true;
              layer = this.getTempVectorLayer(params["layerName"], params);
            }
          } else {
            layer = this.tempVectorLayer;
          }
          layer.getSource().addFeature(feature);
        }
      };
      /**
       * 获取空间范围
       * @param multiPoint
       * @returns {Array}
       */
      this.getExtent = function (multiPoint) {
        var extent = [];
        if (multiPoint.getPoints().length > 0) {
          extent = multiPoint.getExtent();
          var bExtent = true;
          for (var m = 0; m < 4; m++) {
            if (extent[m] == Infinity || extent[m] == NaN) {
              bExtent = false;
              break;
            }
          }
          if (bExtent) {
            this.zoomToExtent(extent, true);
          }
        }
        return extent;
      };
      //只保留某个ID的要素，其他的全部移出
      this.removeAllFeaturesExceptID = function (id) {
        var hightFeatures = [];
        var tempLayer = this.getTempVectorLayer("tempVectorLayer");
        var targetFeature = tempLayer.getSource().getFeatureById(id);
        if (targetFeature) {
          var clonedFeature = targetFeature.clone();
          tempLayer.getSource().clear();
          tempLayer.getSource().addFeature(clonedFeature);
          clonedFeature.setId(id);
          this.unHighLightFeatureByID(id);
          return clonedFeature;
        } else {
          return null;
        }
      };

      //只保留某个id的overlay，其他的全部移除
      this.removeAllOverlayExceptID = function (id, layerName) {
        var overlay = appConfig.hdmap.map.getOverlayById(id);
        if (overlay) {
          var element = overlay.getElement();
          element.parentNode.style.zIndex = "";
          this.map.getOverlays().clear();
          this.map.addOverlay(overlay);
        } else {
          this.map.getOverlays().clear();
        }
      };
      /**
       * 保留当前要素其他全部移除
       * @param id
       * @param layerName
       * @returns {*}
       */
      this.removeAllFeaturesExceptById = function (id, layerName) {
        var targetFeature = this.getFeaturesByIdAndLayerName(id, layerName);
        var clonedFeature = null;
        if (targetFeature) {
          clonedFeature = targetFeature.clone();
          clonedFeature.setId(id);
          this.clearGraphics();
          var layer = this.getlayerByName(layerName);
          if (layer && layer instanceof ol.layer.Vector) {
            layer.getSource().addFeature(clonedFeature)
          } else {
            this.tempVectorLayer.getSource().addFeature(clonedFeature);
          }
          this.unHighLightFeatureByID(id);
        } else {
          this.clearGraphics();
        }
        return clonedFeature;
      };
      /**
       * 通过id获取feature（layerName可以不传，不传就是在所有图层查找）
       * @param id
       * @param layerName
       * @returns {*}
       */
      this.getFeaturesByIdAndLayerName = function (id, layerName) {
        var feature = null;
        if (layerName) {
          var layer = this.getlayerByName(layerName);
          if (layer && layer instanceof ol.layer.Vector) {
            feature = layer.getSource().getFeatureById(id)
          }
        }
        if (!feature) {
          var layers = this.map.getLayers();
          layers.forEach(function (layer) {
            if (!feature) {
              var source = layer.getSource();
              if (source && source.getFeatureById) {
                feature = source.getFeatureById(id);
              }
            }
          });
        }
        return feature;
      };
      /**
       * 根据图层移除overlay
       * @param layerName
       */
      this.removeOverlayByLayerName = function (layerName) {
        var self = this;
        if (self.map) {
          var overlays = this.map.getOverlays().getArray();
          var len = overlays.length;
          for (var i = 0; i < len; i++) {
            if (overlays[len - 1] && overlays[len - 1].get("layerName") == layerName) {
              self.map.removeOverlay(overlays[len - 1]);
            }
          }
        }
      };

      this.removeFeaturesByLayerName = function (layerName) {
        if (!layerName || layerName == "") return;
        var layer = this.getlayerByName(layerName);
        if (layer instanceof ol.layer.Vector) {
          if (layer.getSource() && layer.getSource().clear) {
            layer.getSource().clear();
          }
        }
      };
      /**
       * 根据feature得到该feature所在的图层
       * @param feature
       * @returns {*}
       */
      this.getLayerNameByFeature = function (feature) {
        var layerName = null;
        if (feature instanceof ol.Feature) {
          layerName = feature.get('layerName');
          if (!layerName && feature.get('params')) {
            layerName = feature.get('params').hasOwnProperty('layerName') ? feature.get('params').layerName : null;
          }
        } else {
          if(feature['layerName']){
            layerName = feature['layerName'];
          }else{
            console.error("传入的不是要素");
          }
        }
        return layerName;
      };
      /**
       * 空间数据获取外包圆半径
       * @param geometrys
       * @returns {Array}
       */
      this.getRadiusSquared = function (geometrys) {
        var MultiPolygon = new ol.geom.MultiPolygon();
        var extent = [], radius = null;
        for (var i = 0; i < geometrys.length; i++) {
          MultiPolygon.appendPolygon(geometrys[i]);
        }
        if (MultiPolygon.getPolygons().length > 0) {
          extent = MultiPolygon.getExtent();
          var bExtent = true;
          for (var m = 0; m < 4; m++) {
            if (extent[m] == Infinity || extent[m] == NaN) {
              bExtent = false;
              break;
            }
          }
          if (bExtent) {
            var minx = extent[0], miny = extent[1], maxx = extent[2], maxy = extent[3];
            var x = this.wgs84Sphere.haversineDistance([minx, miny], [maxx, miny]);
            var y = this.wgs84Sphere.haversineDistance([minx, miny], [minx, maxy]);
            radius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) / 2;
            var center = ol.extent.getCenter(extent)
          }
        }
        return {
          radius: radius,
          extent: extent,
          center: center
        };
      }
    };
    return HDMap;
  });
