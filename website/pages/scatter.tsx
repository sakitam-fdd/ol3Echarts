import React from 'react';
import { Map, View } from 'ol';
import { Tile as TileLayer } from 'ol/layer';
import { XYZ } from 'ol/source';
import EChartsLayer from 'ol-echarts';
import { getJSON } from '../helper';

interface PageProps {
  chart: any[];
}

class Index extends React.Component<PageProps, object> {
  private map: any | null;

  private chart: any | null;

  private container: React.RefObject<HTMLDivElement>;

  constructor(props: PageProps, context: any) {
    super(props, context);
    this.state = {};

    this.container = React.createRef();
    this.map = null;
    this.chart = null;
  }

  componentDidMount() {
    if (this.container.current) {
      this.map = new Map({
        target: this.container.current,
        view: new View({
          center: [113.53450137499999, 34.44104525],
          projection: 'EPSG:4326',
          zoom: 5, // resolution
          rotation: 0,
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

      getJSON('./static/json/scatter.json', (res: any) => {
        if (res) {
          const data = res.locations;
          const geoCoordMap = res.coordinates;
          const convertData = (_data: any[]) => {
            const _res = [];
            for (let i = 0; i < _data.length; i++) {
              const geoCoord = geoCoordMap[_data[i].name];
              if (geoCoord) {
                _res.push({
                  name: _data[i].name,
                  value: geoCoord.concat(_data[i].value),
                });
              }
            }
            return _res;
          };
          const option = {
            title: {
              text: '全国主要城市空气质量',
              subtext: 'data from PM25.in',
              sublink: 'http://www.pm25.in',
              left: 'center',
              textStyle: {
                color: '#fff',
              },
            },
            tooltip: {
              trigger: 'item',
            },
            openlayers: {},
            legend: {
              orient: 'vertical',
              y: 'top',
              x: 'right',
              data: ['pm2.5'],
              textStyle: {
                color: '#fff',
              },
            },
            series: [
              {
                name: 'pm2.5',
                type: 'scatter',
                data: convertData(data),
                symbolSize(val: number[]) {
                  return val[2] / 10;
                },
                label: {
                  normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: false,
                  },
                  emphasis: {
                    show: true,
                  },
                },
                itemStyle: {
                  normal: {
                    color: '#ddb926',
                  },
                },
              },
              {
                name: 'Top 5',
                type: 'effectScatter',
                data: convertData(data.sort((
                  a: {
                    value: number;
                  },
                  b: {
                    value: number;
                  },
                ) => b.value - a.value).slice(0, 6)),
                symbolSize(val: number[]) {
                  return val[2] / 10;
                },
                showEffectOn: 'render',
                rippleEffect: {
                  brushType: 'stroke',
                },
                hoverAnimation: true,
                label: {
                  normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: true,
                  },
                },
                itemStyle: {
                  normal: {
                    color: '#f4e925',
                    shadowBlur: 10,
                    shadowColor: '#333',
                  },
                },
                zlevel: 1,
              }],
          };
          this.initChart(option);
          // window.setTimeout(() => {
          //   this.chart.remove();
          //   window.setTimeout(() => {
          //     this.initChart(option);
          //   }, 5000);
          // }, 5000);
        }
      });
    }
  }

  /**
   * 初始化
   */
  initChart(option: any) {
    this.chart = new EChartsLayer(option, {
      stopEvent: false,
      hideOnMoving: false,
      hideOnZooming: false,
      forcedPrecomposeRerender: true,
    });

    this.chart.on('load', (data: {
      value: any;
    }) => {
      data.value.on('click', (event: Event) => {
        console.log('click', event);
      });

      data.value.on('dblclick', (event: Event) => {
        console.log('dblclick', event);
      });

      data.value.on('mousedown', (event: Event) => {
        console.log('mousedown', event);
      });

      data.value.on('mousemove', (event: Event) => {
        console.log('mousemove', event);
      });

      data.value.on('mouseup', (event: Event) => {
        console.log('mouseup', event);
      });

      data.value.on('mouseover', (event: Event) => {
        console.log('mouseover', event);
      });

      data.value.on('mouseout', (event: Event) => {
        console.log('mouseout', event);
      });

      data.value.on('globalout', (event: Event) => {
        console.log('globalout', event);
      });

      data.value.on('contextmenu', (event: Event) => {
        console.log('contextmenu', event);
      });
    });

    this.chart.appendTo(this.map);
  }

  render() {
    return (<div ref={this.container} className="map-content" />);
  }
}

export default Index;
