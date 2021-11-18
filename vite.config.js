import path from "path";
import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

export default defineConfig({
  plugins: [...(process.env.NODE_ENV !== "test" ? [reactRefresh()] : [])],
  build: {
    lib: {
      entry: path.resolve(__dirname, "lib/index.ts"),
      name: "ReactConditions",
      fileName: (format) => `react-conditions.${format}.js`,
    },
    rollupOptions: {
      external: ["react"],
      output: {
        globals: {
          react: "React",
        },
      },
    },
  },
});
