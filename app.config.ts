import { defineConfig } from "@solidjs/start/config";
/* @ts-ignore */
import pkg from "@vinxi/plugin-mdx";

const { default: mdx } = pkg;
export default defineConfig({
  extensions: ["mdx", "md"],
  ssr: true,
  server: {
      baseURL: `${process.env.BASE_PATH}/contemporaries`,
      preset: "static"
    },
  vite: {
    server: {
      baseURL: `${process.env.BASE_PATH}/contemporaries`,
      preset: "static"
    },
    plugins: [
      mdx.withImports({})({
        jsx: true,
        jsxImportSource: "solid-js",
        providerImportSource: "solid-mdx"
      })
    ]
  }
});