// imports
import type { Options } from "tsup";

// production
const isProduction = process.env.NODE_ENV === "production";

// config
export const tsup: Options = {
    clean: true,
    dts: true,
    entryPoints: ["src/index.ts"],
    format: ["cjs", "esm", "iife"],
    minify: isProduction,
    sourcemap: true,
};
