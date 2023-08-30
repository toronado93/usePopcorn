import { useEffect, useState } from "react";
export function useMovies(query, apikey, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Data Fetching
  useEffect(() => {
    // Nice way to use callback function in custom hook
    callback?.();

    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setLoading(true);
        setError("");
        const result = await fetch(
          `http://www.omdbapi.com/?apikey=${apikey}&s=${query}`,
          { signal: controller.signal }
        );
        const data = await result.json();
        // console.log(data);

        if (data.Response === "False" && data.Error === "Movie not found!") {
          //When an error is throwed js no longer look rest of the codes.
          //This information is important the manage our state methods.
          // If we have a logic throw error or loading component the best the use
          // finall block
          setError("Movie not Found");
          throw new Error(data.Error);
        }
        setMovies(data.Search);
        setLoading(false);
      } catch (err) {
        // console.error(err.message);
      } finally {
        setLoading(false);
      }

      if (!query?.length) {
        setMovies([]);
        setError("");
        return;
      }
    }
    fetchMovies();

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return { movies, isLoading, error };
}
