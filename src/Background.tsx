import { Container, TilingSprite } from "@inlet/react-pixi";

import tilesImageUrl from "./assets/tiles.png";
import { useSpritesheet } from "./hooks/useSpritesheet";

export function Background() {
  const [tilesSpritesheet] = useSpritesheet(tilesImageUrl, {
    frames: {
      sky: {
        frame: { x: 16 * 3, y: 16 * 23, w: 16, h: 16 },
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

  return tilesSpritesheet ? (
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
  ) : null;
}
