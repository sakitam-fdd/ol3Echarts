import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';

import { Map, View } from 'ol';
import { Tile as TileLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import EChartsLayer from '../../src';

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
      emphasis: {
        itemStyle: {
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
      emphasis: {
        itemStyle: {
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
      emphasis: {
        itemStyle: {
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
          source: new OSM(),
        }),
      ],
      view: new View({
        projection: 'EPSG:4326',
        center: [120.74758724751435, 30.760422266949334],
        zoom: 8,
      }),
    });
    // jsdom does not layout the target; seed an explicit size for OL 10
    map.setSize([800, 600]);
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

    it('throws an error when creating without new operator', () => {
      expect(() => {
        (EChartsLayer as any).appendTo();
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

    it('clear', () => {
      const layer = new EChartsLayer(options, {
        stopEvent: false,
        hideOnMoving: true,
        hideOnZooming: true,
        forcedPrecomposeRerender: false,
      });
      return new Promise((resolve) => {
        expect(layer).toBeDefined();

        layer.on('load', () => {
          layer.clear();
          resolve(true);
        });

        layer.appendTo(map);
      });
    });

    it('remove', (done) => {
      const layer = new EChartsLayer(options, {
        stopEvent: false,
        hideOnMoving: true,
        hideOnZooming: true,
        forcedPrecomposeRerender: false,
      });

      return new Promise((resolve) => {
        expect(layer).toBeDefined();

        layer.on('load', () => {
          layer.remove();
          expect(layer.getMap()).toBeUndefined();
          resolve(true);
        });

        layer.appendTo(map);
      });
    });
  });

  describe('layer action', () => {
    it('forcedPrecomposeRerender', () => {
      const layer = new EChartsLayer(options, {
        stopEvent: false,
        hideOnMoving: true,
        hideOnZooming: true,
        forcedPrecomposeRerender: true,
      });
      expect(layer).toBeDefined();
    });

    it(
      'resize',
      { timeout: 50000 },
      () => {
        const layer = new EChartsLayer(options, {
          stopEvent: false,
          hideOnMoving: true,
          hideOnZooming: true,
          forcedPrecomposeRerender: false,
        });

        return new Promise((resolve) => {
          const size = map.getSize();

          layer.on('change:size', (event: any) => {
            expect(event.value).toEqual([size[0] + 100, size[1] + 100]);
            layer.remove();
            resolve(true);
          });

          layer.on('load', () => {
            setTimeout(() => {
              map.setSize([size[0] + 100, size[1] + 100]);
            });
          });

          layer.appendTo(map);
        });
      },
    );

    it('zoomEnd', () => {
      const layer = new EChartsLayer(options, {
        stopEvent: false,
        hideOnMoving: true,
        hideOnZooming: true,
        forcedPrecomposeRerender: false,
      });

      return new Promise((resolve) => {
        layer.on('zoomend', (event: any) => {
          expect(event.value).toBe(9);
          layer.remove();
          resolve(true);
        });

        layer.on('load', () => {
          map.getView().setZoom(9);
          // zoomend is emitted via the move interaction path
          map.dispatchEvent({
            type: 'moveend',
            frameState: { viewState: { zoom: 8 } },
          } as any);
        });

        layer.appendTo(map);
      });
    });

    it(
      'onDragRotateEnd',
      { timeout: 50000 },
      () => {
        const layer = new EChartsLayer(options, {
          stopEvent: false,
          hideOnMoving: true,
          hideOnZooming: true,
          forcedPrecomposeRerender: false,
        });

        return new Promise((resolve) => {
          layer.on('change:rotation', (event: any) => {
            expect(event.value).toBe((90 / 180) * Math.PI);
            layer.remove();
            resolve(true);
          });

          layer.on('load', () => {
            setTimeout(() => {
              map.getView().setRotation((90 / 180) * Math.PI);
            }, 1000);
          });

          layer.appendTo(map);
        });
      },
    );

    it('onMoveStart', () => {
      const layer = new EChartsLayer(options, {
        stopEvent: false,
        hideOnMoving: true,
        hideOnZooming: true,
        forcedPrecomposeRerender: false,
      });

      return new Promise((resolve) => {
        layer.on('load', () => {
          const zoom = map.getView().getZoom();
          map.dispatchEvent({
            type: 'movestart',
            frameState: { viewState: { zoom } },
          } as any);
          expect(layer.isVisible()).toBe(false);

          map.dispatchEvent({
            type: 'moveend',
            frameState: { viewState: { zoom } },
          } as any);
          expect(layer.isVisible()).toBe(true);
          layer.remove();
          resolve(true);
        });

        layer.appendTo(map);
      });
    });

    it('onMoveEnd', () => {
      const layer = new EChartsLayer(options, {
        stopEvent: false,
        hideOnMoving: true,
        hideOnZooming: true,
        forcedPrecomposeRerender: false,
      });

      return new Promise((resolve) => {
        const center = map.getView().getCenter();
        const nextCenter = [center[0] + 0.8, center[1] + 0.4];

        layer.on('moveend', (event: any) => {
          expect(event.value).toEqual(nextCenter);
          layer.remove();
          resolve(true);
        });

        layer.on('load', () => {
          map.getView().setCenter(nextCenter);
          map.dispatchEvent({
            type: 'moveend',
            frameState: { viewState: { zoom: map.getView().getZoom() } },
          } as any);
        });

        layer.appendTo(map);
      });
    });

    it(
      'onCenterChange',
      { timeout: 50000 },
      () => {
        const layer = new EChartsLayer(options, {
          stopEvent: false,
          hideOnMoving: true,
          hideOnZooming: true,
          forcedPrecomposeRerender: false,
        });

        return new Promise((resolve) => {
          const center = map.getView().getCenter();

          layer.on('change:center', (event: any) => {
            expect(event.value).toEqual([center[0] + 0.8, center[1] + 0.4]);
            layer.remove();
            resolve(true);
          });

          layer.on('load', () => {
            setTimeout(() => {
              map.getView().setCenter([center[0] + 0.8, center[1] + 0.4]);
            }, 1000);
          });

          layer.appendTo(map);
        });
      },
    );
  });

  describe('show hide', () => {
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

    it('should hide on Moving and show moveend', () => {
      const layer = new EChartsLayer(options, {
        stopEvent: false,
        hideOnMoving: true,
        hideOnZooming: true,
        forcedPrecomposeRerender: false,
      });

      return new Promise((resolve) => {
        layer.on('load', () => {
          const zoom = map.getView().getZoom();
          expect(layer.isVisible()).toBe(true);

          map.dispatchEvent({
            type: 'movestart',
            frameState: { viewState: { zoom } },
          } as any);
          expect(layer.isVisible()).toBe(false);

          map.dispatchEvent({
            type: 'moveend',
            frameState: { viewState: { zoom } },
          } as any);
          expect(layer.isVisible()).toBe(true);
          resolve(true);
        });

        expect(layer).toBeDefined();
        layer.appendTo(map);
      });
    });

    it('should hide on setVisible(false) when moving', async () => {
      const layer = new EChartsLayer(options, {
        stopEvent: false,
        hideOnMoving: true,
        hideOnZooming: true,
        forcedPrecomposeRerender: false,
      });

      await new Promise((resolve) => {
        layer.on('load', () => {
          const zoom = map.getView().getZoom();
          expect(layer.isVisible()).toBe(true);

          map.dispatchEvent({
            type: 'movestart',
            frameState: { viewState: { zoom } },
          } as any);
          layer.setVisible(false);
          expect(layer.isVisible()).toBe(false);

          map.dispatchEvent({
            type: 'moveend',
            frameState: { viewState: { zoom } },
          } as any);
          expect(layer.isVisible()).toBe(false);

          layer.setVisible(true);
          expect(layer.isVisible()).toBe(true);
          resolve(true);
        });

        expect(layer).toBeDefined();
        layer.appendTo(map);
      });
    });
  });
});
