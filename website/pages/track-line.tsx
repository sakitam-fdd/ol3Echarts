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

    this.chart = new EChartsLayer(null, {
      hideOnMoving: false,
      hideOnZooming: false,
    });

    this.chart.appendTo(this.map);

    getJSON('./static/json/tracks.json', (data: any[]) => {
      const lines = data.map((track: any[]) => ({
          coords: track.map((seg) => seg.coord),
        }));
      const option = {
        title: {
          text: '杭州热门步行路线',
          left: 'center',
          textStyle: {
            color: '#eee',
          },
        },
        backgroundColor: 'transparent',
        series: [{
          type: 'lines',
          data: lines,
          polyline: true,
          lineStyle: {
            normal: {
              color: '#ddb926',
              opacity: 0.6,
              width: 1,
            },
          },
        }],
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
