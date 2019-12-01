import * as React from 'react';
import { Map, View } from 'ol';
import { Tile as TileLayer } from 'ol/layer';
import { XYZ } from 'ol/source';
import EChartsLayer from 'ol-echarts';

interface PageProps {
  chart: any[];
}

interface PageState {
  zoom: number;
  rotation: number;
  center: number[];
}

class Index extends React.Component<PageProps, PageState> {
  private map: any | null;

  private chart: any | null;

  private container: React.RefObject<HTMLDivElement>;

  constructor(props: PageProps, context: any) {
    super(props, context);
    this.state = {
      zoom: 3,
      rotation: 0,
      center: [116.28245, 39.92121],
    };

    this.container = React.createRef();
    this.map = null;
  }

  componentDidMount() {
    if (this.container.current) {
      this.map = new Map({
        target: this.container.current,
        view: new View({
          ...this.state,
          projection: 'EPSG:4326',
        }),
        layers: [
          new TileLayer({
            source: new XYZ({
              url: 'http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnline'
                + 'StreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
            }),
          }),
        ],
      });

      const options: {
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
        options.grid.push(grid);
        options.xAxis.push({
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
        // @ts-ignore-end
        options.yAxis.push({
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
        options.series.push(item);
      });

      this.chart = new EChartsLayer(options, {
        hideOnMoving: true,
        hideOnZooming: true,
      });
      this.chart.appendTo(this.map);
    }
  }

  render() {
    return (<div ref={this.container} className="map-content" />);
  }
}

export default Index;
