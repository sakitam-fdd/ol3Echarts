import * as React from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import echarts from 'echarts';
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
        center: [116.28245, 39.92121],
        projection: 'EPSG:4326',
        zoom: 9 // resolution
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
    var echartslayer = new EChartsLayer(null, {
      hideOnMoving: true,
      hideOnZooming: true
    });
    echartslayer.appendTo(this.map);
    getJSON('./static/json/lines-bus.json', function (rawData) {
      var hStep = 300 / (rawData.length - 1);
      var busLines = [].concat.apply([], rawData.map(function (busLine, idx) {
        var prevPt;
        var points = [];
        for (var i = 0; i < busLine.length; i += 2) {
          var pt = [busLine[i], busLine[i + 1]];
          if (i > 0) {
            pt = [
              prevPt[0] + pt[0],
              prevPt[1] + pt[1]
            ];
          }
          prevPt = pt;

          points.push([pt[0] / 1e4, pt[1] / 1e4]);
        }
        return {
          'coords': points,
          'lineStyle': {
            'normal': {
              'color': echarts.color.modifyHSL('#5A94DF', Math.round(hStep * idx))
            }
          }
        };
      }));
      var option = {
        'series': [
          {
            'type': 'lines',
            'polyline': true,
            'data': busLines,
            'lineStyle': {
              'normal': {
                'width': 0
              }
            },
            'effect': {
              'constantSpeed': 20,
              'show': true,
              'trailLength': 0.5,
              'symbolSize': 1.5
            },
            'zlevel': 1
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
