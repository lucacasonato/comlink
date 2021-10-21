import { assertEquals } from "https://deno.land/std@0.101.0/testing/asserts.ts";

import * as Comlink from "../src/comlink.ts";

function withWorker(fn: (worker: Worker) => Promise<void>) {
  return async () => {
    const worker = new Worker(
      new URL("./fixtures/worker-module.js", import.meta.url),
      { type: "module" },
    );
    try {
      await fn(worker);
    } finally {
      worker.terminate();
    }
  };
}

Deno.test(
  "can communicate",
  withWorker(async (worker) => {
    const proxy = Comlink.wrap<(a: number, b: number) => number>(worker);
    assertEquals(await proxy(1, 3), 4);
  }),
);

Deno.test(
  "can tunnels a new endpoint with createEndpoint",
  withWorker(async (worker) => {
    const proxy = Comlink.wrap(worker);
    const otherEp = await proxy[Comlink.createEndpoint]();
    const otherProxy = Comlink.wrap<(a: number, b: number) => number>(otherEp);
    assertEquals(await otherProxy(20, 1), 21);
    otherEp.close();
  }),
);
