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
        center: [113.53450137499999, 34.44104525],
        projection: 'EPSG:4326',
        zoom: 5 // resolution
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
    getJSON('./static/json/china-migration.json', function (geoCoord) {
      if (geoCoord) {
        getJSON('./static/json/china-airline.json', function (data) {
          if (data) {
            var option = {
              backgroundColor: 'transparent',
              title: {
                text: '春节人口迁徙',
                x: 'center',
                y: 'top',
                textStyle: {
                  color: 'white'
                }
              },
              legend: {
                show: true,
                selected: {},
                x: 'left',
                orient: 'vertical',
                textStyle: {
                  color: 'white'
                },
                data: []
              },
              series: [
                {
                  name: 'Migration',
                  type: 'lines',
                  effect: {
                    constantSpeed: 30,
                    show: true,
                    trailLength: 1,
                    symbolSize: 1.5,
                    color: 'rgba(204, 246, 255, 1)'
                  },

                  itemStyle: {
                    normal: {
                      lineStyle: {
                        color: 'rgba(2, 166, 253, 1)',
                        type: 'solid',
                        width: 0.5,
                        opacity: 0.4
                      }
                    }
                  },
                  data: []
                }, {
                  symbol: 'circle',
                  type: 'effectScatter',
                  symbolSize: 1.5,
                  itemStyle: {
                    normal: {
                      color: 'rgba(255, 0, 0, 1)'
                    }
                  },
                  data: []
                }
              ]
            };
            data.allLine.sort(function (a, b) {
              return b.num - a.num
            }).slice(0, 3000).map(function (line) {
              option.series[0].data.push(getLineCoord(geoCoord, line.start, line.end));
            });
            option.series[1].data = data.topCityOut.map(function (point) {
              return {
                value: getGeoCoord(geoCoord, point.name)
              }
            });
            echartslayer.setChartOptions(option);
          }
        });
      }
    });

    // 经纬度获取
    function getGeoCoord (geoCoord, name) {
      var city = name.split('_').pop();
      var coord = geoCoord[city];
      return coord;
    }
    // 线路获取
    function getLineCoord (geoCoord, fromname, toname) {
      fromname = fromname.split('_').pop();
      var fromCoord = geoCoord[fromname];
      toname = toname.split('_').pop();
      var toCoord = geoCoord[toname];
      return {
        fromName: fromname,
        toName: toname,
        coords: [fromCoord, toCoord]
      }
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
