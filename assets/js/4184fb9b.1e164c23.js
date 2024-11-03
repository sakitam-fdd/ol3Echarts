"use strict";(self.webpackChunkol_echarts_docs=self.webpackChunkol_echarts_docs||[]).push([[555],{7854:(n,e,t)=>{t.r(e),t.d(e,{assets:()=>i,contentTitle:()=>c,default:()=>u,frontMatter:()=>s,metadata:()=>a,toc:()=>l});var o=t(6106),r=t(2036);const s={id:"echarts-geojson",title:"\u89e3\u6790 echarts\u4e2d\u7684 geojson"},c=void 0,a={id:"playgrounds/echarts-geojson",title:"\u89e3\u6790 echarts\u4e2d\u7684 geojson",description:"\u6709\u4e9b\u540c\u5b66\u60f3\u7528echart\u4e2d\u7684map\u7c7b\u578b\u6765\u6e32\u67d3\u4e00\u4e9b\u77e2\u91cf\u6570\u636e\uff0c\u8fd9\u4e2a\u76ee\u524d\u662f\u65e0\u6cd5\u76f4\u63a5\u8fdb\u884c\u5b9e\u73b0\u7684\uff0c\u6211\u4eeckey\u53d8\u901a\u7684\u901a\u8fc7",source:"@site/docs/playgrounds/echarts-geojson.mdx",sourceDirName:"playgrounds",slug:"/playgrounds/echarts-geojson",permalink:"/ol3Echarts/docs/playgrounds/echarts-geojson",draft:!1,unlisted:!1,editUrl:"https://github.com/sakitam-fdd/ol3Echarts/edit/master/documents/docs/docs/playgrounds/echarts-geojson.mdx",tags:[],version:"current",lastUpdatedBy:"sakitam-fdd",lastUpdatedAt:1730645386e3,frontMatter:{id:"echarts-geojson",title:"\u89e3\u6790 echarts\u4e2d\u7684 geojson"},sidebar:"docs",previous:{title:"\u589e\u91cf\u6e32\u67d3",permalink:"/ol3Echarts/docs/playgrounds/incremental"},next:{title:"ol-echarts v4.0.1",permalink:"/ol3Echarts/docs/typedoc/ol-echarts/"}},i={},l=[{value:"\u793a\u4f8b",id:"\u793a\u4f8b",level:3}];function d(n){const e={code:"code",h3:"h3",p:"p",pre:"pre",...(0,r.R)(),...n.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(e.p,{children:"\u6709\u4e9b\u540c\u5b66\u60f3\u7528echart\u4e2d\u7684map\u7c7b\u578b\u6765\u6e32\u67d3\u4e00\u4e9b\u77e2\u91cf\u6570\u636e\uff0c\u8fd9\u4e2a\u76ee\u524d\u662f\u65e0\u6cd5\u76f4\u63a5\u8fdb\u884c\u5b9e\u73b0\u7684\uff0c\u6211\u4eeckey\u53d8\u901a\u7684\u901a\u8fc7\n\u89e3\u6790\u5bf9\u5e94\u7684\u533a\u57df\u6570\u636e\u76f4\u63a5\u4f7f\u7528ol\u7684\u77e2\u91cf\u56fe\u5c42\u6765\u8fdb\u884c\u6e32\u67d3\uff0c\u4ee5\u4e0b\u662f\u4e00\u4e2a\u793a\u4f8b"}),"\n",(0,o.jsx)(e.h3,{id:"\u793a\u4f8b",children:"\u793a\u4f8b"}),"\n",(0,o.jsx)(e.pre,{children:(0,o.jsx)(e.code,{className:"language-jsx",metastring:"live",live:!0,children:"function render(props) {\n  const container = useRef(null);\n\n  const dataUrl = useBaseUrl('/json/world.json');\n\n  const init = async () => {\n    const map = new ol.Map({\n      target: container.current,\n      view: new ol.View({\n        projection: 'EPSG:4326',\n        zoom: 2,\n        rotation: 0,\n        center: [113.53450137499999, 34.44104525],\n      }),\n      layers: [\n        new TileLayer({\n          source: new XYZ({\n            url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',\n          }),\n        }),\n      ],\n    });\n\n    const data = await fetch(dataUrl).then(res => res.json());\n\n    const styleFunction = function (feature) {\n      const num = feature.getProperties()['childNum'];\n      return new Style({\n        stroke: new Stroke({\n          color: '#162436',\n          width: 1\n        }),\n        fill: new Fill({\n          color: num > 3 ? '#ff4500' : (num > 2 ? '#c1e682' : '#8cd0ef')\n        })\n      })\n    };\n    const vectorSource = new VectorSource({\n      features: (new GeoJSON()).readFeatures(EChartsLayer.formatGeoJSON(data))\n    });\n    const vectorLayer = new VectorLayer({\n      source: vectorSource,\n      style: styleFunction\n    });\n\n    map.addLayer(vectorLayer);\n\n    function resize(target) {}\n\n    return {\n      resize,\n    }\n  }\n\n  useEffect(() => {\n    const { resize } = init();\n\n    return () => {\n    };\n  }, []);\n\n  return (\n    <div className=\"live-wrap\">\n      <div ref={container} className=\"map-content\" />\n    </div>\n  );\n}\n"})})]})}function u(n={}){const{wrapper:e}={...(0,r.R)(),...n.components};return e?(0,o.jsx)(e,{...n,children:(0,o.jsx)(d,{...n})}):d(n)}},2036:(n,e,t)=>{t.d(e,{R:()=>c,x:()=>a});var o=t(7378);const r={},s=o.createContext(r);function c(n){const e=o.useContext(s);return o.useMemo((function(){return"function"==typeof n?n(e):{...e,...n}}),[e,n])}function a(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(r):n.components||r:c(n.components),o.createElement(s.Provider,{value:e},n.children)}}}]);