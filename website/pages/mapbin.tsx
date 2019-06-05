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

const COLORS = ['#070093', '#1c3fbf', '#1482e5', '#70b4eb', '#b4e0f3', '#ffffff'];
const lngExtent = [39.5, 40.6];
const latExtent = [115.9, 116.8];
const cellCount = [50, 50];
const cellSizeCoord = [
  (lngExtent[1] - lngExtent[0]) / cellCount[0],
  (latExtent[1] - latExtent[0]) / cellCount[1],
];

function getCoord(params: any, api: any, lngIndex: number, latIndex: number) {
  const coords = params.context.coords || (params.context.coords = []);
  const key = `${lngIndex}-${latIndex}`;

  if (!coords[key]) {
    coords[key] = api.coord([
      +(latExtent[0] + lngIndex * cellSizeCoord[0]).toFixed(6),
      +(lngExtent[0] + latIndex * cellSizeCoord[1]).toFixed(6),
    ]);
  }

  return coords[key];
}

function renderItem(params: any, api: any) {
  const lngIndex = api.value(0);
  const latIndex = api.value(1);
  const pointLeftTop = getCoord(params, api, lngIndex, latIndex);
  const pointRightBottom = getCoord(params, api, lngIndex + 1, latIndex + 1);

  return {
    type: 'rect',
    shape: {
      x: pointLeftTop[0],
      y: pointLeftTop[1],
      width: pointRightBottom[0] - pointLeftTop[0],
      height: pointRightBottom[1] - pointLeftTop[1],
    },
    style: api.style({
      stroke: 'rgba(0,0,0,0.1)',
    }),
    styleEmphasis: api.styleEmphasis(),
  };
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

    getJSON('./static/json/bin.json', (data: any) => {
      this.chart = new EChartsLayer({
        tooltip: {
          formatter(params: {
            value: any;
          }) {
            return params.value;
          },
          trigger: 'item',
        },
        visualMap: {
          type: 'piecewise',
          inverse: true,
          top: 10,
          right: 10,
          pieces: [
            {
              value: 0, color: COLORS[0],
            }, {
              value: 1, color: COLORS[1],
            }, {
              value: 2, color: COLORS[2],
            }, {
              value: 3, color: COLORS[3],
            }, {
              value: 4, color: COLORS[4],
            }, {
              value: 5, color: COLORS[5],
            },
          ],
          borderColor: '#ccc',
          borderWidth: 2,
          backgroundColor: '#eee',
          dimension: 2,
          inRange: {
            color: COLORS,
            opacity: 0.7,
          },
        },
        series: [
          {
            type: 'custom',
            renderItem,
            animation: false,
            itemStyle: {
              emphasis: {
                color: 'yellow',
              },
            },
            encode: {
              tooltip: 2,
            },
            data,
          },
        ],
      }, {
        hideOnMoving: true,
        hideOnZooming: true,
      });

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
