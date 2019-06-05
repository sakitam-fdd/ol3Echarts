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

    getJSON('./static/json/wind.json', (windData: any) => {
      const data = [];
      let p = 0;
      let maxMag = 0;
      let minMag = Infinity;
      for (let j = 0; j < windData.ny; j++) {
        for (let i = 0; i < windData.nx; i++, p++) {
          const vx = windData.data[p][0];
          const vy = windData.data[p][1];
          const mag = Math.sqrt(vx * vx + vy * vy);
          // 数据是一个一维数组
          // [ [经度, 维度，向量经度方向的值，向量维度方向的值] ]
          data.push([
            i / windData.nx * 360 - 180,
            j / windData.ny * 180 - 90,
            vx,
            vy,
            mag,
          ]);
          maxMag = Math.max(mag, maxMag);
          minMag = Math.min(mag, minMag);
        }
      }

      const option = {
        title: {
          text: '风场',
          left: 'center',
          top: 'top',
          textStyle: {
            color: '#fff',
          },
        },
        visualMap: {
          left: 'left',
          min: minMag,
          max: maxMag,
          dimension: 4,
          inRange: {
            // color: ['green', 'yellow', 'red']
            color: [
              '#313695', '#4575b4', '#74add1',
              '#abd9e9', '#e0f3f8', '#ffffbf',
              '#fee090', '#fdae61', '#f46d43',
              '#d73027', '#a50026',
            ],
          },
          realtime: false,
          calculable: true,
          textStyle: {
            color: '#fff',
          },
        },
        series: [
          {
            type: 'flowGL',
            data,
            particleDensity: 512,
            particleSpeed: 2,
            particleSize: 1,
            // gridWidth: windData.nx,
            // gridHeight: windData.ny,
            itemStyle: {
              opacity: 0.7,
            },
          },
        ],
      };

      this.chart = new EChartsLayer({
        hideOnMoving: true,
        hideOnZooming: true,
      }, option);

      this.chart.appendTo(this.map);
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
