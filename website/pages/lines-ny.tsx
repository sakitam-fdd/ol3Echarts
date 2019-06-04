import * as React from 'react';
// @ts-ignore
import { Map, View } from 'ol';
// @ts-ignore
import { Tile as TileLayer } from 'ol/layer';
// @ts-ignore
import { XYZ } from 'ol/source';
import EChartsLayer from 'ol-echarts';

interface PageProps {
  chart: any[];
}

interface PageState {
  zoom: number;
  bearing: number;
  center: number[];
}

const CHUNK_COUNT = 10;

class Index extends React.Component<PageProps, PageState> {
  private map: any | null;

  private chart: any | null;

  private container: HTMLElement | null;

  constructor(props: PageProps, context: any) {
    super(props, context);
    this.state = {
      zoom: 10,
      bearing: 0,
      center: [-74.04327099998152, 40.86737600240287],
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
    },
    {
      progressive: 20000,
      backgroundColor: 'transparent',
      series: [{
        type: 'lines',
        blendMode: 'lighter',
        dimensions: ['value'],
        data: new Float64Array(),
        polyline: true,
        large: true,
        lineStyle: {
          color: 'orange',
          width: 0.5,
          opacity: 0.3,
        },
      }],
    });

    this.chart.appendTo(this.map);

    this.fetchData(0);
  }

  setRef = (x = null) => {
    this.container = x;
  };

  fetchData(idx: number) {
    if (idx >= CHUNK_COUNT) {
      return;
    }
    const dataURL = `./static/examples/incremental/data/links_ny_${idx}.bin`;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', dataURL, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = () => {
      const rawData = new Float32Array(xhr.response);
      const data = new Float64Array(rawData.length - 2);
      const offsetX = rawData[0];
      const offsetY = rawData[1];
      let off = 0;
      for (let i = 2; i < rawData.length;) {
        const count = rawData[i++];
        data[off++] = count;
        for (let k = 0; k < count; k++) {
          const x = rawData[i++] + offsetX;
          const y = rawData[i++] + offsetY;
          data[off++] = x;
          data[off++] = y;
        }
      }
      this.chart.appendData({
        seriesIndex: 0,
        data,
      }, true);
      this.fetchData(idx + 1);
    };
    xhr.send();
  }

  render() {
    // @ts-ignore
    return (<div ref={this.setRef} className="map-content" />);
  }
}

export default Index;
