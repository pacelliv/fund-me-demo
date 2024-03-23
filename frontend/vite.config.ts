import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const outDir = path.resolve(__dirname, "out");

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    },
    build: {
        outDir,
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, "index.html"),
                home: path.resolve(__dirname, "src/pages/home/index.html"),
                donations: path.resolve(__dirname, "src/pages/donations/index.html")
            }
        }
    }
});
