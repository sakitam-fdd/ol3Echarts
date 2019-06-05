import EChartsLayer from 'ol-echarts';

describe('indexSpec', () => {
  beforeEach(() => {
  });

  afterEach(() => {
  });

  describe('utils', () => {
    it('utils.isObject', () => {
      const a = EChartsLayer.isObject({});
      const b = EChartsLayer.isObject(1);
      const c = EChartsLayer.isObject(null);
      const d = EChartsLayer.isObject(undefined);
      const e = EChartsLayer.isObject('undefined');
      const f = EChartsLayer.isObject(function() {});
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
  });
});
