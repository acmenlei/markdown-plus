import resolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";

export default [
  {
    input: './index.ts',
    output: {
      dir: 'dist',
      format: "esm",
      entryFileNames: 'markdown-transform-html.esm.js'
    },
    plugins: [resolve(), commonjs(), typescript()]
  },
  {
    input: './index.ts',
    output: {
      dir: 'dist',
      format: "esm",
      entryFileNames: 'markdown-transform-html.prod.esm.js'
    },
    plugins: [resolve(), commonjs(), typescript(), terser()]
  }
]; 