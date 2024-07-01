import 'ol/ol.css';
import React from 'react';
import * as leva from 'leva';
import * as ol from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import * as echarts from 'echarts';
import EChartsLayer from 'ol-echarts';
import useBaseUrl from '@docusaurus/useBaseUrl';

console.log(ol, echarts);

// Add react-live imports you need here
const ReactLiveScope = {
  React,
  ...React,

  useBaseUrl,
  ol,
  TileLayer,
  XYZ,
  echarts,
  EChartsLayer,

  leva,
  Leva: leva.Leva,
  LevaPanel: leva.LevaPanel,
};

export default ReactLiveScope;
