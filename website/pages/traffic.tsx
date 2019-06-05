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

// 处理数据
function convertData(sourceData: any) {
  // eslint-disable-next-line prefer-spread
  return [].concat.apply([], sourceData.map((busLine: []) => {
    let prevPoint = null;
    const points = [];
    const value = busLine.shift();
    for (let i = 0; i < busLine.length; i += 2) {
      let point = [busLine[i], busLine[i + 1]];
      if (i > 0) {
        // @ts-ignore
        point = [prevPoint[0] + point[0], prevPoint[1] + point[1]];
      }
      prevPoint = point;
      points.push([point[0] / 1e5, point[1] / 1e5]);
    }
    return {
      value,
      coords: points,
    };
  }));
}

class Index extends React.Component<PageProps, PageState> {
  private map: any | null;

  private chart: any | null;

  private container: HTMLElement | null;

  constructor(props: PageProps, context: any) {
    super(props, context);
    this.state = {
      zoom: 12,
      rotation: 0,
      center: [120.76264061813247, 30.74805248565917],
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
      hideOnMoving: false,
      hideOnZooming: false,
    });

    this.chart.appendTo(this.map);

    getJSON('./static/json/traffic.json', (data: any) => {
      if (data) {
        // 配置项
        const option = {
          visualMap: {
            type: 'piecewise',
            left: 'right',
            top: 'top',
            min: 0,
            max: 15,
            splitNumber: 5,
            maxOpen: true,
            color: ['red', 'yellow', 'green'],
          },
          tooltip: {
            formatter(params: {
              value: any;
            }) {
              return `拥堵指数:${params.value}`;
            },
            trigger: 'item',
          },
          series: [
            {
              type: 'lines',
              polyline: true,
              lineStyle: {
                normal: {
                  opacity: 1,
                  width: 4,
                },
                emphasis: {
                  width: 6,
                },
              },
              effect: {
                show: true,
                symbolSize: 2,
                color: 'white',
              },
              data: convertData(data),
            },
          ],
        };

        this.chart.setChartOptions(option);
      }
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
