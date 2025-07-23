import { useCallback, useState } from "react";
import axios from "axios";

export function useApiRequest() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const doRequest = useCallback(async (config) => {
    setIsLoading(true);
    setError(null);

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const response = await axios({
        ...config,
        headers: {
          "novi-education-project-id": import.meta.env.VITE_API_KEY,
          "Content-Type": "application/json",
          ...(config.headers || {}),
        },
        signal,
      });
      setData(response.data);
      return response.data;
    } catch (error) {
      setError(error);
      if (axios.isCancel(error)) {
        console.log(`Request has been cancelled: ${error}`);
      } else {
        console.error(`Error in custom hook: ${error}`);
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, error, isLoading, doRequest };
}
