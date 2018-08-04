import * as React from 'react';
import { Map, View } from 'ol';
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
        center: [120.76264061813247, 30.74805248565917],
        projection: 'EPSG:4326',
        zoom: 12 // resolution
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
    getJSON('./static/json/traffic.json', function (data) {
      if (data) {
        // 配置项
        var option = {
          visualMap: {
            type: 'piecewise',
            left: 'right',
            top: 'top',
            min: 0,
            max: 15,
            splitNumber: 5,
            maxOpen: true,
            color: ['red', 'yellow', 'green']
          },
          tooltip: {
            formatter: function (params, ticket, callback) {
              return '拥堵指数:' + params.value;
            },
            trigger: 'item'
          },
          series: [
            {
              type: 'lines',
              polyline: true,
              lineStyle: {
                normal: {
                  opacity: 1,
                  width: 4
                },
                emphasis: {
                  width: 6
                }
              },
              effect: {
                show: true,
                symbolSize: 2,
                color: 'white'
              }
            }
          ]
        };
        option.series[0].data = convertData(data);
        echartslayer.setChartOptions(option);
      }
    });
    // 处理数据
    function convertData (sourceData) {
      return [].concat.apply([], sourceData.map(function (busLine, index) {
        var prevPoint = null;
        var points = [];
        var value = busLine.shift();
        for (var i = 0; i < busLine.length; i += 2) {
          var point = [busLine[i], busLine[i + 1]];
          if (i > 0) {
            point = [
              prevPoint[0] + point[0],
              prevPoint[1] + point[1]
            ];
          }
          prevPoint = point;
          points.push([point[0] / 1e5, point[1] / 1e5]);
        }
        return {
          value: value,
          coords: points
        };
      }));
    }
  }

  setRef = (x = null) => {
    this.container = x;
  };

  render () {
    return (<div ref={this.setRef} className="map-content"></div>);
  }
}

export default Index;
