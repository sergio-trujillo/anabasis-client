import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Port 5174 is offset +1 from Praxema's 5173 so both apps run together.
// Matches Praxema's client architecture (see ../Praxema/praxema-client):
//   - `@`        → `./src`
//   - `@server`  → `../anabasis-server/src`  (consistent with tsconfig.app.json)
//   - proxy `/trpc` → `http://localhost:3001`  so the client uses relative
//                     URLs and no CORS is needed in dev.
//
// The `@server` alias is used **only for type imports** (`import type { AppRouter }`)
// which Vite/esbuild erase at build time. We still register it here so that
// tsconfig and vite stay consistent — the defensive "don't register it so
// accidental value imports fail at runtime" approach we originally tried
// diverged from Praxema and created a footgun (type passes, runtime fails).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@server": path.resolve(import.meta.dirname, "../anabasis-server/src"),
    },
  },
  server: {
    port: 5174,
    strictPort: true,
    proxy: {
      "/trpc": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
