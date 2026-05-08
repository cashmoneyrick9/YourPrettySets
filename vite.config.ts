/// <reference types="vitest/config" />

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import type { UserConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    exclude: ["**/node_modules/**", "**/dist/**", "**/.claude/**"],
    setupFiles: "./src/test/setup.ts",
    globals: false
  }
} as UserConfig);
