class KoderZxing {
  initialize(config) {
    return (async () => {
      // Load WASM file
      console.log("Zxing");
      config ||= {};
      const directory = config.wasmDirectory || "./wasm";
      this.mod = await ZXing({locateFile: file => `${directory}/${file}`});
      return this;
    })();
  }

  decode(imgData, width, height, mode = true, format = "") {
    const buffer = this.mod._malloc(imgData.byteLength);
    this.mod.HEAPU8.set(imgData, buffer);
    const results = [];
    const result = this.mod.readBarcodeFromPixmap(buffer, width, height, mode, format);
    this.mod._free(buffer);
    if (result && result.text.length > 0) {
      results.push({
        code: result.text,
        type: result.format
      });
    }
    if (results.length > 0) return results[0];
    else return null;
  }
}