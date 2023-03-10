// imports
import type { Options } from "tsup";

// config
export const tsup: Options = {
    clean: true,
    dts: true,
    entryPoints: ["src/index.ts"],
    format: ["cjs", "esm", "iife"],
    minify: true,
    sourcemap: true,
};
