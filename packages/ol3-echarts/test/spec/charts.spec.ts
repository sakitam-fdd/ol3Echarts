// @ts-ignore
import ol from 'openlayers';
import EChartsLayer from '../../src';

const Map = ol.Map;
const View = ol.View;
const TileLayer = ol.layer.Tile;
const OSM = ol.source.OSM;

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

  describe('charts types', () => {
    it('create pie', () => {
      const layer = new EChartsLayer({
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
      }, {
        stopEvent: false,
        hideOnMoving: false,
        hideOnZooming: false,
        forcedPrecomposeRerender: false,
      });

      expect(layer).toBeDefined();

      layer.appendTo(map);

      expect(layer instanceof EChartsLayer).toBe(true);
    });

    it('create bar', () => {
      const _options: {
        color: string[];
        tooltip: any;
        legend: any;
        grid: any[];
        xAxis: any[];
        yAxis: any[];
        series: any[];
      } = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        legend: {
          x: 'left',
          show: true,
          data: ['包租费', '物业费', '水电', '网络', '燃气'],
          selectedMode: 'multiple',
        },
        grid: [],
        xAxis: [],
        yAxis: [],
        series: [],
      };

      const series = [
        {
          name: '包租费',
          type: 'bar',
          barWidth: '15',
          coordinates: [87.1435546875, 43.79150390625],
          data: [20, 12, 31, 34, 31],
          xAxisIndex: 0,
          yAxisIndex: 0,
        },
        {
          name: '物业费',
          type: 'bar',
          barWidth: '15',
          coordinates: [86.5283203125, 32.40966796875],
          data: [1, 1, 2, 3, 1],
          xAxisIndex: 1,
          yAxisIndex: 1,
        },
        {
          name: '水电',
          type: 'bar',
          barWidth: '15',
          coordinates: [98.876953125, 35.74951171875],
          data: [1, 1, 2, 3, 1],
          xAxisIndex: 2,
          yAxisIndex: 2,
        },
        {
          name: '网络',
          type: 'bar',
          barWidth: '15',
          coordinates: [108.80859375, 23.44482421875],
          data: [1, 1, 2, 3, 1],
          xAxisIndex: 3,
          yAxisIndex: 3,
        },
        {
          name: '燃气',
          type: 'bar',
          barWidth: '15',
          coordinates: [110.53450137499999, 38.44104525],
          data: [1, 1, 2, 3, 1],
          xAxisIndex: 4,
          yAxisIndex: 4,
        },
      ];

      series.forEach((item, index) => {
        const grid = {
          show: true,
          containLabel: false,
          borderWidth: 0,
          borderColor: '#fff',
          width: 150,
          height: 80,
        };
        _options.grid.push(grid);
        _options.xAxis.push({
          type: 'category',
          show: true,
          gridIndex: index,
          nameTextStyle: {
            color: '#3c3c3c',
          },
          axisLine: {
            show: false,
            onZero: false,
          },
          axisLabel: {
            show: false,
            interval: 0,
            rotate: -45,
            textStyle: {
              color: '#3c3c3c',
              fontSize: 10,
            },
          },
          axisTick: {
            show: false,
          },
          data: ['新虹桥', '中山公园', '虹桥', '镇宁路', '天山古北'],
        });
        _options.yAxis.push({
          type: 'value',
          show: true,
          min: 0.001,
          splitLine: { show: false },
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
            onZero: false,
          },
          nameGap: '1',
          axisTick: {
            show: false,
          },
          nameTextStyle: {
            color: '#3c3c3c',
            fontSize: 14,
          },
          gridIndex: index,
        });
        _options.series.push(item);
      });

      const layer = new EChartsLayer(_options, {
        stopEvent: false,
        hideOnMoving: false,
        hideOnZooming: false,
        forcedPrecomposeRerender: false,
      });

      expect(layer).toBeDefined();

      layer.appendTo(map);

      expect(layer instanceof EChartsLayer).toBe(true);
    });
  });
});
