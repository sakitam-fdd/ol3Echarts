import * as React from 'react';
import { Map, View } from 'ol';
import { Tile as TileLayer } from 'ol/layer';
import { XYZ } from 'ol/source';
import EChartsLayer from 'ol-echarts';
import * as echarts from 'echarts';
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

      getJSON('./static/json/toursim.json', (allData: any) => {
        const option = {
          backgroundColor: 'transparent',
          title: {
            text: '湘西旅游景点客源分布图_城规所',
            left: 'center',
            textStyle: {
              color: '#fff',
            },
          },
          legend: {
            show: false,
            orient: 'vertical',
            top: 'top',
            left: 'right',
            data: ['地点', '线路'],
            textStyle: {
              color: '#fff',
            },
          },
          series: [
            {
              name: '地点',
              type: 'effectScatter',
              zlevel: 2,
              rippleEffect: {
                brushType: 'stroke',
              },
              label: {
                emphasis: {
                  show: true,
                  position: 'right',
                  formatter: '{b}',
                },
              },
              symbolSize: 2,
              showEffectOn: 'render',
              itemStyle: {
                normal: {
                  color: '#46bee9',
                },
              },
              data: allData.citys,
            },
            {
              name: '线路',
              type: 'lines',
              zlevel: 2,
              large: true,
              effect: {
                show: true,
                constantSpeed: 30,
                symbol: 'pin',
                symbolSize: 3,
                trailLength: 0,
              },
              lineStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0, color: '#58B3CC',
                  }, {
                    offset: 1, color: '#F58158',
                  }], false),
                  width: 1,
                  opacity: 0.2,
                  curveness: 0.1,
                },
              },
              data: allData.moveLines,
            },
          ],
        };

        this.chart.setChartOptions(option);
      });
    }
  }

  render() {
    return (<div ref={this.container} className="map-content" />);
  }
}

export default Index;
