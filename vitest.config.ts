import { defineConfig } from "vitest/config";
import { VitestReporter } from "tdd-guard-vitest";

export default defineConfig({
  test: {
    environment: 'jsdom',
    reporters: [
      "default",
      new VitestReporter(
        "/Users/jdg/Development/whitespace-se/docusaurus-plugin-matomo"
      ),
    ],
  },
});
