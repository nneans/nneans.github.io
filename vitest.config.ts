import { defineConfig } from "vitest/config";

const domTests = [
  "src/apps/apps.test.ts",
  "src/home.test.ts",
  "src/os/desktopCalendar.test.ts",
  "src/os/hitCounter.test.ts",
  "src/os/osIntegration.test.ts",
  "src/os/windowManager.test.ts",
];

export default defineConfig({
  test: {
    projects: [
      { test: { name: "dom", include: domTests, environment: "happy-dom" } },
      { test: { name: "node", include: ["src/**/*.test.ts"], exclude: domTests, environment: "node" } },
    ],
  },
});
