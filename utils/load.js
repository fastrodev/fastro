async function fetchWithRetry(url, maxRetries = 3, delay = 1000) {
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          attempts++;
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          throw new Error("error");
        }
      } else {
        return response;
      }
    } catch {
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Not found");
}

const origin = new URL(window.location.origin);
