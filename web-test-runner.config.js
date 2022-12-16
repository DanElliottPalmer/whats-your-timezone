import { esbuildPlugin } from "@web/dev-server-esbuild";
import { playwrightLauncher } from "@web/test-runner-playwright";

export default {
  browsers: [
    playwrightLauncher({ product: "chromium" }),
    playwrightLauncher({ product: "webkit" }),
    playwrightLauncher({ product: "firefox" }),
  ],
  files: ["src/**/*.test.ts", "src/**/*.spec.ts"],
  nodeResolve: true,
  plugins: [esbuildPlugin({ ts: true })],
};
