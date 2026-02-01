/**
 * Main entrypoint that loads the WASM module and various
 * scripts with progress indication.
 */

async function fetchMainModule(
  progress: HTMLPreElement,
  progressText: HTMLSpanElement
): Promise<Response> {
  const response = await fetch(
    new URL("../pkg/index_bg.wasm", import.meta.url),
    {
      method: "GET",
      credentials: "include",
      mode: "no-cors",
    }
  );
  if (!response.ok) {
    throw new Error("WASM fetch failed");
  }

  const maxDim = Math.max(window.innerWidth, window.innerHeight);
  const expectedSize = 1_700_000; // 1.7 MB

  // Cloning the response so that it can be read again later.
  const reader = response.clone().body!.getReader();
  let loaded = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    loaded += value.byteLength;
    progressText.innerText =
      loaded < 1000
        ? `LOADED ${loaded} B`
        : `LOADED ${(loaded / 1000).toFixed(2)} KB`;
  }

  document.documentElement.style.backgroundSize = "20px 20px";
  progress.remove();

  return response;
}

async function init(): Promise<void> {
  const progress = document.createElement("pre");
  progress.id = "loading-progress";
  progress.style.position = "fixed";
  progress.style.inset = "0";
  progress.style.display = "grid";
  progress.style.placeItems = "center";
  progress.style.backgroundColor = "transparent";

  const progressText = document.createElement("span");
  progressText.innerText = "FETCHING";
  progressText.style.background = "white";
  progressText.style.fontFamily = "monospace";

  progress.appendChild(progressText);
  document.body.appendChild(progress);

  const [wasm, aux] = await Promise.all([
    fetchMainModule(progress, progressText),
    import("./aux"),
  ]);

  await aux.default(wasm);

  setTimeout(() => {
    document.documentElement.classList.add("loaded");
  }, 50);
}

window.onload = init;
