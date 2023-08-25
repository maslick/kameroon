import { useState, useEffect } from "react";

export function useQr(callback) {
  const [qrworker, setQrWorker] = useState(null);

  useEffect(() => {
    async function createWorker() {
      try {
        const qrworker = new Worker("wasmWorker.js");
        qrworker.onmessage = async ev => {
          if (ev.data != null) {
            const result = ev.data;
            const rawcode = result.data;
            const milliseconds = ev.data.ms;
            callback({rawcode, milliseconds});
          }
        };
        setQrWorker(qrworker);
      } catch (err) {
        console.error(err);
      }
    }

    if (!qrworker) {
      createWorker();
    }
    else
      return function cleanup() {
        if (qrworker) {
          console.log("cleaning up worker");
          qrworker.terminate();
        }
      };
  }, []);

  return qrworker;
}
