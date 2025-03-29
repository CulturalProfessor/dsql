import Papa from "papaparse";

self.onmessage = function (event) {
  const { file } = event.data;
  let allData = [];

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
    worker: true,
    chunkSize: 1024 * 1024,
    step: function (row) {
      allData.push(row.data);
    },
    complete: () => {
      console.log("Parsing complete");
      self.postMessage({ complete: true, data: allData });
    },
    error: (error) => self.postMessage({ error }),
  });
};
