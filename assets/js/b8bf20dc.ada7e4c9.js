"use strict";(self.webpackChunkol_echarts_docs=self.webpackChunkol_echarts_docs||[]).push([[612],{9284:(n,e,a)=>{a.r(e),a.d(e,{assets:()=>m,contentTitle:()=>l,default:()=>d,frontMatter:()=>r,metadata:()=>s,toc:()=>i});var t=a(6106),o=a(2036);const r={id:"migration",title:"\u6a21\u62df\u8fc1\u5f99"},l=void 0,s={id:"playgrounds/migration",title:"\u6a21\u62df\u8fc1\u5f99",description:"\u4e00\u4e2a\u7b80\u5355\u7684\u793a\u4f8b",source:"@site/docs/playgrounds/migration.mdx",sourceDirName:"playgrounds",slug:"/playgrounds/migration",permalink:"/ol3Echarts/docs/playgrounds/migration",draft:!1,unlisted:!1,editUrl:"https://github.com/sakitam-fdd/ol3Echarts/edit/master/documents/docs/docs/playgrounds/migration.mdx",tags:[],version:"current",lastUpdatedBy:"sakitam-fdd",lastUpdatedAt:1730645386e3,frontMatter:{id:"migration",title:"\u6a21\u62df\u8fc1\u5f99"},sidebar:"docs",previous:{title:"\u5168\u56fd\u4e3b\u8981\u57ce\u5e02\u7a7a\u6c14\u8d28\u91cf",permalink:"/ol3Echarts/docs/playgrounds/scatter-charts"},next:{title:"\u5317\u4eac\u5e02\u516c\u4ea4\u7ebf\u8def",permalink:"/ol3Echarts/docs/playgrounds/line-bus"}},m={},i=[{value:"\u4e00\u4e2a\u7b80\u5355\u7684\u793a\u4f8b",id:"\u4e00\u4e2a\u7b80\u5355\u7684\u793a\u4f8b",level:3}];function c(n){const e={code:"code",h3:"h3",pre:"pre",...(0,o.R)(),...n.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(e.h3,{id:"\u4e00\u4e2a\u7b80\u5355\u7684\u793a\u4f8b",children:"\u4e00\u4e2a\u7b80\u5355\u7684\u793a\u4f8b"}),"\n",(0,t.jsx)(e.pre,{children:(0,t.jsx)(e.code,{className:"language-jsx",metastring:"live",live:!0,children:"function render(props) {\n  const container = useRef(null);\n\n  const data = useBaseUrl('/json/scatter.json');\n\n  const initChat = (map, option) => {\n    const chart = new EChartsLayer(option, {\n      stopEvent: false,\n      hideOnMoving: false,\n      hideOnZooming: false,\n      forcedPrecomposeRerender: true,\n    });\n\n    chart.appendTo(map);\n  }\n\n  const getOption = () => {\n    const geoCoordMap = {\n      \u4e0a\u6d77: [121.4648, 31.2891],\n      \u4e1c\u839e: [113.8953, 22.901],\n      \u4e1c\u8425: [118.7073, 37.5513],\n      \u4e2d\u5c71: [113.4229, 22.478],\n      \u4e34\u6c7e: [111.4783, 36.1615],\n      \u4e34\u6c82: [118.3118, 35.2936],\n      \u4e39\u4e1c: [124.541, 40.4242],\n      \u4e3d\u6c34: [119.5642, 28.1854],\n      \u4e4c\u9c81\u6728\u9f50: [87.9236, 43.5883],\n      \u4f5b\u5c71: [112.8955, 23.1097],\n      \u4fdd\u5b9a: [115.0488, 39.0948],\n      \u5170\u5dde: [103.5901, 36.3043],\n      \u5305\u5934: [110.3467, 41.4899],\n      \u5317\u4eac: [116.4551, 40.2539],\n      \u5317\u6d77: [109.314, 21.6211],\n      \u5357\u4eac: [118.8062, 31.9208],\n      \u5357\u5b81: [108.479, 23.1152],\n      \u5357\u660c: [116.0046, 28.6633],\n      \u5357\u901a: [121.1023, 32.1625],\n      \u53a6\u95e8: [118.1689, 24.6478],\n      \u53f0\u5dde: [121.1353, 28.6688],\n      \u5408\u80a5: [117.29, 32.0581],\n      \u547c\u548c\u6d69\u7279: [111.4124, 40.4901],\n      \u54b8\u9633: [108.4131, 34.8706],\n      \u54c8\u5c14\u6ee8: [127.9688, 45.368],\n      \u5510\u5c71: [118.4766, 39.6826],\n      \u5609\u5174: [120.9155, 30.6354],\n      \u5927\u540c: [113.7854, 39.8035],\n      \u5927\u8fde: [122.2229, 39.4409],\n      \u5929\u6d25: [117.4219, 39.4189],\n      \u592a\u539f: [112.3352, 37.9413],\n      \u5a01\u6d77: [121.9482, 37.1393],\n      \u5b81\u6ce2: [121.5967, 29.6466],\n      \u5b9d\u9e21: [107.1826, 34.3433],\n      \u5bbf\u8fc1: [118.5535, 33.7775],\n      \u5e38\u5dde: [119.4543, 31.5582],\n      \u5e7f\u5dde: [113.5107, 23.2196],\n      \u5eca\u574a: [116.521, 39.0509],\n      \u5ef6\u5b89: [109.1052, 36.4252],\n      \u5f20\u5bb6\u53e3: [115.1477, 40.8527],\n      \u5f90\u5dde: [117.5208, 34.3268],\n      \u5fb7\u5dde: [116.6858, 37.2107],\n      \u60e0\u5dde: [114.6204, 23.1647],\n      \u6210\u90fd: [103.9526, 30.7617],\n      \u626c\u5dde: [119.4653, 32.8162],\n      \u627f\u5fb7: [117.5757, 41.4075],\n      \u62c9\u8428: [91.1865, 30.1465],\n      \u65e0\u9521: [120.3442, 31.5527],\n      \u65e5\u7167: [119.2786, 35.5023],\n      \u6606\u660e: [102.9199, 25.4663],\n      \u676d\u5dde: [119.5313, 29.8773],\n      \u67a3\u5e84: [117.323, 34.8926],\n      \u67f3\u5dde: [109.3799, 24.9774],\n      \u682a\u6d32: [113.5327, 27.0319],\n      \u6b66\u6c49: [114.3896, 30.6628],\n      \u6c55\u5934: [117.1692, 23.3405],\n      \u6c5f\u95e8: [112.6318, 22.1484],\n      \u6c88\u9633: [123.1238, 42.1216],\n      \u6ca7\u5dde: [116.8286, 38.2104],\n      \u6cb3\u6e90: [114.917, 23.9722],\n      \u6cc9\u5dde: [118.3228, 25.1147],\n      \u6cf0\u5b89: [117.0264, 36.0516],\n      \u6cf0\u5dde: [120.0586, 32.5525],\n      \u6d4e\u5357: [117.1582, 36.8701],\n      \u6d4e\u5b81: [116.8286, 35.3375],\n      \u6d77\u53e3: [110.3893, 19.8516],\n      \u6dc4\u535a: [118.0371, 36.6064],\n      \u6dee\u5b89: [118.927, 33.4039],\n      \u6df1\u5733: [114.5435, 22.5439],\n      \u6e05\u8fdc: [112.9175, 24.3292],\n      \u6e29\u5dde: [120.498, 27.8119],\n      \u6e2d\u5357: [109.7864, 35.0299],\n      \u6e56\u5dde: [119.8608, 30.7782],\n      \u6e58\u6f6d: [112.5439, 27.7075],\n      \u6ee8\u5dde: [117.8174, 37.4963],\n      \u6f4d\u574a: [119.0918, 36.524],\n      \u70df\u53f0: [120.7397, 37.5128],\n      \u7389\u6eaa: [101.9312, 23.8898],\n      \u73e0\u6d77: [113.7305, 22.1155],\n      \u76d0\u57ce: [120.2234, 33.5577],\n      \u76d8\u9526: [121.9482, 41.0449],\n      \u77f3\u5bb6\u5e84: [114.4995, 38.1006],\n      \u798f\u5dde: [119.4543, 25.9222],\n      \u79e6\u7687\u5c9b: [119.2126, 40.0232],\n      \u7ecd\u5174: [120.564, 29.7565],\n      \u804a\u57ce: [115.9167, 36.4032],\n      \u8087\u5e86: [112.1265, 23.5822],\n      \u821f\u5c71: [122.2559, 30.2234],\n      \u82cf\u5dde: [120.6519, 31.3989],\n      \u83b1\u829c: [117.6526, 36.2714],\n      \u83cf\u6cfd: [115.6201, 35.2057],\n      \u8425\u53e3: [122.4316, 40.4297],\n      \u846b\u82a6\u5c9b: [120.1575, 40.578],\n      \u8861\u6c34: [115.8838, 37.7161],\n      \u8862\u5dde: [118.6853, 28.8666],\n      \u897f\u5b81: [101.4038, 36.8207],\n      \u897f\u5b89: [109.1162, 34.2004],\n      \u8d35\u9633: [106.6992, 26.7682],\n      \u8fde\u4e91\u6e2f: [119.1248, 34.552],\n      \u90a2\u53f0: [114.8071, 37.2821],\n      \u90af\u90f8: [114.4775, 36.535],\n      \u90d1\u5dde: [113.4668, 34.6234],\n      \u9102\u5c14\u591a\u65af: [108.9734, 39.2487],\n      \u91cd\u5e86: [107.7539, 30.1904],\n      \u91d1\u534e: [120.0037, 29.1028],\n      \u94dc\u5ddd: [109.0393, 35.1947],\n      \u94f6\u5ddd: [106.3586, 38.1775],\n      \u9547\u6c5f: [119.4763, 31.9702],\n      \u957f\u6625: [125.8154, 44.2584],\n      \u957f\u6c99: [113.0823, 28.2568],\n      \u957f\u6cbb: [112.8625, 36.4746],\n      \u9633\u6cc9: [113.4778, 38.0951],\n      \u9752\u5c9b: [120.4651, 36.3373],\n      \u97f6\u5173: [113.7964, 24.7028],\n    };\n    const BJData = [\n      [{ name: '\u5317\u4eac' }, { name: '\u4e0a\u6d77', value: 95 }],\n      [{ name: '\u5317\u4eac' }, { name: '\u5e7f\u5dde', value: 90 }],\n      [{ name: '\u5317\u4eac' }, { name: '\u5927\u8fde', value: 80 }],\n      [{ name: '\u5317\u4eac' }, { name: '\u5357\u5b81', value: 70 }],\n      [{ name: '\u5317\u4eac' }, { name: '\u5357\u660c', value: 60 }],\n      [{ name: '\u5317\u4eac' }, { name: '\u62c9\u8428', value: 50 }],\n      [{ name: '\u5317\u4eac' }, { name: '\u957f\u6625', value: 40 }],\n      [{ name: '\u5317\u4eac' }, { name: '\u5305\u5934', value: 30 }],\n      [{ name: '\u5317\u4eac' }, { name: '\u91cd\u5e86', value: 20 }],\n      [{ name: '\u5317\u4eac' }, { name: '\u5e38\u5dde', value: 10 }],\n    ];\n    const SHData = [\n      [{ name: '\u4e0a\u6d77' }, { name: '\u5305\u5934', value: 95 }],\n      [{ name: '\u4e0a\u6d77' }, { name: '\u6606\u660e', value: 90 }],\n      [{ name: '\u4e0a\u6d77' }, { name: '\u5e7f\u5dde', value: 80 }],\n      [{ name: '\u4e0a\u6d77' }, { name: '\u90d1\u5dde', value: 70 }],\n      [{ name: '\u4e0a\u6d77' }, { name: '\u957f\u6625', value: 60 }],\n      [{ name: '\u4e0a\u6d77' }, { name: '\u91cd\u5e86', value: 50 }],\n      [{ name: '\u4e0a\u6d77' }, { name: '\u957f\u6c99', value: 40 }],\n      [{ name: '\u4e0a\u6d77' }, { name: '\u5317\u4eac', value: 30 }],\n      [{ name: '\u4e0a\u6d77' }, { name: '\u4e39\u4e1c', value: 20 }],\n      [{ name: '\u4e0a\u6d77' }, { name: '\u5927\u8fde', value: 10 }],\n    ];\n    const GZData = [\n      [{ name: '\u5e7f\u5dde' }, { name: '\u798f\u5dde', value: 95 }],\n      [{ name: '\u5e7f\u5dde' }, { name: '\u592a\u539f', value: 90 }],\n      [{ name: '\u5e7f\u5dde' }, { name: '\u957f\u6625', value: 80 }],\n      [{ name: '\u5e7f\u5dde' }, { name: '\u91cd\u5e86', value: 70 }],\n      [{ name: '\u5e7f\u5dde' }, { name: '\u897f\u5b89', value: 60 }],\n      [{ name: '\u5e7f\u5dde' }, { name: '\u6210\u90fd', value: 50 }],\n      [{ name: '\u5e7f\u5dde' }, { name: '\u5e38\u5dde', value: 40 }],\n      [{ name: '\u5e7f\u5dde' }, { name: '\u5317\u4eac', value: 30 }],\n      [{ name: '\u5e7f\u5dde' }, { name: '\u5317\u6d77', value: 20 }],\n      [{ name: '\u5e7f\u5dde' }, { name: '\u6d77\u53e3', value: 10 }],\n    ];\n    const planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';\n    const convertData = (data) => {\n      const res = [];\n      for (let i = 0; i < data.length; i++) {\n        const dataItem = data[i];\n        const fromCoord = geoCoordMap[dataItem[0].name];\n        const toCoord = geoCoordMap[dataItem[1].name];\n        if (fromCoord && toCoord) {\n          res.push({\n            fromName: dataItem[0].name,\n            toName: dataItem[1].name,\n            coords: [fromCoord, toCoord],\n          });\n        }\n      }\n      return res;\n    };\n    const color = ['#a6c84c', '#ffa022', '#46bee9'];\n    const series = [];\n    [['\u5317\u4eac', BJData], ['\u4e0a\u6d77', SHData], ['\u5e7f\u5dde', GZData]].forEach((item, i) => {\n      series.push(\n        {\n          name: `${item[0]} Top10`,\n          type: 'lines',\n          zlevel: 1,\n          effect: {\n            show: true,\n            period: 6,\n            trailLength: 0.7,\n            color: '#fff',\n            symbolSize: 3,\n          },\n          lineStyle: {\n            normal: {\n              color: color[i],\n              width: 0,\n              curveness: 0.2,\n            },\n          },\n          data: convertData(item[1]),\n        },\n        {\n          name: `${item[0]} Top10`,\n          type: 'lines',\n          zlevel: 2,\n          effect: {\n            show: true,\n            period: 6,\n            trailLength: 0,\n            symbol: planePath,\n            symbolSize: 15,\n          },\n          lineStyle: {\n            normal: {\n              color: color[i],\n              width: 1,\n              opacity: 0.4,\n              curveness: 0.2,\n            },\n          },\n          data: convertData(item[1]),\n        },\n        {\n          name: `${item[0]} Top10`,\n          type: 'effectScatter',\n          coordinateSystem: 'geo',\n          zlevel: 2,\n          rippleEffect: {\n            brushType: 'stroke',\n          },\n          label: {\n            normal: {\n              show: true,\n              position: 'right',\n              formatter: '{b}',\n            },\n          },\n          symbolSize(val) {\n            return val[2] / 8;\n          },\n          itemStyle: {\n            normal: {\n              color: color[i],\n            },\n          },\n          data: item[1].map((dataItem) => ({\n            name: dataItem[1].name,\n            value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value]),\n          })),\n        },\n      );\n    });\n    return {\n      tooltip: {\n        trigger: 'item',\n      },\n      series,\n    };\n  }\n\n  const init = () => {\n    const map = new ol.Map({\n      target: container.current,\n      view: new ol.View({\n        center: [113.53450137499999, 34.44104525],\n        projection: 'EPSG:4326',\n        zoom: 4, // resolution\n        rotation: 0,\n      }),\n      layers: [\n        new TileLayer({\n          source: new XYZ({\n            url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',\n          }),\n        }),\n      ],\n    });\n\n    initChat(map, getOption());\n\n    function resize(target) {}\n\n    return {\n      resize,\n    }\n  }\n\n  useEffect(() => {\n    const { resize } = init();\n\n    return () => {\n    };\n  }, []);\n\n  return (\n    <div className=\"live-wrap\">\n      <div ref={container} className=\"map-content\" />\n    </div>\n  );\n}\n"})})]})}function d(n={}){const{wrapper:e}={...(0,o.R)(),...n.components};return e?(0,t.jsx)(e,{...n,children:(0,t.jsx)(c,{...n})}):c(n)}},2036:(n,e,a)=>{a.d(e,{R:()=>l,x:()=>s});var t=a(7378);const o={},r=t.createContext(o);function l(n){const e=t.useContext(r);return t.useMemo((function(){return"function"==typeof n?n(e):{...e,...n}}),[e,n])}function s(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(o):n.components||o:l(n.components),t.createElement(r.Provider,{value:e},n.children)}}}]);