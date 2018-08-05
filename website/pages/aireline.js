import * as React from 'react';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import EChartsLayer from 'ol-echarts';
import { getJSON } from '../helper';
import 'ol/ol.css';
import '../assets/style/art.scss'

class Index extends React.Component {
  constructor (props, context) {
    super(props, context);
    this.state = {
      zoom: 14,
      fov: 0,
      pitch: 0,
      bearing: 0
    };

    this.container = null;
    this.map = null;
  }

  componentDidMount () {
    this.map = new Map({
      target: this.container,
      view: new View({
        center: [113.53450137499999, 34.44104525],
        projection: 'EPSG:4326',
        zoom: 5
      }),
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnline' +
            'StreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'
          })
        })
      ]
    });

    const echartslayer = new EChartsLayer(null, {
      hideOnMoving: false
    });
    echartslayer.appendTo(this.map);
    getJSON('../../json/flights.json', function (data) {
      function getAirportCoord (idx) {
        return [data.airports[idx][3], data.airports[idx][4]];
      }
      var routes = data.routes.map(function (airline) {
        return [
          getAirportCoord(airline[1]),
          getAirportCoord(airline[2])
        ];
      });
      var option = {
        title: {
          text: '航线',
          left: 'center',
          textStyle: {
            color: '#eee'
          }
        },
        backgroundColor: 'transparent',
        tooltip: {
          formatter: function (param) {
            var route = data.routes[param.dataIndex];
            return data.airports[route[1]][1] + ' > ' + data.airports[route[2]][1];
          }
        },
        series: [{
          type: 'lines',
          data: routes,
          large: true,
          largeThreshold: 100,
          lineStyle: {
            normal: {
              opacity: 0.05,
              width: 0.5,
              curveness: 0.3
            }
          },
          // 设置混合模式为叠加
          blendMode: 'lighter'
        }]
      };
      echartslayer.setChartOptions(option);
    });
  }

  setRef = (x = null) => {
    this.container = x;
  };

  render () {
    return (<div ref={this.setRef} className="map-content"></div>);
  }
}

export default Index;
