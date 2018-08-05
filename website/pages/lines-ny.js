import * as React from 'react';
import echarts from 'echarts'; // eslint-disable-line
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import EChartsLayer from 'ol-echarts';
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
        center: [-74.04327099998152, 40.86737600240287],
        projection: 'EPSG:4326',
        zoom: 10
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

    const echartslayer = new EChartsLayer({
      progressive: 20000,
      backgroundColor: 'transparent',
      series: [{
        type: 'lines',
        blendMode: 'lighter',
        dimensions: ['value'],
        data: new Float64Array(),
        polyline: true,
        large: true,
        lineStyle: {
          color: 'orange',
          width: 0.5,
          opacity: 0.3
        }
      }]
    }, {
      hideOnMoving: true,
      hideOnZooming: true
    });
    echartslayer.appendTo(this.map);

    var CHUNK_COUNT = 10;
    function fetchData (idx) {
      if (idx >= CHUNK_COUNT) {
        return;
      }
      var dataURL = `./static/examples/incremental/data/links_ny_${idx}.bin`;
      var xhr = new XMLHttpRequest();
      xhr.open('GET', dataURL, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function (e) {
        var rawData = new Float32Array(this.response);
        var data = new Float64Array(rawData.length - 2);
        var offsetX = rawData[0];
        var offsetY = rawData[1];
        var off = 0;
        for (var i = 2; i < rawData.length;) {
          var count = rawData[i++];
          data[off++] = count;
          for (var k = 0; k < count; k++) {
            var x = rawData[i++] + offsetX;
            var y = rawData[i++] + offsetY;
            data[off++] = x;
            data[off++] = y;
          }
        }
        echartslayer.appendData({
          seriesIndex: 0,
          data: data
        }, true);
        fetchData(idx + 1);
      };
      xhr.send();
    }
    fetchData(0);
  }

  setRef = (x = null) => {
    this.container = x;
  };

  render () {
    return (<div ref={this.setRef} className="map-content"></div>);
  }
}

export default Index;
