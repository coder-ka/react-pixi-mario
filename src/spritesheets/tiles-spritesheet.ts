import { useSpritesheet } from "../util/spritesheet";
import tilesImageUrl from "../assets/tiles.png";

export function useTilesSpritesheet() {
  return useSpritesheet(tilesImageUrl, {
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
}
