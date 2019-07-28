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

    it('create line ', () => {
      const _options = {"xAxis":[{"id":"0","gridId":"0","type":"category","name":"Amsterdam","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"1","gridId":"1","type":"category","name":"Athens","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"2","gridId":"2","type":"category","name":"Auckland","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"3","gridId":"3","type":"category","name":"Bangkok","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"4","gridId":"4","type":"category","name":"Barcelona","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"5","gridId":"5","type":"category","name":"Beijing","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"6","gridId":"6","type":"category","name":"Berlin","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"7","gridId":"7","type":"category","name":"Bogotá","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"8","gridId":"8","type":"category","name":"Bratislava","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"9","gridId":"9","type":"category","name":"Brussels","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"10","gridId":"10","type":"category","name":"Budapest","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"11","gridId":"11","type":"category","name":"Buenos Aires","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"12","gridId":"12","type":"category","name":"Bucharest","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"13","gridId":"13","type":"category","name":"Caracas","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"14","gridId":"14","type":"category","name":"Chicago","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"15","gridId":"15","type":"category","name":"Delhi","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"16","gridId":"16","type":"category","name":"Doha","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"17","gridId":"17","type":"category","name":"Dubai","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"18","gridId":"18","type":"category","name":"Dublin","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"19","gridId":"19","type":"category","name":"Frankfurt","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"20","gridId":"20","type":"category","name":"Geneva","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"21","gridId":"21","type":"category","name":"Helsinki","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"22","gridId":"22","type":"category","name":"Hong Kong","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"23","gridId":"23","type":"category","name":"Istanbul","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"24","gridId":"24","type":"category","name":"Jakarta","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"25","gridId":"25","type":"category","name":"Johannesburg","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"26","gridId":"26","type":"category","name":"Cairo","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"27","gridId":"27","type":"category","name":"Kiev","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"28","gridId":"28","type":"category","name":"Copenhagen","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"29","gridId":"29","type":"category","name":"Kuala Lumpur","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"30","gridId":"30","type":"category","name":"Lima","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"31","gridId":"31","type":"category","name":"Lisbon","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"32","gridId":"32","type":"category","name":"Ljubljana","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"33","gridId":"33","type":"category","name":"London","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"34","gridId":"34","type":"category","name":"Los Angeles","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"35","gridId":"35","type":"category","name":"Luxembourg","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"36","gridId":"36","type":"category","name":"Lyon","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"37","gridId":"37","type":"category","name":"Madrid","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"38","gridId":"38","type":"category","name":"Milan","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"39","gridId":"39","type":"category","name":"Manama","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"40","gridId":"40","type":"category","name":"Manila","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"41","gridId":"41","type":"category","name":"Mexico City","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"42","gridId":"42","type":"category","name":"Miami","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"43","gridId":"43","type":"category","name":"Montreal","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"44","gridId":"44","type":"category","name":"Moscow","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"45","gridId":"45","type":"category","name":"Mumbai","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"46","gridId":"46","type":"category","name":"Munich","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"47","gridId":"47","type":"category","name":"Nairobi","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"48","gridId":"48","type":"category","name":"New York","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"49","gridId":"49","type":"category","name":"Nicosia","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"50","gridId":"50","type":"category","name":"Oslo","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"51","gridId":"51","type":"category","name":"Paris","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"52","gridId":"52","type":"category","name":"Prague","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"53","gridId":"53","type":"category","name":"Riga","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"54","gridId":"54","type":"category","name":"Rio de Janeiro","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"55","gridId":"55","type":"category","name":"Rome","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"56","gridId":"56","type":"category","name":"Santiago de Chile","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"57","gridId":"57","type":"category","name":"São Paulo","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"58","gridId":"58","type":"category","name":"Seoul","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"59","gridId":"59","type":"category","name":"Shanghai","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"60","gridId":"60","type":"category","name":"Singapore","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"61","gridId":"61","type":"category","name":"Sofia","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"62","gridId":"62","type":"category","name":"Stockholm","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"63","gridId":"63","type":"category","name":"Sydney","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"64","gridId":"64","type":"category","name":"Taipei","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"65","gridId":"65","type":"category","name":"Tallinn","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"66","gridId":"66","type":"category","name":"Tel Aviv","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"67","gridId":"67","type":"category","name":"Tokyo","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"68","gridId":"68","type":"category","name":"Toronto","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"69","gridId":"69","type":"category","name":"Vilnius","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"70","gridId":"70","type":"category","name":"Warsaw","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"71","gridId":"71","type":"category","name":"Vienna","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100},{"id":"72","gridId":"72","type":"category","name":"Zurich","nameStyle":{"color":"#ddd","fontSize":12},"nameLocation":"middle","nameGap":3,"splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"onZero":false,"lineStyle":{"color":"#bbb"}},"data":["2006","2007","2008","2009","2010","2011"],"z":100}],"yAxis":[{"id":"0","gridId":"0","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"1","gridId":"1","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"2","gridId":"2","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"3","gridId":"3","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"4","gridId":"4","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"5","gridId":"5","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"6","gridId":"6","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"7","gridId":"7","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"8","gridId":"8","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"9","gridId":"9","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"10","gridId":"10","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"11","gridId":"11","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"12","gridId":"12","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"13","gridId":"13","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"14","gridId":"14","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"15","gridId":"15","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"16","gridId":"16","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"17","gridId":"17","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"18","gridId":"18","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"19","gridId":"19","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"20","gridId":"20","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"21","gridId":"21","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"22","gridId":"22","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"23","gridId":"23","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"24","gridId":"24","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"25","gridId":"25","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"26","gridId":"26","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"27","gridId":"27","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"28","gridId":"28","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"29","gridId":"29","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"30","gridId":"30","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"31","gridId":"31","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"32","gridId":"32","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"33","gridId":"33","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"34","gridId":"34","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"35","gridId":"35","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"36","gridId":"36","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"37","gridId":"37","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"38","gridId":"38","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"39","gridId":"39","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"40","gridId":"40","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"41","gridId":"41","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"42","gridId":"42","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"43","gridId":"43","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"44","gridId":"44","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"45","gridId":"45","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"46","gridId":"46","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"47","gridId":"47","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"48","gridId":"48","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"49","gridId":"49","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"50","gridId":"50","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"51","gridId":"51","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"52","gridId":"52","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"53","gridId":"53","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"54","gridId":"54","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"55","gridId":"55","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"56","gridId":"56","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"57","gridId":"57","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"58","gridId":"58","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"59","gridId":"59","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"60","gridId":"60","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"61","gridId":"61","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"62","gridId":"62","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"63","gridId":"63","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"64","gridId":"64","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"65","gridId":"65","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"66","gridId":"66","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"67","gridId":"67","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"68","gridId":"68","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"69","gridId":"69","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"70","gridId":"70","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"71","gridId":"71","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100},{"id":"72","gridId":"72","splitLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"show":false},"axisLine":{"lineStyle":{"color":"#bbb"}},"z":100}],"grid":[{"id":"0","width":30,"height":30,"z":100},{"id":"1","width":30,"height":30,"z":100},{"id":"2","width":30,"height":30,"z":100},{"id":"3","width":30,"height":30,"z":100},{"id":"4","width":30,"height":30,"z":100},{"id":"5","width":30,"height":30,"z":100},{"id":"6","width":30,"height":30,"z":100},{"id":"7","width":30,"height":30,"z":100},{"id":"8","width":30,"height":30,"z":100},{"id":"9","width":30,"height":30,"z":100},{"id":"10","width":30,"height":30,"z":100},{"id":"11","width":30,"height":30,"z":100},{"id":"12","width":30,"height":30,"z":100},{"id":"13","width":30,"height":30,"z":100},{"id":"14","width":30,"height":30,"z":100},{"id":"15","width":30,"height":30,"z":100},{"id":"16","width":30,"height":30,"z":100},{"id":"17","width":30,"height":30,"z":100},{"id":"18","width":30,"height":30,"z":100},{"id":"19","width":30,"height":30,"z":100},{"id":"20","width":30,"height":30,"z":100},{"id":"21","width":30,"height":30,"z":100},{"id":"22","width":30,"height":30,"z":100},{"id":"23","width":30,"height":30,"z":100},{"id":"24","width":30,"height":30,"z":100},{"id":"25","width":30,"height":30,"z":100},{"id":"26","width":30,"height":30,"z":100},{"id":"27","width":30,"height":30,"z":100},{"id":"28","width":30,"height":30,"z":100},{"id":"29","width":30,"height":30,"z":100},{"id":"30","width":30,"height":30,"z":100},{"id":"31","width":30,"height":30,"z":100},{"id":"32","width":30,"height":30,"z":100},{"id":"33","width":30,"height":30,"z":100},{"id":"34","width":30,"height":30,"z":100},{"id":"35","width":30,"height":30,"z":100},{"id":"36","width":30,"height":30,"z":100},{"id":"37","width":30,"height":30,"z":100},{"id":"38","width":30,"height":30,"z":100},{"id":"39","width":30,"height":30,"z":100},{"id":"40","width":30,"height":30,"z":100},{"id":"41","width":30,"height":30,"z":100},{"id":"42","width":30,"height":30,"z":100},{"id":"43","width":30,"height":30,"z":100},{"id":"44","width":30,"height":30,"z":100},{"id":"45","width":30,"height":30,"z":100},{"id":"46","width":30,"height":30,"z":100},{"id":"47","width":30,"height":30,"z":100},{"id":"48","width":30,"height":30,"z":100},{"id":"49","width":30,"height":30,"z":100},{"id":"50","width":30,"height":30,"z":100},{"id":"51","width":30,"height":30,"z":100},{"id":"52","width":30,"height":30,"z":100},{"id":"53","width":30,"height":30,"z":100},{"id":"54","width":30,"height":30,"z":100},{"id":"55","width":30,"height":30,"z":100},{"id":"56","width":30,"height":30,"z":100},{"id":"57","width":30,"height":30,"z":100},{"id":"58","width":30,"height":30,"z":100},{"id":"59","width":30,"height":30,"z":100},{"id":"60","width":30,"height":30,"z":100},{"id":"61","width":30,"height":30,"z":100},{"id":"62","width":30,"height":30,"z":100},{"id":"63","width":30,"height":30,"z":100},{"id":"64","width":30,"height":30,"z":100},{"id":"65","width":30,"height":30,"z":100},{"id":"66","width":30,"height":30,"z":100},{"id":"67","width":30,"height":30,"z":100},{"id":"68","width":30,"height":30,"z":100},{"id":"69","width":30,"height":30,"z":100},{"id":"70","width":30,"height":30,"z":100},{"id":"71","width":30,"height":30,"z":100},{"id":"72","width":30,"height":30,"z":100}],"series":[{"id":"0","type":"line","xAxisId":"0","yAxisId":"0","data":[1.651,1.59,2.205,0.974,0.93,2.477],"coordinates":[4.895168,52.370216],"z":100},{"id":"1","type":"line","xAxisId":"1","yAxisId":"1","data":[3.314,2.991,4.236,1.349,4.701,3.1],"coordinates":[-83.357567,33.951935],"z":100},{"id":"2","type":"line","xAxisId":"2","yAxisId":"2","data":[3.362,2.377,3.959,2.116,2.303,4.027],"coordinates":[174.763332,-36.84846],"z":100},{"id":"3","type":"line","xAxisId":"3","yAxisId":"3","data":[4.637,2.242,5.468,-0.845,3.272,3.807],"coordinates":[100.501765,13.756331],"z":100},{"id":"4","type":"line","xAxisId":"4","yAxisId":"4","data":[3.563,2.844,4.13,-0.238,2.043,3.052],"coordinates":[2.173403,41.385064],"z":100},{"id":"5","type":"line","xAxisId":"5","yAxisId":"5","data":[1.467,4.767,5.852,-0.683,3.325,5.417],"coordinates":[116.407395,39.904211],"z":100},{"id":"6","type":"line","xAxisId":"6","yAxisId":"6","data":[1.784,2.276,2.754,0.234,1.15,2.483],"coordinates":[13.404954,52.520007],"z":100},{"id":"7","type":"line","xAxisId":"7","yAxisId":"7","data":[4.296,5.544,6.998,4.202,2.27,3.416],"coordinates":[-74.072092,4.710989],"z":100},{"id":"8","type":"line","xAxisId":"8","yAxisId":"8","data":[4.264,1.89,3.935,0.925,0.697,4.079],"coordinates":[17.107748,48.148596],"z":100},{"id":"9","type":"line","xAxisId":"9","yAxisId":"9","data":[2.337,1.814,4.493,-0.009,2.332,3.469],"coordinates":[4.35171,50.85034],"z":100},{"id":"10","type":"line","xAxisId":"10","yAxisId":"10","data":[3.878,7.934,6.067,4.209,4.85,3.9],"coordinates":[19.040235,47.497912],"z":100},{"id":"11","type":"line","xAxisId":"11","yAxisId":"11","data":[10.898,8.83,8.585,6.27,10.461,9.775],"coordinates":[-58.381559,-34.603684],"z":100},{"id":"12","type":"line","xAxisId":"12","yAxisId":"12","data":[6.552,4.84,7.848,5.581,6.101,5.812],"coordinates":[26.102538,44.426767],"z":100},{"id":"13","type":"line","xAxisId":"13","yAxisId":"13","data":[13.654,18.703,30.37,27.081,28.187,26.09],"coordinates":[-66.903606,10.480594],"z":100},{"id":"14","type":"line","xAxisId":"14","yAxisId":"14","data":[3.222,2.86,3.798,-0.321,1.641,3.142],"coordinates":[-87.629798,41.878114],"z":100},{"id":"15","type":"line","xAxisId":"15","yAxisId":"15","data":[6.177,6.372,8.349,10.882,11.99,8.628],"coordinates":[77.209021,28.613939],"z":100},{"id":"16","type":"line","xAxisId":"16","yAxisId":"16","data":[11.828,13.764,15.049,-4.865,-2.433,2],"coordinates":[51.53104,25.285447],"z":100},{"id":"17","type":"line","xAxisId":"17","yAxisId":"17","data":[9.272,11.115,11.454,1.56,0.878,0.882],"coordinates":[55.270783,25.204849],"z":100},{"id":"18","type":"line","xAxisId":"18","yAxisId":"18","data":[2.7,2.873,3.108,-1.683,-1.557,1.139],"coordinates":[-6.26031,53.349805],"z":100},{"id":"19","type":"line","xAxisId":"19","yAxisId":"19","data":[1.784,2.276,2.754,0.234,1.15,2.483],"coordinates":[8.682127,50.110922],"z":100},{"id":"20","type":"line","xAxisId":"20","yAxisId":"20","data":[1.047,0.732,2.43,-0.476,0.685,0.228],"coordinates":[6.143158,46.204391],"z":100},{"id":"21","type":"line","xAxisId":"21","yAxisId":"21","data":[1.279,1.584,3.9,1.635,1.686,3.323],"coordinates":[24.938379,60.169856],"z":100},{"id":"22","type":"line","xAxisId":"22","yAxisId":"22","data":[2.018,2.027,4.285,0.588,2.312,5.281],"coordinates":[114.109497,22.396428],"z":100},{"id":"23","type":"line","xAxisId":"23","yAxisId":"23","data":[9.597,8.756,10.444,6.251,8.567,6.472],"coordinates":[28.978359,41.008238],"z":100},{"id":"24","type":"line","xAxisId":"24","yAxisId":"24","data":[13.104,6.034,9.777,4.813,5.133,5.357],"coordinates":[106.845599,-6.208763],"z":100},{"id":"25","type":"line","xAxisId":"25","yAxisId":"25","data":[4.688,7.09,11.504,7.125,4.27,4.999],"coordinates":[28.047305,-26.204103],"z":100},{"id":"26","type":"line","xAxisId":"26","yAxisId":"26","data":[4.198,10.952,11.704,16.244,11.703,11.068],"coordinates":[31.235712,30.04442],"z":100},{"id":"27","type":"line","xAxisId":"27","yAxisId":"27","data":[9.009,12.843,25.201,15.9,9.365,7.958],"coordinates":[30.5234,50.4501],"z":100},{"id":"28","type":"line","xAxisId":"28","yAxisId":"28","data":[1.9,1.712,3.399,1.319,2.298,2.757],"coordinates":[12.568337,55.676097],"z":100},{"id":"29","type":"line","xAxisId":"29","yAxisId":"29","data":[3.609,2.027,5.4,0.6,1.7,3.2],"coordinates":[101.686855,3.139003],"z":100},{"id":"30","type":"line","xAxisId":"30","yAxisId":"30","data":[2.004,1.78,5.788,2.936,1.53,3.369],"coordinates":[-77.042793,-12.046374],"z":100},{"id":"31","type":"line","xAxisId":"31","yAxisId":"31","data":[3.043,2.423,2.646,-0.903,1.391,3.558],"coordinates":[-9.139337,38.722252],"z":100},{"id":"32","type":"line","xAxisId":"32","yAxisId":"32","data":[2.458,3.611,5.7,0.855,1.834,1.828],"coordinates":[14.505751,46.056947],"z":100},{"id":"33","type":"line","xAxisId":"33","yAxisId":"33","data":[2.3,2.346,3.629,2.12,3.339,4.454],"coordinates":[-0.127758,51.507351],"z":100},{"id":"34","type":"line","xAxisId":"34","yAxisId":"34","data":[3.222,2.86,3.798,-0.321,1.641,3.142],"coordinates":[-118.243685,34.052234],"z":100},{"id":"35","type":"line","xAxisId":"35","yAxisId":"35","data":[2.667,2.313,3.383,0.37,2.274,3.409],"coordinates":[6.129583,49.815273],"z":100},{"id":"36","type":"line","xAxisId":"36","yAxisId":"36","data":[1.912,1.607,3.159,0.103,1.735,2.294],"coordinates":[4.835659,45.764043],"z":100},{"id":"37","type":"line","xAxisId":"37","yAxisId":"37","data":[3.563,2.844,4.13,-0.238,2.043,3.052],"coordinates":[-3.70379,40.416775],"z":100},{"id":"38","type":"line","xAxisId":"38","yAxisId":"38","data":[2.217,2.038,3.5,0.764,1.639,2.903],"coordinates":[9.185924,45.465422],"z":100},{"id":"39","type":"line","xAxisId":"39","yAxisId":"39","data":[2.041,3.252,3.533,2.786,1.969,1],"coordinates":[50.58605,26.228516],"z":100},{"id":"40","type":"line","xAxisId":"40","yAxisId":"40","data":[6.234,2.8,9.299,4.191,3.793,4.761],"coordinates":[120.984219,14.599512],"z":100},{"id":"41","type":"line","xAxisId":"41","yAxisId":"41","data":[3.629,3.967,5.125,5.297,4.155,3.403],"coordinates":[-99.133208,19.432608],"z":100},{"id":"42","type":"line","xAxisId":"42","yAxisId":"42","data":[3.222,2.86,3.798,-0.321,1.641,3.142],"coordinates":[-80.19179,25.76168],"z":100},{"id":"43","type":"line","xAxisId":"43","yAxisId":"43","data":[2.018,2.123,2.385,0.3,1.776,2.891],"coordinates":[-73.567256,45.501689],"z":100},{"id":"44","type":"line","xAxisId":"44","yAxisId":"44","data":[9.679,9.007,14.117,11.654,6.854,8.443],"coordinates":[37.6173,55.755826],"z":100},{"id":"45","type":"line","xAxisId":"45","yAxisId":"45","data":[6.177,6.372,8.349,10.882,11.99,8.628],"coordinates":[72.877656,19.075984],"z":100},{"id":"46","type":"line","xAxisId":"46","yAxisId":"46","data":[1.784,2.276,2.754,0.234,1.15,2.483],"coordinates":[11.581981,48.135125],"z":100},{"id":"47","type":"line","xAxisId":"47","yAxisId":"47","data":[14.455,9.76,13.1,10.552,4.087,13.998],"coordinates":[36.821946,-1.292066],"z":100},{"id":"48","type":"line","xAxisId":"48","yAxisId":"48","data":[3.222,2.86,3.798,-0.321,1.641,3.142],"coordinates":[-74.005941,40.712784],"z":100},{"id":"49","type":"line","xAxisId":"49","yAxisId":"49","data":[2.245,2.165,4.377,0.174,2.564,3.486],"coordinates":[33.382276,35.185566],"z":100},{"id":"50","type":"line","xAxisId":"50","yAxisId":"50","data":[2.332,0.729,3.766,2.166,2.4,1.301],"coordinates":[10.752245,59.913869],"z":100},{"id":"51","type":"line","xAxisId":"51","yAxisId":"51","data":[1.912,1.607,3.159,0.103,1.735,2.294],"coordinates":[2.352222,48.856614],"z":100},{"id":"52","type":"line","xAxisId":"52","yAxisId":"52","data":[2.543,2.862,6.339,1.034,1.464,1.929],"coordinates":[14.4378,50.075538],"z":100},{"id":"53","type":"line","xAxisId":"53","yAxisId":"53","data":[6.571,10.083,15.252,3.259,-1.224,4.223],"coordinates":[24.105186,56.949649],"z":100},{"id":"54","type":"line","xAxisId":"54","yAxisId":"54","data":[4.196,3.638,5.672,4.888,5.039,6.636],"coordinates":[-43.172896,-22.906847],"z":100},{"id":"55","type":"line","xAxisId":"55","yAxisId":"55","data":[2.217,2.038,3.5,0.764,1.639,2.903],"coordinates":[12.496366,41.902783],"z":100},{"id":"56","type":"line","xAxisId":"56","yAxisId":"56","data":[3.392,4.408,8.716,1.485,1.408,3.34],"coordinates":[-70.669265,-33.44889],"z":100},{"id":"57","type":"line","xAxisId":"57","yAxisId":"57","data":[4.196,3.638,5.672,4.888,5.039,6.636],"coordinates":[-46.633309,-23.55052],"z":100},{"id":"58","type":"line","xAxisId":"58","yAxisId":"58","data":[1.467,4.767,5.852,2.757,2.938,4.026],"coordinates":[126.977969,37.566535],"z":100},{"id":"59","type":"line","xAxisId":"59","yAxisId":"59","data":[2.242,2.535,4.674,-0.683,3.325,5.417],"coordinates":[121.473701,31.230416],"z":100},{"id":"60","type":"line","xAxisId":"60","yAxisId":"60","data":[0.973,2.096,6.514,0.589,2.824,5.247],"coordinates":[103.819836,1.352083],"z":100},{"id":"61","type":"line","xAxisId":"61","yAxisId":"61","data":[7.417,7.571,11.95,2.473,3.036,3.389],"coordinates":[23.321868,42.697708],"z":100},{"id":"62","type":"line","xAxisId":"62","yAxisId":"62","data":[1.498,1.677,3.298,1.989,1.907,1.366],"coordinates":[18.068581,59.329323],"z":100},{"id":"63","type":"line","xAxisId":"63","yAxisId":"63","data":[3.538,2.332,4.353,1.82,2.845,3.389],"coordinates":[151.209296,-33.86882],"z":100},{"id":"64","type":"line","xAxisId":"64","yAxisId":"64","data":[0.598,1.798,3.527,-0.872,0.963,1.422],"coordinates":[121.565418,25.032969],"z":100},{"id":"65","type":"line","xAxisId":"65","yAxisId":"65","data":[4.43,6.598,10.366,-0.085,2.894,5.121],"coordinates":[24.753575,59.436961],"z":100},{"id":"66","type":"line","xAxisId":"66","yAxisId":"66","data":[2.107,0.516,4.745,3.342,2.686,3.45],"coordinates":[34.781768,32.0853],"z":100},{"id":"67","type":"line","xAxisId":"67","yAxisId":"67","data":[0.3,0,1.396,-1.347,-0.72,-0.283],"coordinates":[139.691706,35.689487],"z":100},{"id":"68","type":"line","xAxisId":"68","yAxisId":"68","data":[2.018,2.123,2.385,0.3,1.776,2.891],"coordinates":[-79.383184,43.653226],"z":100},{"id":"69","type":"line","xAxisId":"69","yAxisId":"69","data":[3.788,5.772,11.138,4.164,1.19,4.124],"coordinates":[25.279651,54.687156],"z":100},{"id":"70","type":"line","xAxisId":"70","yAxisId":"70","data":[1.033,2.493,4.215,3.45,2.514,4.268],"coordinates":[21.012229,52.229676],"z":100},{"id":"71","type":"line","xAxisId":"71","yAxisId":"71","data":[1.686,2.203,3.223,0.401,1.69,3.6],"coordinates":[16.373819,48.208174],"z":100},{"id":"72","type":"line","xAxisId":"72","yAxisId":"72","data":[1.047,0.732,2.43,-0.476,0.685,0.228],"coordinates":[8.541694,47.376887],"z":100}],"animation":false,"title":{"text":"Inflation from 2006 to 2011","subtext":"data from macrofocus","sublink":"https://www.macrofocus.com/public/products/infoscope/datasets/pricesandearnings/","left":"center","top":5,"itemGap":0,"textStyle":{"color":"#eee"}},"tooltip":{"trigger":"axis"}};

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
