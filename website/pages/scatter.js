import * as React from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import EChartsLayer from 'ol-echarts';
import { getJSON } from '../helper';
import 'ol/ol.css';
import '../assets/style/art.less';

class Index extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};

    this.container = null;
    this.map = null;
  }

  componentDidMount() {
    this.map = new Map({
      target: this.container,
      view: new View({
        center: [113.53450137499999, 34.44104525],
        projection: 'EPSG:4326',
        zoom: 5, // resolution
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

    getJSON('./static/json/scatter.json', res => {
      if (res) {
        const data = res.locations;
        const geoCoordMap = res.coordinates;
        const convertData = (_data) => {
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
              symbolSize(val) {
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
              data: convertData(data.sort((a, b) => b.value - a.value).slice(0, 6)),
              symbolSize(val) {
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

  setRef = (x = null) => {
    this.container = x;
  };

  /**
   * 初始化
   */
  initChart(option) {
    this.chart = new EChartsLayer({
      stopEvent: false,
      hideOnMoving: false,
      hideOnZooming: false,
      forcedPrecomposeRerender: false,
    }, option);

    this.chart.on('load', ({ value }) => {
      value.on('click', event => {
        console.log(event);
      });
    });

    this.chart.appendTo(this.map);
  }

  render() {
    return (<div ref={this.setRef} className="map-content" />);
  }
}

export default Index;
