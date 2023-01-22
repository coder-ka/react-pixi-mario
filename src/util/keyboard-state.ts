import { useEffect, useState } from "react";
import { Map } from "immutable";

type Key = KeyboardEvent["key"];
type KeyState = { pressed: boolean };

export function useKeyboardState<UseKeyArray extends Key[]>({
  use,
}: {
  use: UseKeyArray;
}) {
  type UseKeys = UseKeyArray[number];
  const initialState = Map(
    use.reduce(
      (state, key) =>
        state.set(key, {
          pressed: false,
        }),
      Map<UseKeys, KeyState>({})
    )
  );

  const [keyboardState, setKeyboardState] = useState(initialState);

  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (use.includes(e.key)) {
        setKeyboardState(keyboardState.set(e.key, { pressed: true }));
        e.preventDefault();
      }
    }
    function onKeyup(e: KeyboardEvent) {
      if (use.includes(e.key)) {
        setKeyboardState(keyboardState.set(e.key, { pressed: false }));
        e.preventDefault();
      }
    }
    function onBlur() {
      setKeyboardState(
        keyboardState.map(() => ({
          pressed: false,
        }))
      );
    }

    window.addEventListener("keydown", onKeydown);
    window.addEventListener("keyup", onKeyup);
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("keydown", onKeydown);
      window.removeEventListener("keyup", onKeyup);
      window.removeEventListener("blur", onBlur);
    };
  }, [keyboardState]);

  return [keyboardState] as const;
}
