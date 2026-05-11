import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const clerkExpressStub = fileURLToPath(
  new URL("./test/clerk-express-stub.js", import.meta.url),
);

export default defineConfig({
  resolve: {
    alias: {
      "@clerk/express": clerkExpressStub,
    },
  },
  test: {
    environment: "node",
    include: ["test/**/*.test.js"],
    fileParallelism: false,
    hookTimeout: 120_000,
    testTimeout: 30_000,
  },
});
