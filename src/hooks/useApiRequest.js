import { useCallback, useState } from "react";
import axios from "axios";

export function useApiRequest() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (config) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios({
        ...config,
        headers: {
          "novi-education-project-id": import.meta.env.VITE_API_KEY,
          "Content-Type": "application/json",
          ...(config.headers || {}),
        },
      });
      setData(response.data);
      return response.data;
    } catch (error) {
      setError(error);
      console.error("Error in custom hook", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, error, isLoading, sendRequest };
}
