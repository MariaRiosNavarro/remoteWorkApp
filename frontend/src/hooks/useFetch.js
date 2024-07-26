import { useState, useCallback } from "react";

const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (url, method, body = null, customHeaders = {}) => {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const defaultHeaders = {
        "Content-Type": "application/json",
        ...customHeaders,
      };

      const options = {
        method,
        headers: defaultHeaders,
        credentials: "include",
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${baseUrl}${url}`, options);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || response.statusText);
        }

        setLoading(false);
        console.log(response.ok, data);
        return { ok: true, data };
      } catch (err) {
        setLoading(false);
        setError(err.message);
        console.error("Fetch error:", err);
        return { ok: false, error: err.message };
      }
    },
    []
  );

  return { fetchData, loading, error };
};

export default useFetch;
