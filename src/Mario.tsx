import { useSpritesheet } from "./hooks/useSpritesheet";
import charactersImageUrl from "./assets/characters.png";
import { Sprite, useTick } from "@inlet/react-pixi";
import { useEffect, useState } from "react";
import { useKeyboardState } from "./hooks/useKeyboardState";

export function Mario() {
  const [charactersSpritesheet] = useSpritesheet(charactersImageUrl, {
    frames: {
      idle: {
        frame: { x: 276, y: 44, w: 16, h: 16 },
        sourceSize: { w: 16, h: 16 },
        spriteSourceSize: { x: 0, y: 0 },
      },
    },
    meta: {
      scale: "1",
    },
  });

  const [gravity] = useState(0.5);
  const [velocity, setVelocity] = useState({
    x: 2,
    y: 0,
  });
  const [position, setPosition] = useState({
    x: 40,
    y: 16 * 12,
  });

  const keyboardState = useKeyboardState({
    use: ["ArrowLeft", "ArrowRight"],
  });

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        setVelocity({
          ...velocity,
          y: -5,
        });

        e.preventDefault();
      }
    });
  }, []);

  useTick((delta) => {
    const dir = keyboardState.current["ArrowLeft"].pressed
      ? -1
      : keyboardState.current["ArrowRight"].pressed
      ? 1
      : 0;
    setPosition({
      x: position.x + velocity.x * dir * delta,
      y: position.y + velocity.y * delta,
    });

    setVelocity({
      ...velocity,
      y: velocity.y + gravity,
    });
  });

  return charactersSpritesheet ? (
    <Sprite
      texture={charactersSpritesheet.textures.idle}
      x={position.x}
      y={position.y}
    ></Sprite>
  ) : null;
}
