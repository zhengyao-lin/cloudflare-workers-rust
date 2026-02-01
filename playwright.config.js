import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/src/tests",
  globalSetup: "./tests/src/setup.ts",
  globalTeardown: "./tests/src/teardown.ts",
});
