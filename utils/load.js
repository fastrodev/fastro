async function fetchWithRetry(url) {
  try {
    await fetch(url);
  } catch (error) {
    location.reload();
  }
}

const origin = new URL(window.location.origin),
  _url = origin + "js/${name}.${this.#server.getNonce()}.js";
