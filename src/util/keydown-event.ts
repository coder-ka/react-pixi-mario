import { useEffect } from "react";

export function useKeydownEvent(
  code: KeyboardEvent["code"],
  callback: (e: KeyboardEvent) => void
) {
  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.code === code) {
        callback(e);
        e.preventDefault();
      }
    });
  }, []);
}
