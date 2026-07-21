type Position = number[];
type PolygonCoordinates = Position[][];
type MultiPolygonCoordinates = PolygonCoordinates[];

export interface EncodedGeometry {
  type?: string;
  coordinates?: unknown;
  encodeOffsets?: unknown;
}

export interface EncodedGeoJSON {
  type?: string;
  UTF8Encoding?: boolean;
  UTF8Scale?: number;
  crs?: Record<string, unknown>;
  features: Array<{
    type?: string;
    geometry?: EncodedGeometry | null;
    properties?: Record<string, unknown> | null;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

export interface DecodedFeatureCollection {
  type: 'FeatureCollection';
  crs: Record<string, unknown>;
  features: Array<{
    type: 'Feature';
    properties: Record<string, unknown>;
    geometry: {
      type: 'Polygon' | 'MultiPolygon';
      coordinates: PolygonCoordinates | MultiPolygonCoordinates;
    };
  }>;
}

/** Decode one ECharts UTF8-encoded linear ring. */
const decodePolygon = (coordinate: string, encodeOffsets: number[], encodeScale: number): Position[] => {
  const result: Position[] = [];
  let [prevX, prevY] = encodeOffsets;
  for (let i = 0; i < coordinate.length; i += 2) {
    let x = coordinate.charCodeAt(i) - 64;
    let y = coordinate.charCodeAt(i + 1) - 64;
    // ZigZag and delta decoding are defined by the legacy ECharts map format.
    // eslint-disable-next-line no-bitwise
    x = (x >> 1) ^ -(x & 1);
    // eslint-disable-next-line no-bitwise
    y = (y >> 1) ^ -(y & 1);
    x += prevX;
    y += prevY;
    prevX = x;
    prevY = y;
    result.push([x / encodeScale, y / encodeScale]);
  }
  return result;
};

function copyCoordinates(value: unknown): unknown {
  return Array.isArray(value) ? value.map(copyCoordinates) : value;
}

function decodeGeometry(
  geometry: EncodedGeometry,
  encoded: boolean,
  scale: number,
): DecodedFeatureCollection['features'][number]['geometry'] | null {
  const { type, coordinates, encodeOffsets } = geometry;
  if (type !== 'Polygon' && type !== 'MultiPolygon') return null;

  if (!encoded) {
    return {
      type,
      coordinates: copyCoordinates(coordinates) as PolygonCoordinates | MultiPolygonCoordinates,
    };
  }

  if (type === 'Polygon' && Array.isArray(coordinates) && Array.isArray(encodeOffsets)) {
    return {
      type,
      coordinates: coordinates.map((ring, index) =>
        decodePolygon(String(ring), encodeOffsets[index] as number[], scale),
      ),
    };
  }

  if (type === 'MultiPolygon' && Array.isArray(coordinates) && Array.isArray(encodeOffsets)) {
    return {
      type,
      coordinates: coordinates.map((polygon, polygonIndex) =>
        (polygon as unknown[]).map((ring, ringIndex) =>
          decodePolygon(String(ring), (encodeOffsets[polygonIndex] as number[][])[ringIndex], scale),
        ),
      ),
    };
  }

  return null;
}

/**
 * Decode ECharts-encoded GeoJSON without mutating the caller's data.
 * Polygon holes and MultiPolygon boundaries are preserved.
 */
export default function formatGeoJSON(json: EncodedGeoJSON): DecodedFeatureCollection {
  const encoded = Boolean(json.UTF8Encoding);
  const scale = json.UTF8Scale ?? 1024;
  const features = json.features.flatMap((feature) => {
    if (!feature.geometry) return [];
    const geometry = decodeGeometry(feature.geometry, encoded, scale);
    if (!geometry || !Array.isArray(geometry.coordinates) || geometry.coordinates.length === 0) return [];
    return [
      {
        type: 'Feature' as const,
        properties: { ...(feature.properties || {}) },
        geometry,
      },
    ];
  });

  return {
    type: 'FeatureCollection',
    crs: { ...(json.crs || {}) },
    features,
  };
}
