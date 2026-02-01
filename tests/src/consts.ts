import path from "node:path";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
);

export const TEST_HOST = "localhost";
export const TEST_PORT = 5566;
export const BASE_URL = `http://${TEST_HOST}:${TEST_PORT}`;
