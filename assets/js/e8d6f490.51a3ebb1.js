"use strict";(self.webpackChunkol_echarts_docs=self.webpackChunkol_echarts_docs||[]).push([[935],{4728:(n,e,t)=>{t.r(e),t.d(e,{assets:()=>l,contentTitle:()=>i,default:()=>p,frontMatter:()=>a,metadata:()=>s,toc:()=>c});var o=t(6106),r=t(2036);const a={id:"point",title:"\u81ea\u5b9a\u4e49\u70b9\u89c6\u56fe"},i=void 0,s={id:"playgrounds/point",title:"\u81ea\u5b9a\u4e49\u70b9\u89c6\u56fe",description:"\u793a\u4f8b",source:"@site/docs/playgrounds/point.mdx",sourceDirName:"playgrounds",slug:"/playgrounds/point",permalink:"/ol-echarts/docs/playgrounds/point",draft:!1,unlisted:!1,editUrl:"https://github.com/sakitam-fdd/ol3Echarts/edit/master/documents/docs/docs/playgrounds/point.mdx",tags:[],version:"current",lastUpdatedBy:"sakitam-fdd",lastUpdatedAt:1730645386e3,frontMatter:{id:"point",title:"\u81ea\u5b9a\u4e49\u70b9\u89c6\u56fe"},sidebar:"docs",previous:{title:"\u5168\u7403\u98ce\u5411",permalink:"/ol-echarts/docs/playgrounds/wind"},next:{title:"\u997c\u56fe",permalink:"/ol-echarts/docs/playgrounds/pie"}},l={},c=[{value:"\u793a\u4f8b",id:"\u793a\u4f8b",level:3}];function d(n){const e={code:"code",h3:"h3",pre:"pre",...(0,r.R)(),...n.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(e.h3,{id:"\u793a\u4f8b",children:"\u793a\u4f8b"}),"\n",(0,o.jsx)(e.pre,{children:(0,o.jsx)(e.code,{className:"language-jsx",metastring:"live",live:!0,children:"function render(props) {\n  const container = useRef(null);\n\n  const dataUrl = useBaseUrl('/json/bin.json');\n\n  const initChat = (map, option) => {\n    const chart = new EChartsLayer(option, {\n      stopEvent: false,\n      hideOnMoving: false,\n      hideOnZooming: false,\n      forcedPrecomposeRerender: true,\n    });\n\n    chart.appendTo(map);\n  };\n\n  var COLORS = ['#070093', '#1c3fbf', '#1482e5', '#70b4eb', '#b4e0f3', '#ffffff'];\n  var lngExtent = [39.5, 40.6];\n  var latExtent = [115.9, 116.8];\n  var cellCount = [50, 50];\n  var cellSizeCoord = [(lngExtent[1] - lngExtent[0]) / cellCount[0], (latExtent[1] - latExtent[0]) / cellCount[1]];\n\n  var gapSize = 0;\n\n  const renderItem = (params, api) => {\n    var context = params.context;\n    var lngIndex = api.value(0);\n    var latIndex = api.value(1);\n    var coordLeftTop = [\n      +(latExtent[0] + lngIndex * cellSizeCoord[0]).toFixed(6),\n      +(lngExtent[0] + latIndex * cellSizeCoord[1]).toFixed(6),\n    ];\n    var pointLeftTop = getCoord(params, api, lngIndex, latIndex);\n    var pointRightBottom = getCoord(params, api, lngIndex + 1, latIndex + 1);\n\n    return {\n      type: 'rect',\n      shape: {\n        x: pointLeftTop[0],\n        y: pointLeftTop[1],\n        width: pointRightBottom[0] - pointLeftTop[0],\n        height: pointRightBottom[1] - pointLeftTop[1],\n      },\n      style: api.style({\n        stroke: 'rgba(0,0,0,0.1)',\n      }),\n      styleEmphasis: api.styleEmphasis(),\n    };\n  };\n\n  const getCoord = (params, api, lngIndex, latIndex) => {\n    var coords = params.context.coords || (params.context.coords = []);\n    var key = lngIndex + '-' + latIndex;\n\n    // bmap returns point in integer, which makes cell width unstable.\n    // So we have to use right bottom point.\n    return (\n      coords[key] ||\n      (coords[key] = api.coord([\n        +(latExtent[0] + lngIndex * cellSizeCoord[0]).toFixed(6),\n        +(lngExtent[0] + latIndex * cellSizeCoord[1]).toFixed(6),\n      ]))\n    );\n  };\n\n  const init = async () => {\n    const map = new ol.Map({\n      target: container.current,\n      view: new ol.View({\n        projection: 'EPSG:4326',\n        rotation: 0,\n        center: [116.28245, 39.92121],\n        zoom: 9, // resolution\n      }),\n      layers: [\n        new TileLayer({\n          source: new XYZ({\n            url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',\n          }),\n        }),\n      ],\n    });\n\n    const data = await fetch(dataUrl).then((res) => res.json());\n\n    const option = {\n      tooltip: {\n        formatter: function (params, ticket, callback) {\n          return params.value;\n        },\n        trigger: 'item',\n      },\n      visualMap: {\n        type: 'piecewise',\n        inverse: true,\n        top: 10,\n        right: 10,\n        pieces: [\n          {\n            value: 0,\n            color: COLORS[0],\n          },\n          {\n            value: 1,\n            color: COLORS[1],\n          },\n          {\n            value: 2,\n            color: COLORS[2],\n          },\n          {\n            value: 3,\n            color: COLORS[3],\n          },\n          {\n            value: 4,\n            color: COLORS[4],\n          },\n          {\n            value: 5,\n            color: COLORS[5],\n          },\n        ],\n        borderColor: '#ccc',\n        borderWidth: 2,\n        backgroundColor: '#eee',\n        dimension: 2,\n        inRange: {\n          color: COLORS,\n          opacity: 0.7,\n        },\n      },\n      series: [\n        {\n          type: 'custom',\n          renderItem: renderItem,\n          animation: false,\n          itemStyle: {\n            emphasis: {\n              color: 'yellow',\n            },\n          },\n          encode: {\n            tooltip: 2,\n          },\n          data: data,\n        },\n      ],\n    };\n\n    initChat(map, option);\n\n    function resize(target) {}\n\n    return {\n      resize,\n    };\n  };\n\n  useEffect(() => {\n    const { resize } = init();\n\n    return () => {};\n  }, []);\n\n  return (\n    <div className=\"live-wrap\">\n      <div ref={container} className=\"map-content\" />\n    </div>\n  );\n}\n"})})]})}function p(n={}){const{wrapper:e}={...(0,r.R)(),...n.components};return e?(0,o.jsx)(e,{...n,children:(0,o.jsx)(d,{...n})}):d(n)}},2036:(n,e,t)=>{t.d(e,{R:()=>i,x:()=>s});var o=t(7378);const r={},a=o.createContext(r);function i(n){const e=o.useContext(a);return o.useMemo((function(){return"function"==typeof n?n(e):{...e,...n}}),[e,n])}function s(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(r):n.components||r:i(n.components),o.createElement(a.Provider,{value:e},n.children)}}}]);