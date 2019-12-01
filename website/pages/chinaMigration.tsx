import * as React from 'react';
import { Map, View } from 'ol';
import { Tile as TileLayer } from 'ol/layer';
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

// 经纬度获取
function getGeoCoord(geoCoord: any[], name: string) {
  const city = name.split('_').pop();
  if (city) {
    const coord = geoCoord[city];
    return coord;
  }

  return null;
}

// 线路获取
function getLineCoord(geoCoord: any, fromname: string, toname: string) {
  if (fromname && toname) {
    const _start = fromname.split('_').pop();
    const _end = toname.split('_').pop();
    if (_start && _end) {
      const fromCoord = geoCoord[_start];
      const toCoord = geoCoord[_end];
      return {
        fromName: _start,
        toName: _end,
        coords: [fromCoord, toCoord],
      };
    }
    return null;
  }
  return null;
}

class Index extends React.Component<PageProps, PageState> {
  private map: any | null;

  private chart: any | null;

  private container: React.RefObject<HTMLDivElement>;

  constructor(props: PageProps, context: any) {
    super(props, context);
    this.state = {
      zoom: 5,
      rotation: 0,
      center: [113.53450137499999, 34.44104525],
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

      this.chart = new EChartsLayer(null, {
        hideOnMoving: false,
        hideOnZooming: false,
      });

      this.chart.appendTo(this.map);

      getJSON('./static/json/china-migration.json', (geoCoord: any) => {
        if (geoCoord) {
          getJSON('./static/json/china-airline.json', (data: any) => {
            if (data) {
              const option = {
                backgroundColor: 'transparent',
                title: {
                  text: '春节人口迁徙',
                  x: 'center',
                  y: 'top',
                  textStyle: {
                    color: 'white',
                  },
                },
                legend: {
                  show: true,
                  selected: {},
                  x: 'left',
                  orient: 'vertical',
                  textStyle: {
                    color: 'white',
                  },
                  data: [],
                },
                series: [
                  {
                    name: 'Migration',
                    type: 'lines',
                    effect: {
                      constantSpeed: 30,
                      show: true,
                      trailLength: 1,
                      symbolSize: 1.5,
                      color: 'rgba(204, 246, 255, 1)',
                    },

                    itemStyle: {
                      normal: {
                        lineStyle: {
                          color: 'rgba(2, 166, 253, 1)',
                          type: 'solid',
                          width: 0.5,
                          opacity: 0.4,
                        },
                      },
                    },
                    data: [],
                  }, {
                    symbol: 'circle',
                    type: 'effectScatter',
                    symbolSize: 1.5,
                    itemStyle: {
                      normal: {
                        color: 'rgba(255, 0, 0, 1)',
                      },
                    },
                    data: [],
                  },
                ],
              };
              data.allLine
                .sort((a: any, b: any) => b.num - a.num)
                .slice(0, 3000)
                .forEach((line: any) => {
                  const callData = getLineCoord(geoCoord, line.start, line.end);
                  if (callData) {
                    option.series[0].data.push();
                  }
                });
              option.series[1].data = data.topCityOut.map((point: any) => ({
                value: getGeoCoord(geoCoord, point.name),
              }));

              this.chart.setChartOptions(option);
            }
          });
        }
      });
    }
  }

  render() {
    return (<div ref={this.container} className="map-content" />);
  }
}

export default Index;
