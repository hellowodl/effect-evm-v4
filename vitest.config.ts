import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: ["./evm/vitest.config.ts"],
  },
});
