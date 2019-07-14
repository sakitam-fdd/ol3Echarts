// @ts-ignore
import ol from 'openlayers';
import EChartsLayer from '../../src';

const Map = ol.Map;
const View = ol.View;
const TileLayer = ol.layer.Tile;
const OSM = ol.source.OSM;

const options = {
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 'right',
    data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'],
  },
  series: [
    {
      name: '访问来源',
      type: 'pie',
      radius: '30',
      coordinates: [110.53450137499999, 33.44104525],
      data: [
        { value: 335, name: '直接访问' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 135, name: '视频广告' },
        { value: 1548, name: '搜索引擎' },
      ],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
    {
      name: '访问来源',
      type: 'pie',
      radius: '30',
      coordinates: [113.53450137499999, 34.44104525],
      data: [
        { value: 335, name: '直接访问' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 135, name: '视频广告' },
        { value: 1548, name: '搜索引擎' },
      ],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
    {
      name: '访问来源',
      type: 'pie',
      radius: '30',
      coordinates: [110.53450137499999, 38.44104525],
      data: [
        { value: 335, name: '直接访问' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 135, name: '视频广告' },
        { value: 1548, name: '搜索引擎' },
      ],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
};

describe('indexSpec', () => {
  let container: HTMLDivElement;
  let map: any;
  beforeEach(() => {
    container = document.createElement('div');
    container.style.width = '800px';
    container.style.height = '600px';
    document.body.appendChild(container);
    map = new Map({
      target: container,
      layers: [
        new TileLayer({
          preload: 4,
          source: new OSM()
        })
      ],
      loadTilesWhileAnimating: true,
      view: new View({
        projection: 'EPSG:4326',
        center: [120.74758724751435, 30.760422266949334],
        zoom: 8
      })
    });
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe('echarts layer', () => {
    it('create layer', () => {
      const layer = new EChartsLayer(null, {
        stopEvent: false,
        hideOnMoving: false,
        hideOnZooming: false,
        forcedPrecomposeRerender: false,
      });

      expect(layer).toBeDefined();

      expect(layer instanceof EChartsLayer).toBe(true);
    });

    it('add map', () => {
      const layer = new EChartsLayer(null, {
        stopEvent: false,
        hideOnMoving: false,
        hideOnZooming: false,
        forcedPrecomposeRerender: false,
      });

      expect(layer).toBeDefined();

      layer.appendTo(map);

      expect(layer instanceof EChartsLayer).toBe(true);
      expect(layer.getMap()).toEqual(map);
    });

    // it('throws an error when add map', () => {
    //   const layer = new EChartsLayer(null, {
    //     stopEvent: false,
    //     hideOnMoving: false,
    //     hideOnZooming: false,
    //     forcedPrecomposeRerender: false,
    //   });
    //
    //   expect(layer).toBeDefined();
    //
    //   expect(() => {
    //     layer.appendTo(null);
    //   }).toThrowError();
    // });

    it('throws an error when creating without new operator', () => {
      expect(() => {
        // @ts-ignore
        EChartsLayer.appendTo();
      }).toThrowError();
    });
  });

  describe('layer methods', () => {

    it('setMap getMap', () => {
      const layer = new EChartsLayer(null, {
        stopEvent: false,
        hideOnMoving: false,
        hideOnZooming: false,
        forcedPrecomposeRerender: false,
      });

      expect(layer).toBeDefined();

      layer.appendTo(map);

      expect(layer.getMap()).toEqual(map);
    });

    it('setChartOptions getChartOptions', () => {
      const layer = new EChartsLayer(null, {
        stopEvent: false,
        hideOnMoving: true,
        hideOnZooming: true,
        forcedPrecomposeRerender: false,
      });

      expect(layer).toBeDefined();

      layer.setMap(map);
      layer.setChartOptions(options);

      expect(layer.getChartOptions()).toEqual(options);
    });

    it('show hide setVisible isVisible', () => {
      const layer = new EChartsLayer(options, {
        stopEvent: false,
        hideOnMoving: true,
        hideOnZooming: true,
        forcedPrecomposeRerender: false,
      });

      expect(layer).toBeDefined();

      layer.appendTo(map);

      expect(layer.isVisible()).toBe(true);

      layer.setVisible(false);

      expect(layer.isVisible()).toBe(false);

      layer.setVisible(true);

      expect(layer.isVisible()).toBe(true);

      layer.hide();

      expect(layer.isVisible()).toBe(false);

      layer.show();

      expect(layer.isVisible()).toBe(true);
    });

    it('setZIndex getZIndex', () => {
      const layer = new EChartsLayer(options, {
        stopEvent: false,
        hideOnMoving: true,
        hideOnZooming: true,
        forcedPrecomposeRerender: false,
      });

      expect(layer).toBeDefined();

      layer.appendTo(map);

      expect(layer.getZIndex()).toBe('');

      layer.setZIndex(10);

      expect(layer.getZIndex()).toBe('10');
    });

    it('showLoading hideLoading', () => {
      const layer = new EChartsLayer(options, {
        stopEvent: false,
        hideOnMoving: true,
        hideOnZooming: true,
        forcedPrecomposeRerender: false,
      });

      expect(layer).toBeDefined();

      layer.appendTo(map);

      layer.showLoading();
      layer.hideLoading();
    });

    it('clear', (done) => {
      const layer = new EChartsLayer(options, {
        stopEvent: false,
        hideOnMoving: true,
        hideOnZooming: true,
        forcedPrecomposeRerender: false,
      });

      expect(layer).toBeDefined();

      layer.on('load', () => {
        layer.clear();
        done();
      });

      layer.appendTo(map);
    });

    it('remove', (done) => {
      const layer = new EChartsLayer(options, {
        stopEvent: false,
        hideOnMoving: true,
        hideOnZooming: true,
        forcedPrecomposeRerender: false,
      });

      expect(layer).toBeDefined();

      layer.on('load', () => {
        layer.remove();
        expect(layer.getMap()).toBeUndefined();
        done();
      });

      layer.appendTo(map);
    });
  });

  describe('layer action', () => {
    it('forcedPrecomposeRerender', (done) => {
      const layer = new EChartsLayer(options, {
        stopEvent: false,
        hideOnMoving: true,
        hideOnZooming: true,
        forcedPrecomposeRerender: true,
      });
      expect(layer).toBeDefined();
      done();
    }, 50000);

    it('resize', (done) => {
      const layer = new EChartsLayer(options, {
        stopEvent: false,
        hideOnMoving: true,
        hideOnZooming: true,
        forcedPrecomposeRerender: false,
      });

      const size = map.getSize();

      layer.on('change:size', (event: any) => {
        expect(event.value).toEqual([size[0] + 100, size[1] + 100]);
        layer.remove();
        done();
      });

      layer.on('load', () => {
        setTimeout(() => {
          map.setSize([size[0] + 100, size[1] + 100]);
        })
      });

      layer.appendTo(map);
    }, 50000);

    it('zoomEnd', (done) => {
      const layer = new EChartsLayer(options, {
        stopEvent: false,
        hideOnMoving: true,
        hideOnZooming: true,
        forcedPrecomposeRerender: false,
      });

      layer.on('zoomend', (event: any) => {
        expect(event.value).toBe(12);
        layer.remove();
        done();
      });

      layer.on('load', () => {
        setTimeout(() => {
          map.getView().setZoom(12);
        }, 1000)
      });

      layer.appendTo(map);
    }, 50000);

    it('onDragRotateEnd', (done) => {
      const layer = new EChartsLayer(options, {
        stopEvent: false,
        hideOnMoving: true,
        hideOnZooming: true,
        forcedPrecomposeRerender: false,
      });

      layer.on('change:rotation', (event: any) => {
        expect(event.value).toBe((90 / 180) * Math.PI);
        layer.remove();
        done();
      });

      layer.on('load', () => {
        setTimeout(() => {
          map.getView().setRotation((90 / 180) * Math.PI);
        }, 1000)
      });

      layer.appendTo(map);
    }, 50000);

    it('onMoveStart', (done) => {
      const layer = new EChartsLayer(options, {
        stopEvent: false,
        hideOnMoving: true,
        hideOnZooming: true,
        forcedPrecomposeRerender: false,
      });

      layer.on('load', () => {
        let center = map.getView().getCenter();
        map.getView().animate({
          center: [center[0] + 0.8, center[1] + 0.4],
          duration: 1000,
        });

        setTimeout(() => {
          expect(layer.isVisible()).toBe(false);
        });

        setTimeout(() => {
          expect(layer.isVisible()).toBe(true);
          layer.remove();
          done();
        }, 2000)
      });

      layer.appendTo(map);
    }, 50000);

    it('onMoveEnd', (done) => {
      const layer = new EChartsLayer(options, {
        stopEvent: false,
        hideOnMoving: true,
        hideOnZooming: true,
        forcedPrecomposeRerender: false,
      });

      let center = map.getView().getCenter();

      layer.on('moveend', (event: any) => {
        expect(event.value).toEqual([center[0] + 0.8, center[1] + 0.4]);
        layer.remove();
        done();
      });

      layer.on('load', () => {
        map.getView().animate({
          center: [center[0] + 0.8, center[1] + 0.4],
          duration: 0, // 取消动画，保证视图实时同步
        });
      });

      layer.appendTo(map);
    }, 50000);

    it('onCenterChange', (done) => {
      const layer = new EChartsLayer(options, {
        stopEvent: false,
        hideOnMoving: true,
        hideOnZooming: true,
        forcedPrecomposeRerender: false,
      });

      let center = map.getView().getCenter();

      layer.on('change:center', (event: any) => {
        expect(event.value).toEqual([center[0] + 0.8, center[1] + 0.4]);
        layer.remove();
        done();
      });

      layer.on('load', () => {
        setTimeout(() => {
          map.getView().setCenter([center[0] + 0.8, center[1] + 0.4]);
        }, 1000);
      });

      layer.appendTo(map);
    }, 50000);
  });
});
