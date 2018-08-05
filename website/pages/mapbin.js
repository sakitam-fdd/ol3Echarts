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
        center: [116.28245, 39.92121],
        projection: 'EPSG:4326',
        zoom: 9
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
    var COLORS = ['#070093', '#1c3fbf', '#1482e5', '#70b4eb', '#b4e0f3', '#ffffff'];
    var lngExtent = [39.5, 40.6];
    var latExtent = [115.9, 116.8];
    var cellCount = [50, 50];
    var cellSizeCoord = [
      (lngExtent[1] - lngExtent[0]) / cellCount[0],
      (latExtent[1] - latExtent[0]) / cellCount[1]
    ];

    function renderItem (params, api) {
      var lngIndex = api.value(0);
      var latIndex = api.value(1);
      var pointLeftTop = getCoord(params, api, lngIndex, latIndex);
      var pointRightBottom = getCoord(params, api, lngIndex + 1, latIndex + 1);

      return {
        type: 'rect',
        shape: {
          x: pointLeftTop[0],
          y: pointLeftTop[1],
          width: pointRightBottom[0] - pointLeftTop[0],
          height: pointRightBottom[1] - pointLeftTop[1]
        },
        style: api.style({
          stroke: 'rgba(0,0,0,0.1)'
        }),
        styleEmphasis: api.styleEmphasis()
      };
    }

    function getCoord (params, api, lngIndex, latIndex) {
      var coords = params.context.coords || (params.context.coords = []);
      var key = lngIndex + '-' + latIndex;

      // bmap returns point in integer, which makes cell width unstable.
      // So we have to use right bottom point.
      return coords[key] || (coords[key] = api.coord([
        +(latExtent[0] + lngIndex * cellSizeCoord[0]).toFixed(6),
        +(lngExtent[0] + latIndex * cellSizeCoord[1]).toFixed(6)
      ]));
    }

    getJSON('./static/json/bin.json', (data) => {
      const echartslayer = new EChartsLayer({
        tooltip: {
          formatter: function (params, ticket, callback) {
            return params.value;
          },
          trigger: 'item'
        },
        visualMap: {
          type: 'piecewise',
          inverse: true,
          top: 10,
          right: 10,
          pieces: [
            {
              value: 0, color: COLORS[0]
            }, {
              value: 1, color: COLORS[1]
            }, {
              value: 2, color: COLORS[2]
            }, {
              value: 3, color: COLORS[3]
            }, {
              value: 4, color: COLORS[4]
            }, {
              value: 5, color: COLORS[5]
            }
          ],
          borderColor: '#ccc',
          borderWidth: 2,
          backgroundColor: '#eee',
          dimension: 2,
          inRange: {
            color: COLORS,
            opacity: 0.7
          }
        },
        series: [
          {
            type: 'custom',
            renderItem: renderItem,
            animation: false,
            itemStyle: {
              emphasis: {
                color: 'yellow'
              }
            },
            encode: {
              tooltip: 2
            },
            data: data
          }
        ]
      }, {
        hideOnMoving: true,
        hideOnZooming: true
      });
      echartslayer.appendTo(this.map);
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
