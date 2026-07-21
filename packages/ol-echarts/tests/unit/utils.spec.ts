import { describe, beforeEach, afterEach, expect, it } from 'vitest';
import * as echarts from 'echarts';
import '../assets/world';
import EChartsLayer from '../../src';

describe('indexSpec', () => {
  beforeEach(() => {});

  afterEach(() => {});

  describe('utils', () => {
    it('utils.isObject', () => {
      const a = EChartsLayer.isObject({});
      const b = EChartsLayer.isObject(1);
      const c = EChartsLayer.isObject(null);
      const d = EChartsLayer.isObject(undefined);
      const e = EChartsLayer.isObject('undefined');
      const f = EChartsLayer.isObject(function () {});
      const g = EChartsLayer.isObject([]);

      // expect(layer).toBeDefined();

      expect(a).toBe(true);
      expect(b).toBe(false);
      expect(c).toBe(false);
      expect(d).toBe(false);
      expect(e).toBe(false);
      expect(f).toBe(true);
      expect(g).toBe(true);
    });

    it('utils.merge', () => {
      const a = { a: 1, b: 2 };
      const b = { c: 3 };
      const c: object = EChartsLayer.merge(a, b);
      expect(c).toEqual({
        a: 1,
        b: 2,
        c: 3,
      });

      const d = {
        a: {
          b: 1,
        },
      };

      const e = {
        a: {
          c: 2,
        },
      };

      const f: object = EChartsLayer.merge(d, e);
      expect(f).toEqual({
        a: {
          b: 1,
          c: 2,
        },
      });
    });

    it('utils.bind', () => {
      // @ts-ignore
      window.num = 9;
      const module = {
        num: 81,
        getNum: function () {
          // @ts-ignore
          return this ? this.num : window.num;
        },
      };
      expect(module.getNum()).toBe(81);
      const getNum = module.getNum;
      expect(getNum()).toBe(9);
      // 创建一个'this'绑定到module的函数
      const boundGetNum = EChartsLayer.bind(getNum, module);
      expect(boundGetNum()).toBe(81);
    });

    it('utils.uuid', () => {
      const id = EChartsLayer.uuid();
      expect(id).toBeDefined();
    });

    it('utils.clone', () => {
      const formatter = () => 'kept';
      const source = {
        a: 1,
        b: { c: 2 },
        d: [3, { e: 4 }],
        formatter,
      };
      const cloned = EChartsLayer.clone(source);
      expect(cloned).toEqual(source);
      expect(cloned).not.toBe(source);
      expect(cloned.b).not.toBe(source.b);
      cloned.b.c = 9;
      expect(source.b.c).toBe(2);
      expect(cloned.formatter).toBe(formatter);
    });

    it('utils.clone supports circular plain objects', () => {
      const source: { value: number; self?: unknown } = { value: 1 };
      source.self = source;
      const cloned = EChartsLayer.clone(source);
      expect(cloned).not.toBe(source);
      expect(cloned.self).toBe(cloned);
    });

    it('utils.arrayAdd', () => {
      const value1 = EChartsLayer.arrayAdd(
        [
          {
            index: 0,
            seriesIndex: 0,
            value: 0,
          },
        ],
        {
          index: 1,
          seriesIndex: 1,
          value: 1,
        },
      );

      const value2 = EChartsLayer.arrayAdd(
        [
          {
            index: 0,
            seriesIndex: 0,
            value: 0,
          },
        ],
        {
          index: 0,
          seriesIndex: 0,
          value: 1,
        },
      );

      expect(value1).toEqual([
        {
          index: 0,
          seriesIndex: 0,
          value: 0,
        },
        {
          index: 1,
          seriesIndex: 1,
          value: 1,
        },
      ]);
      expect(value2).toEqual([
        {
          index: 0,
          seriesIndex: 0,
          value: 1,
        },
      ]);
    });

    it('utils.removeNode', () => {
      const container = document.createElement('div');
      container.id = 'util';
      document.body.appendChild(container);
      const value = document.getElementById('util');

      expect(value).toBe(container);

      EChartsLayer.removeNode(container);
      const value1 = document.getElementById('util');

      expect(value1).toBeNull();
    });
  });

  describe('formatGeoJSON', () => {
    it('utils.formatGeoJSON', () => {
      const data = echarts.getMap('world')['geoJson'];
      const res = EChartsLayer.formatGeoJSON(data);
      expect(res).toBeDefined();
    });

    it('preserves polygon holes and multipolygon geometry without mutation', () => {
      const data = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { name: 'polygon' },
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [0, 0],
                  [2, 0],
                  [0, 0],
                ],
                [
                  [0.5, 0.5],
                  [1, 0.5],
                  [0.5, 0.5],
                ],
              ],
            },
          },
          {
            type: 'Feature',
            properties: { name: 'multi' },
            geometry: {
              type: 'MultiPolygon',
              coordinates: [
                [
                  [
                    [0, 0],
                    [1, 0],
                    [0, 0],
                  ],
                ],
              ],
            },
          },
        ],
      };
      const snapshot = JSON.stringify(data);
      const result = EChartsLayer.formatGeoJSON(data);
      expect(result.features[0].geometry.type).toBe('Polygon');
      expect(result.features[0].geometry.coordinates).toHaveLength(2);
      expect(result.features[1].geometry.type).toBe('MultiPolygon');
      expect(JSON.stringify(data)).toBe(snapshot);
      expect(result.features[0].geometry.coordinates).not.toBe(data.features[0].geometry.coordinates);
    });
  });
});
