import { useEffect, useState } from "react";
import { Stage, Sprite, Container, TilingSprite } from "@inlet/react-pixi";

import tilesImageUrl from "./assets/tiles.png";
import { BaseTexture, Spritesheet } from "pixi.js";

export default function App() {
  const [width] = useState(16 * 25);
  const [height] = useState(16 * 15);

  const [tilesSpritesheet, setTilesSpritesheet] = useState<Spritesheet>();

  useEffect(() => {
    const spritesheet = new Spritesheet(BaseTexture.from(tilesImageUrl), {
      frames: {
        sky: {
          frame: { x: 48, y: 16 * 23, w: 16, h: 16 },
          sourceSize: { w: 16, h: 16 },
          spriteSourceSize: { x: 0, y: 0 },
        },
        ground: {
          frame: { x: 0, y: 0, w: 16, h: 16 },
          sourceSize: { w: 16, h: 16 },
          spriteSourceSize: { x: 0, y: 0 },
        },
      },
      meta: {
        scale: "1",
      },
    });

    spritesheet.parse().then(() => {
      setTilesSpritesheet(spritesheet);
    });
  }, []);

  return (
    <div className="flex justify-center items-center w-full h-screen bg-yellow-400">
      <Stage width={width} height={height}>
        {tilesSpritesheet ? (
          <>
            <TilingSprite
              texture={tilesSpritesheet.textures.sky}
              width={16 * 25}
              height={16 * 15}
              tilePosition={{ x: 0, y: 0 }}
            />
            <Container x={0} y={16 * 13}>
              <TilingSprite
                texture={tilesSpritesheet.textures.ground}
                width={16 * 25}
                height={16 * 2}
                tilePosition={{ x: 0, y: 0 }}
              />
            </Container>
          </>
        ) : null}
      </Stage>
    </div>
  );
}
