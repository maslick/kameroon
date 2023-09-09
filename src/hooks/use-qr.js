import { useState, useEffect } from "react";

export function useQr(callback) {
  const [zbarWorker, setZbarWorker] = useState(null);
  const [zxingWorker, setZxingWorker] = useState(null);

  useEffect(() => {
    function createWorkers() {
      try {
        const worker1 = new Worker("zbarWorker.js");
        const worker2 = new Worker("zxingWorker.js");

        const onmessage = (alg) => async ev => {
          if (ev.data != null) {
            const result = ev.data;
            const rawcode = result.data;
            const milliseconds = ev.data.ms;
            callback({rawcode, milliseconds, alg});
          }
        };

        worker1.onmessage = onmessage("zbar");
        worker2.onmessage = onmessage("zxing");

        setZbarWorker(worker1);
        setZxingWorker(worker2);
      } catch (err) {
        console.error(err);
      }
    }

    createWorkers();
  }, []);

  useEffect(() => {
    return () => {
      if (zbarWorker) zbarWorker.terminate();
      if (zxingWorker) zxingWorker.terminate();
    }
  }, [zbarWorker, zxingWorker]);

  return [zbarWorker, zxingWorker];
}
