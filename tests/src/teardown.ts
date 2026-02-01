import { globalWorker } from "./setup";

export default async function (): Promise<void> {
  if (globalWorker) {
    await globalWorker.dispose();
  }
}
