function fetchWithRetry(url) {
  fetch(url)
    .then((response) => response.text())
    .then((scriptText) => {
      if (scriptText === "Not Found") {
        return setTimeout(() => {
          fetchWithRetry(url);
        }, 500);
      }
      const script = document.createElement("script");
      script.textContent = scriptText;
      document.body.appendChild(script);
    });
}

const origin = new URL(window.location.origin),
  url = origin + "js/${name}.${this.#server.getNonce()}.js";
fetchWithRetry(url);
