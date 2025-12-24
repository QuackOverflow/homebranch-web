import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  envDir: ".",
  envPrefix: "VITE_",
  plugins: [reactRouter(), tsconfigPaths()],
  server: {
    allowedHosts: [process.env.ALLOWED_HOST ?? "localhost"],
    cors: {
        origin: process.env.CORS_ORIGIN,
    },
      proxy: {
        '/api': {
            target: 'https://homebranch-dev.hydraux-homelab.com',
            changeOrigin: true,
            secure: false,
        },
          '/auth': {
            target: 'https://homebranch-dev.hydraux-homelab.com',
            changeOrigin: true,
            secure: false
          }
      }
  }
});
