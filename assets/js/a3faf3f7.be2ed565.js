"use strict";(self.webpackChunkol_echarts_docs=self.webpackChunkol_echarts_docs||[]).push([[176],{5081:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>i,contentTitle:()=>l,default:()=>h,frontMatter:()=>d,metadata:()=>c,toc:()=>a});var s=r(6106),t=r(2036);const d={id:"quickstart",title:"\u5feb\u901f\u5f00\u59cb",sidebar_label:"\u5feb\u901f\u5f00\u59cb",slug:"/quickstart",description:"\u4e86\u89e3\u5982\u4f55\u5feb\u901f\u4f7f\u7528\u6b64\u7c7b\u5e93"},l=void 0,c={id:"guide/quickstart",title:"\u5feb\u901f\u5f00\u59cb",description:"\u4e86\u89e3\u5982\u4f55\u5feb\u901f\u4f7f\u7528\u6b64\u7c7b\u5e93",source:"@site/docs/guide/quickstart.md",sourceDirName:"guide",slug:"/quickstart",permalink:"/ol3Echarts/docs/quickstart",draft:!1,unlisted:!1,editUrl:"https://github.com/sakitam-fdd/ol3Echarts/edit/master/documents/docs/docs/guide/quickstart.md",tags:[],version:"current",lastUpdatedBy:"sakitam-fdd",lastUpdatedAt:1730471031e3,frontMatter:{id:"quickstart",title:"\u5feb\u901f\u5f00\u59cb",sidebar_label:"\u5feb\u901f\u5f00\u59cb",slug:"/quickstart",description:"\u4e86\u89e3\u5982\u4f55\u5feb\u901f\u4f7f\u7528\u6b64\u7c7b\u5e93"},sidebar:"docs",previous:{title:"Bridger for openlayers and echarts",permalink:"/ol3Echarts/docs/"},next:{title:"\u5b89\u88c5",permalink:"/ol3Echarts/docs/install"}},i={},a=[{value:"\u5feb\u901f\u5f00\u59cb",id:"\u5feb\u901f\u5f00\u59cb",level:2},{value:"\u8bf4\u660e",id:"\u8bf4\u660e",level:2},{value:"\u7b2c\u4e00\u4e2a\u793a\u4f8b",id:"\u7b2c\u4e00\u4e2a\u793a\u4f8b",level:2},{value:"\u5c1d\u8bd5\u7f16\u8f91\u5b83",id:"\u5c1d\u8bd5\u7f16\u8f91\u5b83",level:3},{value:"\u4ece1.2.0\u5347\u7ea7\u52301.3.0",id:"\u4ece120\u5347\u7ea7\u5230130",level:2},{value:"\u65b0\u589e <code>ol</code> package \u7684\u517c\u5bb9\u7c7b\u5e93\u3002",id:"\u65b0\u589e-ol-package-\u7684\u517c\u5bb9\u7c7b\u5e93",level:2},{value:"\u5347\u7ea7\u52302.0+",id:"\u5347\u7ea7\u523020",level:2},{value:"\u5982\u4f55\u4f7f\u7528",id:"\u5982\u4f55\u4f7f\u7528",level:3},{value:"\u521d\u59cb\u5316echarts\u56fe\u5c42\u5e76\u6dfb\u52a0\u5230\u5730\u56fe",id:"\u521d\u59cb\u5316echarts\u56fe\u5c42\u5e76\u6dfb\u52a0\u5230\u5730\u56fe",level:4},{value:"\u6ce8\u610f 1",id:"\u6ce8\u610f-1",level:4},{value:"\u6ce8\u610f 3",id:"\u6ce8\u610f-3",level:4},{value:"\u4e8b\u4ef6",id:"\u4e8b\u4ef6",level:3}];function o(e){const n={blockquote:"blockquote",code:"code",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,t.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h2,{id:"\u5feb\u901f\u5f00\u59cb",children:"\u5feb\u901f\u5f00\u59cb"}),"\n",(0,s.jsx)(n.p,{children:"\u8fd9\u91cc\u5047\u8bbe\u4f60\u5df2\u4e86\u89e3openlayers\u548cecharts\u7684\u4f7f\u7528\u65b9\u6cd5"}),"\n",(0,s.jsx)(n.h2,{id:"\u8bf4\u660e",children:"\u8bf4\u660e"}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:["\u56e0\u4e3aol3Echarts\u662f\u57fa\u4e8eopenlayers\u548cEcharts\u5f00\u53d1\u800c\u6765\uff0c\u6240\u4ee5\u5fc5\u987b\u5f15\u5165ol\u548cecharts\u7c7b\u5e93\u3002\n\u540c\u65f6\u9700\u8981\u62ff\u5230 ",(0,s.jsx)(n.code,{children:"ol.Map"})," \u7684\u5730\u56fe\u5bf9\u8c61\u5b9e\u4f8b\uff0c\u56e0\u4e3aHMap\u662f\u57fa\u4e8eopenlayers\u7684\u4e8c\u6b21\u5f00\u53d1\uff0c\u6240\u4ee5\n\u53ef\u4ee5\u770b\u505a\u662fol\u7684\u589e\u5f3a\uff0c\u5e76\u672a\u6539\u53d8\u5176\u5185\u7f6e\u5bf9\u8c61\uff0c\u4ee5\u4e0b\u5730\u56fe\u5b9e\u4f8b\u5168\u90e8\u57fa\u4e8eHMap\u3002"]}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"\u7b2c\u4e00\u4e2a\u793a\u4f8b",children:"\u7b2c\u4e00\u4e2a\u793a\u4f8b"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-html",children:"<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0\">\n  <title>ol3-Echarts</title>\n  <link rel=\"stylesheet\" href=\"https://unpkg.com/hmap-js/dist/hmap.css\">\n  <style>\n    html, body, #map {\n      height: 100%;\n      padding: 0;\n      margin: 0;\n    }\n    .hmap-control-zoom {\n      right: 30px;\n    }\n  </style>\n</head>\n<body>\n<div id=\"map\"></div>\n<script src=\"https://unpkg.com/hmap-js/dist/hmap.js\"><\/script>\n<script src=\"https://unpkg.com/jquery/dist/jquery.js\"><\/script>\n<script src=\"https://unpkg.com/echarts/dist/echarts.js\"><\/script>\n<script src=\"https://unpkg.com/ol3-echarts/dist/ol3Echarts.js\"><\/script>\n<script>\n  document.onreadystatechange = function () {\n    if (document.readyState === 'complete') {\n      var Maps = new HMap('map', {\n        controls: {\n          loading: true,\n          zoomSlider: true,\n          fullScreen: false\n        },\n        view: {\n          center: [11464017.313439976, 3934744.6720247352],\n          extent: [-2.0037507067161843E7, -3.0240971958386254E7, 2.0037507067161843E7, 3.0240971958386205E7],\n          projection: 'EPSG:102100',\n          tileSize: 256,\n          zoom: 5, // resolution\n        },\n        baseLayers: [\n          {\n            layerName: 'vector',\n            isDefault: true,\n            layerType: 'TileXYZ',\n            tileGrid: {\n              tileSize: 256,\n              extent: [-2.0037507067161843E7, -3.0240971958386254E7, 2.0037507067161843E7, 3.0240971958386205E7],\n              origin: [-2.0037508342787E7, 2.0037508342787E7],\n              resolutions: [\n                156543.03392800014,\n                78271.51696399994,\n                39135.75848200009,\n                19567.87924099992,\n                9783.93962049996,\n                4891.96981024998,\n                2445.98490512499,\n                1222.992452562495,\n                611.4962262813797,\n                305.74811314055756,\n                152.87405657041106,\n                76.43702828507324,\n                38.21851414253662,\n                19.10925707126831,\n                9.554628535634155,\n                4.77731426794937,\n                2.388657133974685\n              ]\n            },\n            layerUrl: 'http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'\n          }\n        ]\n      });\n      var data = [{\n        name: '\u83cf\u6cfd',\n        value: 194\n      }];\n      var geoCoordMap = {\n        '\u83cf\u6cfd': [115.480656, 35.23375]\n      };\n      var convertData = function (data) {\n        var res = [];\n        for (var i = 0; i < data.length; i++) {\n          var geoCoord = geoCoordMap[data[i].name];\n          if (geoCoord) {\n            res.push({\n              name: data[i].name,\n              value: geoCoord.concat(data[i].value)\n            });\n          }\n        }\n        return res;\n      };\n      var option = {\n        title: {\n          text: '\u5168\u56fd\u4e3b\u8981\u57ce\u5e02\u7a7a\u6c14\u8d28\u91cf',\n          subtext: 'data from PM25.in',\n          sublink: 'http://www.pm25.in',\n          left: 'center',\n          textStyle: {\n            color: '#fff'\n          }\n        },\n        tooltip: {\n          trigger: 'item'\n        },\n        legend: {\n          orient: 'vertical',\n          y: 'top',\n          x: 'right',\n          data: ['pm2.5'],\n          textStyle: {\n            color: '#fff'\n          }\n        },\n        series: [\n          {\n            name: 'pm2.5',\n            type: 'scatter',\n            data: convertData(data),\n            symbolSize: function (val) {\n              return val[2] / 10;\n            },\n            label: {\n              normal: {\n                formatter: '{b}',\n                position: 'right',\n                show: false\n              },\n              emphasis: {\n                show: true\n              }\n            },\n            itemStyle: {\n              normal: {\n                color: '#ddb926'\n              }\n            }\n          },\n          {\n            name: 'Top 5',\n            type: 'effectScatter',\n            data: convertData(data.sort(function (a, b) {\n              return b.value - a.value;\n            }).slice(0, 6)),\n            symbolSize: function (val) {\n              return val[2] / 10;\n            },\n            showEffectOn: 'render',\n            rippleEffect: {\n              brushType: 'stroke'\n            },\n            hoverAnimation: true,\n            label: {\n              normal: {\n                formatter: '{b}',\n                position: 'right',\n                show: true\n              }\n            },\n            itemStyle: {\n              normal: {\n                color: '#f4e925',\n                shadowBlur: 10,\n                shadowColor: '#333'\n              }\n            },\n            zlevel: 1\n          }]\n      };\n      var echartslayer = new ol3Echarts(option);\n      echartslayer.appendTo(Maps.getMap());\n    }\n  }\n<\/script>\n</body>\n</html>\n"})}),"\n",(0,s.jsx)(n.h3,{id:"\u5c1d\u8bd5\u7f16\u8f91\u5b83",children:"\u5c1d\u8bd5\u7f16\u8f91\u5b83"}),"\n",(0,s.jsx)("iframe",{width:"100%",height:"430",src:"//jsfiddle.net/sakitamfdd/pjz8cuxw/embedded/result,html,js/?bodyColor=fff",allowfullscreen:"allowfullscreen",frameborder:"0"}),"\n",(0,s.jsx)(n.h2,{id:"\u4ece120\u5347\u7ea7\u5230130",children:"\u4ece1.2.0\u5347\u7ea7\u52301.3.0"}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsx)(n.p,{children:"\u56e0\u4e3a\u5728\u91cd\u6784\u65f6\u9879\u76ee\u67b6\u6784\u5168\u90e8\u63a8\u7ffb\u91cd\u6765\uff0c\u6240\u4ee5\u5927\u90e8\u5206\u4f7f\u7528\u65b9\u5f0f\u505a\u4e86\u4e00\u4e9b\u8c03\u6574"}),"\n"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"\u56fe\u5c42\u521d\u59cb\u5316\uff1a\u53ef\u4ee5\u5728\u4efb\u610f\u65f6\u95f4\u521d\u59cb\u5316echarts\u56fe\u5c42\uff0c\u4e0d\u9700\u8981\u518d\u624b\u52a8\u76d1\u542c\u5730\u56fe\u662f\u5426\u6e32\u67d3\u540e\u5728\u521d\u59cb\u5316\uff0c\u9002\u5e94\u66f4\u591a\u573a\u666f\u3002"}),"\n",(0,s.jsxs)(n.li,{children:["\u6dfb\u52a0\u5230\u5730\u56fe\uff1a\u4e0d\u9700\u8981\u518d\u521d\u59cb\u5316\u65f6\u4f20\u5165\u5730\u56fe\u5bf9\u8c61\uff0c\u53ef\u4ee5\u5728\u5730\u56fe\u521d\u59cb\u5316\u540e\u518d ",(0,s.jsx)(n.code,{children:"appendTo"})," \u5230\u5730\u56fe, \u5e76\u4e14\n\u6e32\u67d3\u662f\u5728\u6dfb\u52a0\u5230\u5730\u56fe\u540e\u4e14\u5b58\u5728echarts\u56fe\u5c42\u914d\u7f6e\u624d\u4f1a\u6e32\u67d3\uff0c\u51cf\u5c11\u5185\u5b58\u5f00\u9500\u3002"]}),"\n",(0,s.jsx)(n.li,{children:"\u4f18\u5316\u4e86echarts\u914d\u7f6e\uff0c\u4e0d\u9700\u8981\u518d\u5f3a\u5236\u4f20\u5165 coordinateSystem \u5b57\u6bb5\u3002"}),"\n",(0,s.jsxs)(n.li,{children:["\u65b0\u589e\u4e86\u56db\u4e2a\u53c2\u6570\uff0c\u8be6\u89c1 ",(0,s.jsx)(n.code,{children:"api"}),", \u53ef\u589e\u5f3a\u7528\u6237\u4f53\u9a8c\uff0c\u51cf\u5c11\u5361\u987f\u3002"]}),"\n",(0,s.jsxs)(n.li,{children:["\u4fee\u590d\u4e86 ",(0,s.jsx)(n.code,{children:"echarts-gl"})," \u517c\u5bb9\u95ee\u9898\uff0c\u76f8\u5173\u793a\u4f8b\u6b63\u5728\u6dfb\u52a0\u3002"]}),"\n"]}),"\n",(0,s.jsxs)(n.h2,{id:"\u65b0\u589e-ol-package-\u7684\u517c\u5bb9\u7c7b\u5e93",children:["\u65b0\u589e ",(0,s.jsx)(n.code,{children:"ol"})," package \u7684\u517c\u5bb9\u7c7b\u5e93\u3002"]}),"\n",(0,s.jsx)(n.h2,{id:"\u5347\u7ea7\u523020",children:"\u5347\u7ea7\u52302.0+"}),"\n",(0,s.jsxs)(n.p,{children:["\u597d\u5427\uff0c2.0\u7248\u672c\u53c8\u4fee\u6539\u4e86\u4e00\u4e9b\u53c2\u6570\uff0c\u4e3b\u8981\u662f\u65b0\u589e\u4e00\u4e9b\u914d\u7f6e\u9879\uff0c\u79fb\u9664\u4e86\u81ea\u5b9a\u4e49\u5bb9\u5668",(0,s.jsx)(n.code,{children:"target"}),"\u7684\u914d\u7f6e, \u9ed8\u8ba4\u53ea\u5141\u8bb8\u6dfb\u52a0\u5230",(0,s.jsx)(n.code,{children:"ol-overlaycontainer"}),"\u548c",(0,s.jsx)(n.code,{children:"ol-overlaycontainer-stopevent"}),"\u5bb9\u5668\uff0c\n\u8fd9\u6837\u80fd\u4fdd\u8bc1\u4e86\u4e8b\u4ef6\u7684\u6b63\u786e\u6355\u83b7\u3002\u540c\u6837\u9488\u5bf9 ",(0,s.jsx)(n.code,{children:"openlayers5+"}),"\u51fa\u73b0\u7684\u4e8b\u4ef6\u6355\u83b7\u5f02\u5e38\u6dfb\u52a0\u4e86\u4e00\u4e2apolyfill, \u53ef\u4ee5\u901a\u8fc7\u914d\u7f6e\u9879",(0,s.jsx)(n.code,{children:"polyfillEvents"})," \u8fdb\u884c\u5f00\u542f\uff0c\u5982\u679c\u6ca1\u6709\u78b0\u5230\u6b64\u95ee\u9898\u53ef\u4ee5\u5ffd\u7565\u6b64\u53c2\u6570\u3002\n\u5e76\u4e14\u4fee\u590d\u4e86\u591a\u5730\u56fe\u5bb9\u5668\u65f6\u81ea\u5b9a\u4e49\u5750\u6807\u7cfb\u4e0d\u8d77\u4f5c\u7528\u7684\u95ee\u9898\uff0c\u53e6\u5916\u8f83\u5927\u7684\u6539\u53d8\u662f\u652f\u6301\u4e86",(0,s.jsx)(n.code,{children:"typescript"}),"\u3002\u5176\u4ed6\u76f8\u5173\u914d\u7f6e\u9879\u7684\u6539\u53d8\u8be6\u89c1 ",(0,s.jsx)(n.code,{children:"API"})," \u6587\u6863\u3002"]}),"\n",(0,s.jsx)(n.h3,{id:"\u5982\u4f55\u4f7f\u7528",children:"\u5982\u4f55\u4f7f\u7528"}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsx)(n.p,{children:"\u6ce8\u610f\uff1a\u73b0\u6709echarts\u6269\u5c55\u662f\u72ec\u7acb\u4e8eopenlayers\u56fe\u5c42\u7684"}),"\n"]}),"\n",(0,s.jsx)(n.h4,{id:"\u521d\u59cb\u5316echarts\u56fe\u5c42\u5e76\u6dfb\u52a0\u5230\u5730\u56fe",children:"\u521d\u59cb\u5316echarts\u56fe\u5c42\u5e76\u6dfb\u52a0\u5230\u5730\u56fe"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:"var option = {} // echarts\u6807\u51c6\u914d\u7f6e\nvar echartslayer = new ol3Echarts(null, {\n    hideOnMoving: true,\n    hideOnZooming: true\n  });\nechartslayer.appendTo(map);\n"})}),"\n",(0,s.jsx)(n.h4,{id:"\u6ce8\u610f-1",children:"\u6ce8\u610f 1"}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:["\u521b\u5efa ",(0,s.jsx)(n.code,{children:"echartslayer"})," \u5bf9\u8c61\u5fc5\u987b\u8981\u5728\u5730\u56fe\u521d\u59cb\u5316\u5b8c\u6210\u5f00\u59cb\u6e32\u67d3\u540e\uff0c\u5373\u5b58\u5728 ",(0,s.jsx)(n.code,{children:"ol.Map"})," \u5b9e\u4f8b"]}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"Maps.map instanceof ol.Map // true\n"})}),"\n",(0,s.jsxs)(n.p,{children:["\u4ece",(0,s.jsx)(n.code,{children:"2.0.5"}),"\u7248\u672c\u5f00\u59cb\u4e0d\u5f3a\u5236\u5224\u65ad map instanceof ol.Map\uff0c\u53ef\u4ee5\u5728 ",(0,s.jsx)(n.code,{children:"appendTo"})," \u6307\u5b9a\u7b2c\u4e8c\u4e2a\u53c2\u6570\u5ffd\u7565\u5224\u65ad\uff0c\u4ee5\u517c\u5bb9\u53ef\u80fd\u57fa\u4e8e ol \u4e8c\u6b21\u5c01\u88c5\u7684\u7c7b\u5e93"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",children:"echartslayer.appendTo(map, true);\n"})}),"\n",(0,s.jsx)(n.h4,{id:"\u6ce8\u610f-3",children:"\u6ce8\u610f 3"}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsx)(n.p,{children:"\u914d\u7f6e"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:"params = {\n  source: '',\n  destination: '',\n  forcedRerender: false,\n  forcedPrecomposeRerender: true,\n  hideOnZooming: false, // when zooming hide chart\n  hideOnMoving: false, // when moving hide chart\n  hideOnRotating: false, // // when Rotating hide chart\n  convertTypes: [], // \u652f\u6301\u975e\u5730\u7406\u7a7a\u95f4\u5750\u6807\u7684\u56fe\u8868\u7c7b\u578b\uff0c\u4e0d\u9700\u8981\u914d\u7f6e\n  insertFirst: true, // https://openlayers.org/en/latest/apidoc/module-ol_Overlay-Overlay.html\n  stopEvent: false, // https://openlayers.org/en/latest/apidoc/module-ol_Overlay-Overlay.html\n  polyfillEvents: false, // \u4ee3\u7406echrats\u56fe\u5c42\u7684 mousedown mouseup click \u4e8b\u4ef6\n}\n"})}),"\n",(0,s.jsx)(n.p,{children:"\u914d\u7f6e\u9879\u8bf4\u660e"}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{children:"\u914d\u7f6e\u9879"}),(0,s.jsx)(n.th,{children:"\u7b80\u4ecb"}),(0,s.jsx)(n.th,{children:"\u7c7b\u578b"}),(0,s.jsx)(n.th,{children:"\u5907\u6ce8"})]})}),(0,s.jsxs)(n.tbody,{children:[(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"source"}),(0,s.jsx)(n.td,{children:"\u6570\u636e\u6e90\u6295\u5f71"}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"String"})}),(0,s.jsxs)(n.td,{children:["\u6295\u5f71\u7cfb ",(0,s.jsx)(n.code,{children:"code"})," \u5e38\u7528 EPSG:4326, EPSG:3857"]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"destination"}),(0,s.jsx)(n.td,{children:"\u6570\u636e\u76ee\u6807\u6295\u5f71"}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"String"})}),(0,s.jsx)(n.td,{children:"\u6e32\u67d3\u6570\u636e\u7684\u76ee\u6807\u6295\u5f71\uff0c\u4e0d\u4f20\u65f6\u4ece\u5730\u56fe\u89c6\u56fe\u83b7\u53d6"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"forcedRerender"}),(0,s.jsx)(n.td,{children:"\u662f\u5426\u5f00\u542f\u5f3a\u5236\u91cd\u65b0\u6e32\u67d3"}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"boolean"})}),(0,s.jsxs)(n.td,{children:["\u9ed8\u8ba4 ",(0,s.jsx)(n.code,{children:"false"}),", \u6ce8\u610f\u5f00\u542f\u540e\u53ef\u80fd\u4f1a\u9020\u6210\u6027\u80fd\u635f\u5931\uff0c\u5efa\u8bae\u4e0d\u5f00\u542f\u3002"]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"forcedPrecomposeRerender"}),(0,s.jsx)(n.td,{children:"\u662f\u5426\u5728\u5730\u56fe\u6e32\u67d3\u4e4b\u524d\u5237\u65b0echarts\u56fe\u5c42"}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"boolean"})}),(0,s.jsxs)(n.td,{children:["\u9ed8\u8ba4 ",(0,s.jsx)(n.code,{children:"false"}),", \u6ce8\u610f\u5f00\u542f\u540e\u53ef\u4ee5\u4fdd\u8bc1\u56fe\u5c42\u65e0\u6ede\u540e\uff0c\u4f46\u662f\u4f1a\u9020\u6210\u5927\u91cf\u91cd\u7ed8\uff0c\u4e0d\u5efa\u8bae\u5f00\u542f\u3002"]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"hideOnZooming"}),(0,s.jsx)(n.td,{children:"\u7f29\u653e\u65f6\u662f\u5426\u9690\u85cf"}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"boolean"})}),(0,s.jsxs)(n.td,{children:["\u9ed8\u8ba4 ",(0,s.jsx)(n.code,{children:"false"}),", \u6ce8\u610f\u5f00\u542f\u540e\u4f1a\u63d0\u5347\u6027\u80fd\u548c\u7528\u6237\u4f53\u9a8c"]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"hideOnMoving"}),(0,s.jsx)(n.td,{children:"\u62d6\u52a8\u65f6\u662f\u5426\u9690\u85cf"}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"boolean"})}),(0,s.jsxs)(n.td,{children:["\u9ed8\u8ba4 ",(0,s.jsx)(n.code,{children:"false"}),", \u6ce8\u610f\u5f00\u542f\u540e\u4f1a\u63d0\u5347\u6027\u80fd\u548c\u7528\u6237\u4f53\u9a8c"]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"hideOnRotating"}),(0,s.jsx)(n.td,{children:"\u65cb\u8f6c\u65f6\u662f\u5426\u9690\u85cf"}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"boolean"})}),(0,s.jsxs)(n.td,{children:["\u9ed8\u8ba4 ",(0,s.jsx)(n.code,{children:"false"}),", \u6ce8\u610f\u5f00\u542f\u540e\u4f1a\u63d0\u5347\u6027\u80fd\u548c\u7528\u6237\u4f53\u9a8c"]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"insertFirst"}),(0,s.jsx)(n.td,{children:"\u662f\u5426\u63d2\u5165\u5230\u524d\u65b9"}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"boolean"})}),(0,s.jsxs)(n.td,{children:["\u9ed8\u8ba4 ",(0,s.jsx)(n.code,{children:"false"}),", \u8be6\u7ec6\u5185\u5bb9\u8bf7\u67e5\u770b",(0,s.jsx)(n.code,{children:"https://openlayers.org/en/latest/apidoc/module-ol_Overlay-Overlay.html"})]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"stopEvent"}),(0,s.jsx)(n.td,{children:"\u662f\u5426\u963b\u6b62\u4e8b\u4ef6\u4f20\u9012\u5230\u5730\u56fe\u4e0a"}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"boolean"})}),(0,s.jsxs)(n.td,{children:["\u9ed8\u8ba4 ",(0,s.jsx)(n.code,{children:"false"}),", \u8be6\u7ec6\u5185\u5bb9\u8bf7\u67e5\u770b ",(0,s.jsx)(n.code,{children:"https://openlayers.org/en/latest/apidoc/module-ol_Overlay-Overlay.html"})]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"polyfillEvents"}),(0,s.jsx)(n.td,{children:"\u4ee3\u7406echrats\u56fe\u5c42\u7684 mousedown mouseup click \u4e8b\u4ef6"}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"boolean"})}),(0,s.jsxs)(n.td,{children:["\u9ed8\u8ba4 ",(0,s.jsx)(n.code,{children:"false"}),", \u4ec5\u4f5c\u4e3a\u5728\u4e8b\u4ef6\u6355\u83b7\u5f02\u5e38\u65f6\u914d\u7f6e\u5f00\u542f"]})]})]})]}),"\n",(0,s.jsx)(n.h3,{id:"\u4e8b\u4ef6",children:"\u4e8b\u4ef6"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",children:"echartslayer.on('redraw', function (event) {\n  console.log(this, event)\n});\n"})}),"\n",(0,s.jsx)(n.p,{children:"\u652f\u6301\u7684\u4e8b\u4ef6\u7cfb\u7edf\u5982\u4e0b\uff1a"}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{children:"\u4e8b\u4ef6\u540d"}),(0,s.jsx)(n.th,{children:"\u7b80\u4ecb"}),(0,s.jsx)(n.th,{children:"\u7c7b\u578b"}),(0,s.jsx)(n.th,{children:"\u5907\u6ce8"})]})}),(0,s.jsxs)(n.tbody,{children:[(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"load"}),(0,s.jsx)(n.td,{children:"echarts\u56fe\u5c42\u521b\u5efa\u5b8c\u6210\u540e\u53a8\u623f"}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"String"})}),(0,s.jsxs)(n.td,{children:["\u6b64\u65f6",(0,s.jsx)(n.code,{children:"echarts"}),"\u5b9e\u4f8b\u4e5f\u5df2\u521b\u5efa\u5b8c\u6bd5\uff0c\u53ef\u4ee5\u5728\u6b64\u4e8b\u4ef6\u56de\u8c03\u5185\u6dfb\u52a0",(0,s.jsx)(n.code,{children:"echarts"}),"\u7684\u4e8b\u4ef6\u76d1\u542c"]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"redraw"}),(0,s.jsx)(n.td,{children:"\u56fe\u5c42\u91cd\u65b0\u6e32\u67d3\u4e8b\u4ef6"}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"String"})}),(0,s.jsx)(n.td,{children:"\u6ce8\u610f\uff1a\u56e0\u4e3a\u8026\u5408\u539f\u56e0, \u6bcf\u6b21\u91cd\u7ed8\u4e8b\u4ef6\u53ef\u80fd\u4e0d\u53ea\u89e6\u53d1\u4e00\u6b21"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsxs)(n.td,{children:["change",":size"]}),(0,s.jsx)(n.td,{children:"\u5730\u56fe\u5927\u5c0f\u53d8\u5316\u4e8b\u4ef6"}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"String"})}),(0,s.jsx)(n.td,{children:"--"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"zoomend"}),(0,s.jsx)(n.td,{children:"\u5730\u56fe\u7f29\u653e\u7ed3\u675f\u4e8b\u4ef6"}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"String"})}),(0,s.jsx)(n.td,{children:"--"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsxs)(n.td,{children:["change",":rotation"]}),(0,s.jsx)(n.td,{children:"\u5730\u56fe\u65cb\u8f6c\u89d2\u5ea6\u53d8\u5316\u4e8b\u4ef6"}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"String"})}),(0,s.jsx)(n.td,{children:"--"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"movestart"}),(0,s.jsx)(n.td,{children:"\u5730\u56fe\u62d6\u62fd\u5f00\u59cb\u4e8b\u4ef6"}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"String"})}),(0,s.jsx)(n.td,{children:"--"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"moveend"}),(0,s.jsx)(n.td,{children:"\u5730\u56fe\u62d6\u62fd\u7ed3\u675f\u4e8b\u4ef6"}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"String"})}),(0,s.jsx)(n.td,{children:"--"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsxs)(n.td,{children:["change",":center"]}),(0,s.jsx)(n.td,{children:"\u5730\u56fe\u4e2d\u5fc3\u70b9\u53d8\u5316\u4e8b\u4ef6"}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"String"})}),(0,s.jsx)(n.td,{children:"--"})]})]})]})]})}function h(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(o,{...e})}):o(e)}},2036:(e,n,r)=>{r.d(n,{R:()=>l,x:()=>c});var s=r(7378);const t={},d=s.createContext(t);function l(e){const n=s.useContext(d);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:l(e.components),s.createElement(d.Provider,{value:n},e.children)}}}]);