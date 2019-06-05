import * as React from 'react';
// @ts-ignore
import { Map, View } from 'ol';
// @ts-ignore
import { Tile as TileLayer } from 'ol/layer';
// @ts-ignore
import { XYZ } from 'ol/source';
import EChartsLayer from 'ol-echarts';
// @ts-ignore
import echarts from 'echarts';

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
      zoom: 9,
      rotation: 0,
      center: [116.28245, 39.92121],
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

    this.chart = new EChartsLayer({
      hideOnMoving: true,
      hideOnZooming: true,
    });
    this.chart.appendTo(this.map);
    getJSON('./static/json/lines-bus.json', (rawData: any) => {
      const hStep = 300 / (rawData.length - 1);
      const busLines = rawData.map((busLine: any[], idx: number) => {
        let prevPt = [];
        const points = [];
        for (let i = 0; i < busLine.length; i += 2) {
          let pt = [busLine[i], busLine[i + 1]];
          if (i > 0 && prevPt.length > 1) {
            pt = [prevPt[0] + pt[0], prevPt[1] + pt[1]];
          }
          prevPt = pt;

          points.push([pt[0] / 1e4, pt[1] / 1e4]);
        }
        return {
          coords: points,
          lineStyle: {
            normal: {
              color: echarts.color.modifyHSL('#5A94DF', Math.round(hStep * idx)),
            },
          },
        };
      });
      const option = {
        series: [
          {
            type: 'lines',
            polyline: true,
            data: busLines,
            lineStyle: {
              normal: {
                width: 0,
              },
            },
            effect: {
              constantSpeed: 20,
              show: true,
              trailLength: 0.5,
              symbolSize: 1.5,
            },
            zlevel: 1,
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
