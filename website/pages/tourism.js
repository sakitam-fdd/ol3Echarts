import * as React from 'react';
import echarts from 'echarts';
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
    getJSON('./static/json/toursim.json', function (allData) {
      var option = {
        backgroundColor: 'transparent',
        title: {
          text: '湘西旅游景点客源分布图_城规所',
          left: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          show: false,
          orient: 'vertical',
          top: 'top',
          left: 'right',
          data: ['地点', '线路'],
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            name: '地点',
            type: 'effectScatter',
            zlevel: 2,
            rippleEffect: {
              brushType: 'stroke'
            },
            label: {
              emphasis: {
                show: true,
                position: 'right',
                formatter: '{b}'
              }
            },
            symbolSize: 2,
            showEffectOn: 'render',
            itemStyle: {
              normal: {
                color: '#46bee9'
              }
            },
            data: allData.citys
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
              trailLength: 0
            },
            lineStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0, color: '#58B3CC'
                }, {
                  offset: 1, color: '#F58158'
                }], false),
                width: 1,
                opacity: 0.2,
                curveness: 0.1
              }
            },
            data: allData.moveLines
          }
        ]
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
