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
    getJSON('./static/json/tracks.json', function (data) {
      var lines = data.map(function (track) {
        return {
          coords: track.map(function (seg, idx) {
            return seg.coord;
          })
        };
      })
      var option = {
        title: {
          text: '杭州热门步行路线',
          left: 'center',
          textStyle: {
            color: '#eee'
          }
        },
        backgroundColor: 'transparent',
        series: [{
          type: 'lines',
          data: lines,
          polyline: true,
          lineStyle: {
            normal: {
              color: '#ddb926',
              opacity: 0.6,
              width: 1
            }
          }
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
