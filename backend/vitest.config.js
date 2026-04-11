import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.test.js"],
    fileParallelism: false,
    hookTimeout: 120_000,
    testTimeout: 30_000,
  },
});
