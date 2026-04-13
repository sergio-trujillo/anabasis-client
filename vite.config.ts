import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@server": path.resolve(__dirname, "../anabasis-server/src"),
    },
  },
  server: {
    host: true,
    port: 5174,
    strictPort: true,
    proxy: {
      // Anabasis server mounts tRPC at /trpc (see anabasis-server/src/index.ts).
      // Client requests go to /api/trpc (matches Praxema convention) and we
      // rewrite /api out before forwarding. Keeps the client URL stable
      // regardless of server mount path.
      "/api/trpc": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
