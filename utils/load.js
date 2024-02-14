async function fetchWithRetry(url, maxRetries = 3, delay = 500) {
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          attempts++;
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          throw new Error("Fetch failed");
        }
      } else {
        return response;
      }
    } catch (error) {
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  location.reload();
}
