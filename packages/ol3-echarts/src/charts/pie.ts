const pie = function (
  _options: any,
  serie: { center: any; coordinates: number[] },
  coordinateSystem: { dataToPoint: (arg0: any) => any },
) {
  serie.center = coordinateSystem.dataToPoint(serie.coordinates);
  return serie;
};

export default pie;
