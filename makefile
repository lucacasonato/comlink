build:
	deno run --allow-read --allow-write --allow-net https://deno.land/x/dnt/cli.ts ./src/comlink.ts --target ES6 --outDir ./dist --declaration