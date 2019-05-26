class EChartsLayer {
  private _options: object;

  constructor(options: object) {
    this._options = options;
  }

  getOptions(): object {
    return this._options;
  }

  setOptions(options: object) {
    this._options = options;
  }
}

export default EChartsLayer;
