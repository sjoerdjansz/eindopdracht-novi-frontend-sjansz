import { useCallback, useEffect, useState } from "react";
import axios from "axios";

function useFetch(config) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, toggleError] = useState(false);
  // Dit is zodat we de data-fetch opnieuw kunnen triggeren na update van de info
  const [reloadTrigger, setReloadTrigger] = useState(0);

  useEffect(() => {
    async function sendRequest() {
      setIsLoading(true);
      toggleError(false);

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
        console.log(response.data);
      } catch (error) {
        toggleError(true);
        console.error("Error in custom hook", error);
      } finally {
        setIsLoading(false);
      }
    }

    void sendRequest();
  }, [config, reloadTrigger]);

  const reload = useCallback(() => {
    setReloadTrigger((prev) => prev + 1);
  }, []);

  return {
    data,
    error,
    isLoading,
    reload,
  };
}

export default useFetch;
