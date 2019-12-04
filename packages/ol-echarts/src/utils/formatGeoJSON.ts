/**
 * form https://github.com/ecomfe/echarts/blob/master/src/coord/geo/parseGeoJson.js
 */
import echarts from 'echarts';

/**
 * check is decoded
 * @param json
 * @returns {boolean}
 */
const checkDecoded = (json: any) => !json.UTF8Encoding;

/**
 * decode polygon
 * @param coordinate
 * @param encodeOffsets
 * @param encodeScale
 * @returns {null}
 */
const decodePolygon = (
  coordinate: { length: number; charCodeAt: { (arg0: number): number; (arg0: number): number } },
  encodeOffsets: any[], encodeScale: number,
) => {
  const result = [];
  let [prevX, prevY] = [encodeOffsets[0], encodeOffsets[1]];
  for (let i = 0; i < coordinate.length; i += 2) {
    let x = coordinate.charCodeAt(i) - 64;
    let y = coordinate.charCodeAt(i + 1) - 64;
    // ZigZag decoding
    // eslint-disable-next-line no-bitwise
    x = (x >> 1) ^ -(x & 1);
    // eslint-disable-next-line no-bitwise
    y = (y >> 1) ^ -(y & 1);
    // Delta deocding
    x += prevX;
    y += prevY;
    prevX = x;
    prevY = y;
    // @ts-ignore
    result.push([x / encodeScale, y / encodeScale]);
  }
  return result;
};

/**
 * decode json
 * @param json
 * @returns {*}
 */
const decode = (json: any) => {
  if (checkDecoded(json)) {
    return json;
  }
  let encodeScale = json.UTF8Scale;
  if (encodeScale == null) {
    encodeScale = 1024;
  }
  const features = json.features;
  for (let f = 0; f < features.length; f++) {
    const feature = features[f];
    const geometry = feature.geometry;
    const [coordinates, encodeOffsets] = [geometry.coordinates, geometry.encodeOffsets];
    for (let c = 0; c < coordinates.length; c++) {
      const coordinate = coordinates[c];
      if (geometry.type === 'Polygon') {
        coordinates[c] = decodePolygon(coordinate, encodeOffsets[c], encodeScale);
      } else if (geometry.type === 'MultiPolygon') {
        for (let c2 = 0; c2 < coordinate.length; c2++) {
          const polygon = coordinate[c2];
          coordinate[c2] = decodePolygon(polygon, encodeOffsets[c][c2], encodeScale);
        }
      }
    }
  }
  json.UTF8Encoding = false;
  return json;
};

/**
 * decode geoJson
 * @param json
 */
export default function (json: any) {
  const geoJson = decode(json);
  // @ts-ignore
  const _features = echarts.util.map(
    // @ts-ignore
    echarts.util.filter(geoJson.features,
      (featureObj: { geometry: { coordinates: { length: number } }; properties: any }) =>
        // Output of mapshaper may have geometry null
         featureObj.geometry && featureObj.properties && featureObj.geometry.coordinates.length > 0),
    (featureObj: { properties: any; geometry: any }) => {
      const properties = featureObj.properties;
      const geo = featureObj.geometry;
      const coordinates = geo.coordinates;
      const geometries = [];
      if (geo.type === 'Polygon') {
        geometries.push(coordinates[0]);
      }
      if (geo.type === 'MultiPolygon') {
        // @ts-ignore
        echarts.util.each(coordinates, (item: any[]) => {
          if (item[0]) {
            geometries.push(item[0]);
          }
        });
      }
      return {
        properties,
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: geometries,
        },
      };
    },
  );
  return {
    type: 'FeatureCollection',
    crs: {},
    features: _features,
  };
}
