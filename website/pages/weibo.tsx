import * as React from 'react';
// @ts-ignore
import { Map, View } from 'ol';
// @ts-ignore
import { Tile as TileLayer } from 'ol/layer';
// @ts-ignore
import { XYZ } from 'ol/source';
import EChartsLayer from 'ol-echarts';

import { getJSON } from '../helper';

interface PageProps {
  chart: any[];
}

interface PageState {
  zoom: number;
  rotation: number;
  center: number[];
  [propName: string]: any;
}

class Index extends React.Component<PageProps, PageState> {
  private map: any | null;

  private chart: any | null;

  private container: HTMLElement | null;

  constructor(props: PageProps, context: any) {
    super(props, context);
    this.state = {
      zoom: 5,
      rotation: 0,
      center: [113.53450137499999, 34.44104525],
    };

    this.container = null;
    this.map = null;
  }

  componentDidMount() {
    this.map = new Map({
      target: this.container,
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

    this.chart = new EChartsLayer(null, {
      hideOnMoving: true,
      hideOnZooming: true,
    });

    this.chart.appendTo(this.map);

    getJSON('./static/json/weibo-gl.json', (rawData: any[]) => {
      const weiboData = rawData.map((serieData: number[]): any[] => {
        let px = serieData[0] / 1000;
        let py = serieData[1] / 1000;
        const res = [[px, py]];
        for (let i = 2; i < serieData.length; i += 2) {
          const dx = serieData[i] / 1000;
          const dy = serieData[i + 1] / 1000;
          const x: number = px + dx;
          const y: number = py + dy;
          const ptx: number = parseFloat(x.toFixed(2));
          const pty: number = parseFloat(y.toFixed(2));
          res.push([ptx, pty, 1]);
          px = x;
          py = y;
        }
        return res;
      });
      const option = {
        title: {
          text: '微博签到数据点亮中国',
          left: 'center',
          top: 'top',
          textStyle: {
            color: '#fff',
          },
        },
        tooltip: {},
        legend: {
          left: 'right',
          data: ['强', '中', '弱'],
          textStyle: {
            color: '#ccc',
          },
        },
        series: [
          {
            name: '弱',
            type: 'scatter',
            symbolSize: 1,
            itemStyle: {
              shadowBlur: 2,
              shadowColor: 'rgba(37, 140, 249, 0.8)',
              color: 'rgba(37, 140, 249, 0.8)',
            },
            data: weiboData[0],
          },
          {
            name: '中',
            type: 'scatter',
            symbolSize: 1,
            itemStyle: {
              shadowBlur: 2,
              shadowColor: 'rgba(14, 241, 242, 0.8)',
              color: 'rgba(14, 241, 242, 0.8)',
            },
            data: weiboData[1],
          },
          {
            name: '强',
            type: 'scatter',
            symbolSize: 1,
            itemStyle: {
              shadowBlur: 2,
              shadowColor: 'rgba(255, 255, 255, 0.8)',
              color: 'rgba(255, 255, 255, 0.8)',
            },
            data: weiboData[2],
          },
        ],
      };
      this.chart.setChartOptions(option);
    });
  }

  setRef = (x = null) => {
    this.container = x;
  };

  render() {
    // @ts-ignore
    return (<div ref={this.setRef} className="map-content" />);
  }
}

export default Index;
