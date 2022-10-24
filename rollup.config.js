import resolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

export default [
  {
    input: './index.ts',
    output: {
      dir: 'dist',
      format: "esm",
      entryFileNames: 'markdown-transform-html.esm.js'
    },
    plugins: [resolve(), typescript()]
  },
  {
    input: './index.ts',
    output: {
      dir: 'dist',
      format: "esm",
      entryFileNames: 'markdown-transform-html.prod.esm.js'
    },
    plugins: [resolve(), typescript(), terser()]
  }
]; 