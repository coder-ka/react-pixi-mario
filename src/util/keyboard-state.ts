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
    window.addEventListener("keydown", (e) => {
      if (use.includes(e.code)) {
        keyboardState.current[e.code] = { pressed: true };
        e.preventDefault();
      }
    });
    window.addEventListener("keyup", (e) => {
      if (use.includes(e.code)) {
        keyboardState.current[e.code] = { pressed: false };
        e.preventDefault();
      }
    });
  }, []);

  return keyboardState;
}
