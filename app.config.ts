import { defineConfig } from "@solidjs/start/config";
/* @ts-ignore */
import pkg from "@vinxi/plugin-mdx";

const { default: mdx } = pkg;
export default defineConfig({
  extensions: ["mdx", "md", "tsx"],
  ssr: true,
  server: {
    baseURL: '/contemporaries',
    preset: "static"
  },
  vite: {
    server: {
      baseURL: '/contemporaries',
      preset: "static"
    },
    plugins: [
      mdx.withImports({})({
        jsx: true,
        ssr: true,
        jsxImportSource: "solid-js",
        providerImportSource: "solid-mdx"
      })
    ]
  }
});