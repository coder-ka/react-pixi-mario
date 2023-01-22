import { useEffect } from "react";

export function useKeydownEvent(
  key: KeyboardEvent["key"],
  callback: (e: KeyboardEvent) => void,
  deps: unknown[] = []
) {
  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (e.key === key) {
        callback(e);
        e.preventDefault();
      }
    }

    window.addEventListener("keydown", onKeydown);

    return () => window.removeEventListener("keydown", onKeydown);
  }, deps);
}
