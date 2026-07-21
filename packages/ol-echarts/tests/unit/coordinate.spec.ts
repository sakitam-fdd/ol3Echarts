import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { Map, View } from 'ol';
import { Tile as TileLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import EChartsLayer from '../../src';
import { pie, bar, line } from '../../src/charts';

describe('coordinate & converters', () => {
  let container: HTMLDivElement;
  let map: Map;

  const createMap = () => {
    container = document.createElement('div');
    container.style.width = '800px';
    container.style.height = '600px';
    document.body.appendChild(container);
    map = new Map({
      target: container,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        projection: 'EPSG:4326',
        center: [110, 34],
        zoom: 5,
      }),
    });
    map.setSize([800, 600]);
  };

  afterEach(() => {
    map?.setTarget(undefined);
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  it('does not mutate shared default options between instances', () => {
    const a = new EChartsLayer(null, { hideOnMoving: true });
    const b = new EChartsLayer(null, {});
    expect(a.getOptions().hideOnMoving).toBe(true);
    expect(b.getOptions().hideOnMoving).toBe(false);
    expect(EChartsLayer.defaultOptions.hideOnMoving).toBe(false);
  });

  it('clones chart options on setChartOptions', () => {
    createMap();
    const layer = new EChartsLayer(null, { stopEvent: false });
    layer.appendTo(map);
    const option = {
      series: [
        {
          type: 'scatter',
          data: [[110, 34, 1]],
        },
      ],
    };
    layer.setChartOptions(option);
    option.series[0].data = [[0, 0, 0]];
    expect(layer.getChartOptions()?.series).toEqual([
      {
        type: 'scatter',
        data: [[110, 34, 1]],
      },
    ]);
  });

  it('registers a single series without overriding explicit settings', () => {
    createMap();
    const layer = new EChartsLayer(null, {});
    (layer as any)._map = map;
    const option = {
      series: {
        type: 'scatter',
        coordinateSystem: 'geo',
        animation: true,
        data: [[110, 34]],
      },
    };
    (layer as any).registerMap(option);
    expect(option.series.coordinateSystem).toBe('geo');
    expect(option.series.animation).toBe(true);
  });

  it('exposes echarts instance after load', async () => {
    createMap();
    const layer = new EChartsLayer(
      {
        series: [
          {
            type: 'scatter',
            data: [[110, 34, 10]],
          },
        ],
      },
      { stopEvent: false },
    );

    await new Promise<void>((resolve) => {
      layer.on('load', () => {
        expect(layer.getECharts()).toBeTruthy();
        expect(layer.$chart).toBe(layer.getECharts());
        layer.remove();
        resolve();
      });
      layer.appendTo(map);
    });
  });

  it('pie converter maps coordinates to center', () => {
    const coordinateSystem = {
      dataToPoint: (data: number[]) => [data[0] * 2, data[1] * 2],
    };
    const serie = {
      type: 'pie',
      coordinates: [10, 20],
    };
    const result = pie({}, serie, coordinateSystem);
    expect(result.center).toEqual([20, 40]);
  });

  it('suppresses pie labels when its anchor is outside the viewport', () => {
    const coordinateSystem = {
      dataToPoint: () => [-20, 100],
      containPoint: () => false,
    };
    const serie = {
      type: 'pie',
      coordinates: [10, 20],
      label: { color: '#fff' },
      labelLine: { length: 12 },
    };
    const result = pie({}, serie, coordinateSystem, { hideOffscreenLabels: true });
    expect(result.label).toEqual({ color: '#fff', show: false });
    expect(result.labelLine).toEqual({ length: 12, show: false });
  });

  it('bar converter positions grid by coordinates', () => {
    const coordinateSystem = {
      dataToPoint: (data: number[]) => [data[0], data[1]],
    };
    const options = {
      grid: [{ width: 100, height: 50 }],
      series: [{ type: 'bar', coordinates: [200, 100] }],
    };
    bar(options as any, options.series[0], coordinateSystem);
    expect(options.grid[0].left).toBe(150);
    expect(options.grid[0].top).toBe(75);
  });

  it('line converter positions grid by coordinates', () => {
    const coordinateSystem = {
      dataToPoint: (data: number[]) => [data[0], data[1]],
    };
    const options = {
      grid: [{ width: 40, height: 20 }],
      series: [{ type: 'line', coordinates: [100, 80] }],
    };
    line(options as any, options.series[0], coordinateSystem);
    expect(options.grid[0].left).toBe(80);
    expect(options.grid[0].top).toBe(70);
  });

  it('positions a single grid and resolves percentage dimensions', () => {
    const coordinateSystem = {
      dataToPoint: () => [400, 300],
      getViewRect: () => ({ x: 0, y: 0, width: 800, height: 600 }),
    };
    const options = {
      grid: { width: '25%', height: '20%' },
      series: { type: 'bar', coordinates: [110, 34] },
    };
    bar(options as any, options.series, coordinateSystem);
    expect(options.grid.left).toBe(300);
    expect(options.grid.top).toBe(240);
  });

  it('converts pixels back to the configured source projection', () => {
    const projection = { getCode: () => 'EPSG:3857' };
    const fakeMap = {
      getView: () => ({ getProjection: () => projection }),
      getPixelFromCoordinate: (coordinate: number[]) => coordinate,
      getCoordinateFromPixel: (pixel: number[]) => pixel,
      getSize: () => [800, 600],
    };
    const layer = new EChartsLayer(null, { source: 'EPSG:4326', destination: 'EPSG:3857' });
    (layer as any)._map = fakeMap;
    const CoordinateSystem = (layer as any).getCoordinateSystem(layer.getOptions());
    const coordinateSystem = new CoordinateSystem(fakeMap);
    const source = [110, 34];
    const pixel = coordinateSystem.dataToPoint(source);
    expect(coordinateSystem.pointToData(pixel)[0]).toBeCloseTo(source[0], 6);
    expect(coordinateSystem.pointToData(pixel)[1]).toBeCloseTo(source[1], 6);
    expect(coordinateSystem.containPoint([400, 300])).toBe(true);
  });

  it('appendData accepts plain arrays without copyWithin', async () => {
    createMap();
    const layer = new EChartsLayer(
      {
        series: [
          {
            type: 'scatter',
            data: [[110, 34, 1]],
          },
        ],
      },
      { stopEvent: false },
    );

    await new Promise<void>((resolve) => {
      layer.on('load', () => {
        expect(() => {
          layer.appendData({
            seriesIndex: 0,
            data: [[111, 35, 2]],
          });
        }).not.toThrow();
        layer.remove();
        resolve();
      });
      layer.appendTo(map);
    });
  });

  it('hides while rotating when hideOnRotating is enabled', async () => {
    createMap();
    const layer = new EChartsLayer(
      {
        series: [{ type: 'scatter', data: [[110, 34, 1]] }],
      },
      {
        stopEvent: false,
        hideOnRotating: true,
        hideOnMoving: false,
      },
    );

    await new Promise<void>((resolve) => {
      layer.on('load', () => {
        const zoom = map.getView().getZoom();
        const rotation = map.getView().getRotation();
        map.dispatchEvent({
          type: 'movestart',
          frameState: { viewState: { zoom, rotation: rotation + 0.2 } },
        } as any);
        expect(layer.isVisible()).toBe(false);

        map.dispatchEvent({
          type: 'moveend',
          frameState: { viewState: { zoom, rotation } },
        } as any);
        expect(layer.isVisible()).toBe(true);
        layer.remove();
        resolve();
      });
      layer.appendTo(map);
    });
  });

  it('remove clears chart instance and map reference', async () => {
    createMap();
    const layer = new EChartsLayer(
      {
        series: [{ type: 'scatter', data: [[110, 34, 1]] }],
      },
      { stopEvent: false },
    );

    await new Promise<void>((resolve) => {
      layer.on('load', () => {
        expect(layer.getECharts()).toBeTruthy();
        layer.remove();
        expect(layer.getECharts()).toBeNull();
        expect(layer.getMap()).toBeUndefined();
        expect(layer.$container).toBeUndefined();
        resolve();
      });
      layer.appendTo(map);
    });
  });
});
