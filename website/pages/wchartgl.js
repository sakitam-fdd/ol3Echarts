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
      hideOnMoving: true,
      hideOnZooming: true
    });
    echartslayer.appendTo(this.map);

    getJSON('./static/json/weibo-gl.json', function (rawData) {
      var weiboData = rawData.map(function (serieData, idx) {
        var px = serieData[0] / 1000;
        var py = serieData[1] / 1000;
        var res = [[px, py]];
        for (var i = 2; i < serieData.length; i += 2) {
          var dx = serieData[i] / 1000;
          var dy = serieData[i + 1] / 1000;
          var x = px + dx;
          var y = py + dy;
          res.push([x.toFixed(2), y.toFixed(2), 1]);
          px = x;
          py = y;
        }
        return res;
      });
      var option = {
        title: {
          text: '微博签到数据点亮中国',
          left: 'center',
          top: 'top',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {},
        legend: {
          left: 'right',
          data: ['强', '中', '弱'],
          textStyle: {
            color: '#ccc'
          }
        },
        series: [
          {
            name: '弱',
            type: 'scatter',
            symbolSize: 1,
            itemStyle: {
              shadowBlur: 2,
              shadowColor: 'rgba(37, 140, 249, 0.8)',
              color: 'rgba(37, 140, 249, 0.8)'
            },
            data: weiboData[0]
          },
          {
            name: '中',
            type: 'scatter',
            symbolSize: 1,
            itemStyle: {
              shadowBlur: 2,
              shadowColor: 'rgba(14, 241, 242, 0.8)',
              color: 'rgba(14, 241, 242, 0.8)'
            },
            data: weiboData[1]
          },
          {
            name: '强',
            type: 'scatter',
            symbolSize: 1,
            itemStyle: {
              shadowBlur: 2,
              shadowColor: 'rgba(255, 255, 255, 0.8)',
              color: 'rgba(255, 255, 255, 0.8)'
            },
            data: weiboData[2]
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
