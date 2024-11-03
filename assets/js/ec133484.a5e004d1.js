"use strict";(self.webpackChunkol_echarts_docs=self.webpackChunkol_echarts_docs||[]).push([[118],{9579:(n,t,e)=>{e.r(t),e.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>p,frontMatter:()=>a,metadata:()=>r,toc:()=>d});var o=e(6106),i=e(2036);const a={id:"line-with-4490",title:"4490\u5750\u6807\u7cfb\u663e\u793a\u6298\u7ebf\u56fe"},s=void 0,r={id:"playgrounds/line-with-4490",title:"4490\u5750\u6807\u7cfb\u663e\u793a\u6298\u7ebf\u56fe",description:"\u793a\u4f8b",source:"@site/docs/playgrounds/line-with-4490.mdx",sourceDirName:"playgrounds",slug:"/playgrounds/line-with-4490",permalink:"/ol3Echarts/docs/playgrounds/line-with-4490",draft:!1,unlisted:!1,editUrl:"https://github.com/sakitam-fdd/ol3Echarts/edit/master/documents/docs/docs/playgrounds/line-with-4490.mdx",tags:[],version:"current",lastUpdatedBy:"sakitam-fdd",lastUpdatedAt:1730645386e3,frontMatter:{id:"line-with-4490",title:"4490\u5750\u6807\u7cfb\u663e\u793a\u6298\u7ebf\u56fe"},sidebar:"docs",previous:{title:"\u6298\u7ebf\u56fe",permalink:"/ol3Echarts/docs/playgrounds/line"},next:{title:"\u70ed\u529b\u56fe",permalink:"/ol3Echarts/docs/playgrounds/heatmap"}},c={},d=[{value:"\u793a\u4f8b",id:"\u793a\u4f8b",level:3}];function l(n){const t={code:"code",h3:"h3",pre:"pre",...(0,i.R)(),...n.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.h3,{id:"\u793a\u4f8b",children:"\u793a\u4f8b"}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{className:"language-jsx",metastring:"live",live:!0,children:"function render(props) {\n  const container = useRef(null);\n\n  const dataUrl = useBaseUrl('/json/line.json');\n\n  const initChat = (map, option) => {\n    const chart = new EChartsLayer(option, {\n      hideOnMoving: true,\n      hideOnZooming: true,\n    });\n\n    chart.appendTo(map);\n  };\n\n  const init = async () => {\n    proj4.defs('EPSG:4490', '+proj=longlat +ellps=GRS80 +no_defs');\n    register(proj4);\n\n    const projection = new Projection({\n      code: 'EPSG:4490',\n      units: 'degrees',\n      axisOrientation: 'neu',\n    });\n    projection.setExtent([-180, -90, 180, 90]);\n\n    const map = new ol.Map({\n      target: container.current,\n      view: new ol.View({\n        projection: projection,\n        // projection: 'EPSG:3857',\n        zoom: 4,\n        rotation: 0,\n        center: [113.53450137499999, 34.44104525],\n      }),\n      layers: [\n        new TileLayer({\n          source: new XYZ({\n            url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',\n          }),\n        }),\n      ],\n    });\n\n    const data = await fetch(dataUrl).then((res) => res.json());\n\n    const option = {\n      xAxis: [],\n      yAxis: [],\n      grid: [],\n      series: [],\n      animation: false,\n      // backgroundColor: ,\n      title: {\n        text: 'Inflation from 2006 to 2011',\n        subtext: 'data from macrofocus',\n        sublink: 'https://www.macrofocus.com/public/products/infoscope/datasets/pricesandearnings/',\n        left: 'center',\n        top: 5,\n        itemGap: 0,\n        textStyle: {\n          color: '#eee',\n        },\n      },\n      tooltip: {\n        trigger: 'axis',\n      },\n    };\n    const inflationStartIdx = 14;\n    const inflationYearCount = 6;\n    const inflationYearStart = '2006';\n    const xAxisCategory = [];\n    for (let i = 0; i < inflationYearCount; i++) {\n      xAxisCategory.push(`${+inflationYearStart + i}`);\n    }\n\n    if (data.data) {\n      data.data.forEach((dataItem, idx) => {\n        const coordinates = data.geoCoordinates[dataItem[0]];\n        idx += '';\n\n        const inflationData = [];\n        for (let k = 0; k < inflationYearCount; k++) {\n          inflationData.push(dataItem[inflationStartIdx + k]);\n        }\n\n        option.xAxis.push({\n          id: idx,\n          gridId: idx,\n          type: 'category',\n          name: dataItem[0],\n          nameStyle: {\n            color: '#ddd',\n            fontSize: 12,\n          },\n          nameLocation: 'middle',\n          nameGap: 3,\n          splitLine: { show: false },\n          axisTick: { show: false },\n          axisLabel: { show: false },\n          axisLine: {\n            onZero: false,\n            lineStyle: {\n              color: '#bbb',\n            },\n          },\n          data: xAxisCategory,\n          z: 100,\n        });\n\n        option.yAxis.push({\n          id: idx,\n          gridId: idx,\n          splitLine: { show: false },\n          axisTick: { show: false },\n          axisLabel: { show: false },\n          axisLine: {\n            lineStyle: {\n              color: '#bbb',\n            },\n          },\n          z: 100,\n        });\n\n        option.grid.push({\n          id: idx,\n          width: 30,\n          height: 30,\n          z: 100,\n        });\n\n        option.series.push({\n          id: idx,\n          type: 'line',\n          xAxisId: idx,\n          yAxisId: idx,\n          data: inflationData,\n          coordinates,\n          z: 100,\n        });\n      });\n    }\n\n    initChat(map, option);\n\n    function resize(target) {}\n\n    return {\n      resize,\n    };\n  };\n\n  useEffect(() => {\n    const { resize } = init();\n\n    return () => {};\n  }, []);\n\n  return (\n    <div className=\"live-wrap\">\n      <div ref={container} className=\"map-content\" />\n    </div>\n  );\n}\n"})})]})}function p(n={}){const{wrapper:t}={...(0,i.R)(),...n.components};return t?(0,o.jsx)(t,{...n,children:(0,o.jsx)(l,{...n})}):l(n)}},2036:(n,t,e)=>{e.d(t,{R:()=>s,x:()=>r});var o=e(7378);const i={},a=o.createContext(i);function s(n){const t=o.useContext(a);return o.useMemo((function(){return"function"==typeof n?n(t):{...t,...n}}),[t,n])}function r(n){let t;return t=n.disableParentContext?"function"==typeof n.components?n.components(i):n.components||i:s(n.components),o.createElement(a.Provider,{value:t},n.children)}}}]);