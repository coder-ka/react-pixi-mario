import { useSpritesheet } from "../util/spritesheet";
import charactersImageUrl from "../assets/characters.png";

export function useCharactersSpritesheet() {
  return useSpritesheet(charactersImageUrl, {
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
}
