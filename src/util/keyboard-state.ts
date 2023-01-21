import { useEffect, useRef } from "react";

type KeyboardState = {
  [code: KeyboardEvent["code"]]: { pressed: boolean };
};

export function useKeyboardState({ use }: { use: string[] }) {
  const initialState: KeyboardState = {};
  for (const u of use) {
    initialState[u] = {
      pressed: false,
    };
  }
  const keyboardState = useRef<{
    [code: KeyboardEvent["code"]]: { pressed: boolean };
  }>(initialState);

  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (use.includes(e.code)) {
        keyboardState.current[e.code] = { pressed: true };
        e.preventDefault();
      }
    }
    function onKeyup(e: KeyboardEvent) {
      if (use.includes(e.code)) {
        keyboardState.current[e.code] = { pressed: false };
        e.preventDefault();
      }
    }
    function onBlur() {
      for (const key in keyboardState.current) {
        keyboardState.current[key] = { pressed: false };
      }
    }

    window.addEventListener("keydown", onKeydown);
    window.addEventListener("keyup", onKeyup);
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("keydown", onKeydown);
      window.removeEventListener("keyup", onKeyup);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return keyboardState;
}
