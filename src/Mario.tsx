import { useSpritesheet } from "./hooks/useSpritesheet";
import charactersImageUrl from "./assets/characters.png";
import { Sprite, useTick } from "@inlet/react-pixi";
import { useState } from "react";

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
    y: -10,
  });
  const [position, setPosition] = useState({
    x: 40,
    y: 16 * 12,
  });

  useTick((delta) => {
    setPosition({
      x: position.x + velocity.x * delta,
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
