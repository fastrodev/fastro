import { useEffect, useState } from "preact/hooks";

const useFetch = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (url) {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          const result: T = await response.json();
          setData(result);
        }
      } catch (err) {
        console.log(err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, setLoading, error };
};

export default useFetch;
