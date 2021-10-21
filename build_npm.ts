import * as path from "https://deno.land/std@0.109.0/path/mod.ts";
import { build } from "https://deno.land/x/dnt@0.0.15/mod.ts";
import * as esbuild from "https://deno.land/x/esbuild@v0.13.4/mod.js";

const tmpDir = Deno.makeTempDirSync();

const _output = await build({
  entryPoints: ["./src/node-adapter.ts", "./src/comlink.ts"],
  outDir: tmpDir,
  package: { name: "comlink", version: "0.0.0" },
  typeCheck: false, // TODO(lucacasonato): enable type checking
});

await esbuild.initialize({});

try {
  Deno.removeSync("./dist", { recursive: true });
} catch {
  // no op
}
Deno.mkdirSync("./dist");

const outdir = path.join(tmpDir, "mjs");

await esbuild.build({
  entryPoints: [
    path.join(outdir, "./node-adapter.js"),
    path.join(outdir, "./comlink.js"),
  ],
  outdir: "./dist/esm",
  outExtension: {
    ".js": ".min.js",
  },
  format: "esm",
  write: true,
});

esbuild.stop();
