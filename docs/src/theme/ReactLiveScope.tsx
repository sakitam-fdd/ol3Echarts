import 'ol/ol.css';
import React from 'react';
import * as leva from 'leva';
import * as ol from 'ol';
import proj4 from 'proj4';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import XYZ from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import { register } from 'ol/proj/proj4';
import { Projection } from 'ol/proj';
import * as echarts from 'echarts';
import 'echarts-gl';
import EChartsLayer from 'ol-echarts';
import useBaseUrl from '@docusaurus/useBaseUrl';

// Add react-live imports you need here
const ReactLiveScope = {
  React,
  ...React,

  useBaseUrl,
  proj4,
  ol,
  TileLayer,
  XYZ,
  VectorSource,
  VectorLayer,
  GeoJSON,
  Stroke,
  Fill,
  Style,
  echarts,
  EChartsLayer,
  Projection,
  register,

  leva,
  Leva: leva.Leva,
  LevaPanel: leva.LevaPanel,
};

export default ReactLiveScope;
