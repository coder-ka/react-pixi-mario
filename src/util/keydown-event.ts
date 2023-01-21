import { useEffect } from "react";

export function useKeydownEvent(
  code: KeyboardEvent["code"],
  callback: (e: KeyboardEvent) => void,
  deps: unknown[] = []
) {
  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (e.code === code) {
        callback(e);
        e.preventDefault();
      }
    }

    window.addEventListener("keydown", onKeydown);

    return () => window.removeEventListener("keydown", onKeydown);
  }, deps);
}
