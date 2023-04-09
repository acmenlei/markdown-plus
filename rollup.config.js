import resolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import commonjs from "@rollup/plugin-commonjs"
import terser from "@rollup/plugin-terser"
import postcss from "rollup-plugin-postcss"

export default [
  {
    input: "./index.ts",
    output: {
      dir: "dist/umd",
      format: "umd",
      name: "MarkdownTransformer",
      entryFileNames: "markdown-transform-html.js",
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript(),
      terser(),
      postcss({
        extract: true,
        minimize: true,
      }),
    ],
  },
  {
    input: "./index.ts",
    output: {
      dir: "dist/esm",
      format: "esm",
      entryFileNames: "markdown-transform-html.esm.js",
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript(),
      terser(),
      postcss({
        extract: true,
        minimize: true,
      }),
    ],
  },
]