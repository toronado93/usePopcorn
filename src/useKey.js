import { useEffect } from "react";

export function useKeyCustomizedHook(key, action) {
  useEffect(() => {
    // Destructure of props
    const { onCloseMovie } = action;

    const eventListenerBody = (e) => {
      if (e.code === key) {
        onCloseMovie();
      }
    };

    // Creating Event listener
    document.addEventListener("keydown", (e) => {
      eventListenerBody(e);
    });

    // Destroy event listener with Clean-up Function
    return () => {
      document.removeEventListener("keydown", (e) => {
        eventListenerBody(e);
      });
    };
  }, [action, action.onCloseMovie, key]);
}
