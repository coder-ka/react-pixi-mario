import { BaseTexture, ISpritesheetData, Spritesheet } from "pixi.js";
import { useEffect, useState } from "react";

export function useSpritesheet(url: string, sheetData: ISpritesheetData) {
  const [spritesheet, setSpritesheet] = useState<Spritesheet>();

  useEffect(() => {
    const spritesheet = new Spritesheet(BaseTexture.from(url), sheetData);

    spritesheet.parse().then(() => {
      setSpritesheet(spritesheet);
    });
  }, []);

  return [spritesheet];
}
