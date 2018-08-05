import * as React from 'react';
import echarts from 'echarts'; // eslint-disable-line
import echartsgl from 'echarts-gl'; // eslint-disable-line
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

    getJSON('./static/json/wind.json', function (windData) {
      var data = [];
      var p = 0;
      var maxMag = 0;
      var minMag = Infinity;
      for (var j = 0; j < windData.ny; j++) {
        for (var i = 0; i < windData.nx; i++, p++) {
          var vx = windData.data[p][0];
          var vy = windData.data[p][1];
          var mag = Math.sqrt(vx * vx + vy * vy);
          // 数据是一个一维数组
          // [ [经度, 维度，向量经度方向的值，向量维度方向的值] ]
          data.push([
            i / windData.nx * 360 - 180,
            j / windData.ny * 180 - 90,
            vx,
            vy,
            mag
          ]);
          maxMag = Math.max(mag, maxMag);
          minMag = Math.min(mag, minMag);
        }
      }
      var option = {
        title: {
          text: '风场',
          left: 'center',
          top: 'top',
          textStyle: {
            color: '#fff'
          }
        },
        visualMap: {
          left: 'left',
          min: minMag,
          max: maxMag,
          dimension: 4,
          inRange: {
            // color: ['green', 'yellow', 'red']
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
          },
          realtime: false,
          calculable: true,
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            type: 'flowGL',
            data: data,
            particleDensity: 512,
            particleSpeed: 2,
            particleSize: 1,
            // gridWidth: windData.nx,
            // gridHeight: windData.ny,
            itemStyle: {
              opacity: 0.7
            }
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
