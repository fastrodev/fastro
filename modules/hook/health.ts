import { useEffect, useState } from "preact/hooks";

interface HealthStatus {
  status: string;
}

const useHealthCheck = () => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthStatus = async () => {
    try {
      const response = await fetch("/health");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: HealthStatus = await response.json();
      setHealthStatus(data);
      setError(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    }
  };

  useEffect(() => {
    fetchHealthStatus();

    const intervalId = setInterval(fetchHealthStatus, 30 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return { healthStatus, error };
};

export default useHealthCheck;
