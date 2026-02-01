import path from "node:path";
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { Log, LogLevel, Miniflare } from "miniflare";

import { REPO_ROOT, TEST_HOST, TEST_PORT } from "./consts";

// Global miniflare instance
export let globalWorker: Miniflare | undefined;

export default async function (): Promise<void> {
  spawnSync("npx", ["wrangler", "build"], {
    cwd: REPO_ROOT,
    stdio: "inherit",
  });

  globalWorker = new Miniflare({
    // Actually bind to localhost
    host: TEST_HOST,
    port: TEST_PORT,
    modules: [
      {
        type: "ESModule",
        path: "index.js",
        contents: await fs.promises.readFile(
          path.join(REPO_ROOT, "server/build/index.js")
        ),
      },
      {
        type: "CompiledWasm",
        path: "index_bg.wasm",
        contents: await fs.promises.readFile(
          path.join(REPO_ROOT, "server/build/index_bg.wasm")
        ),
      },
    ],
    // Enable worker engine logs
    // verbose: true,
    log: new Log(LogLevel.VERBOSE),
    logRequests: true,
    assets: {
      directory: path.join(REPO_ROOT, "ui/dist"),
      routerConfig: {
        has_user_worker: true,
      },
    },
    compatibilityFlags: ["streams_enable_constructors"],
  });
  await globalWorker.ready;
}
