import { useEffect, useMemo, useState } from "react";
import { Container, Sprite, Stage, TilingSprite } from "@inlet/react-pixi";

import { useTilesSpritesheet } from "./spritesheets/tiles-spritesheet";
import { useCharactersSpritesheet } from "./spritesheets/characters-spritesheet";
import {
  setBottom,
  setLeft,
  setRight,
  setTop,
  useRect,
  useRects,
} from "./util/rect";
import { useKeyboardState } from "./util/keyboard-state";
import { useKeydownEvent } from "./util/keydown-event";
import { useVector } from "./util/vector";
import { WithTick } from "./util/WithTick";
import { TileMatrix } from "./util/tile-matrix";
import { debug } from "./util/debug";

export default function App() {
  const tileSize = 16;
  const [width] = useState(tileSize * 25);
  const [height] = useState(tileSize * 15);

  /**
   * background
   */
  const [tilesSpritesheet] = useTilesSpritesheet();
  const [sky] = useRect({
    left: 0,
    top: 0,
    width,
    height,
  });

  const [ground] = useRect({
    left: 0,
    top: tileSize * 13 + 8,
    width,
    height: tileSize * 2,
  });

  const [grounds] = useRects([
    {
      left: tileSize * 0,
      top: tileSize * 3 + 8,
      width: tileSize * 3,
      height: tileSize * 1,
    },
    {
      left: tileSize * 5,
      top: tileSize * 5 + 8,
      width: tileSize * 3,
      height: tileSize * 1,
    },
    {
      left: tileSize * 10,
      top: tileSize * 7 + 8,
      width: tileSize * 3,
      height: tileSize * 1,
    },
    {
      left: tileSize * 15,
      top: tileSize * 9 + 8,
      width: tileSize * 3,
      height: tileSize * 1,
    },
    {
      left: tileSize * 20,
      top: tileSize * 11 + 8,
      width: tileSize * 3,
      height: tileSize * 2,
    },
  ]);

  const groundsTileMatrix = useMemo(
    () =>
      TileMatrix([ground, ...grounds], tileSize, {
        x: 0,
        y: 8,
      }),
    [ground, grounds]
  );

  /**
   * mario
   */
  const [charactersSpritesheet] = useCharactersSpritesheet();
  const [mario, setMario] = useRect({
    left: 20,
    bottom: ground.top - 1,
    height: 16,
    width: 14,
  });
  const [gravity] = useState(0.5);
  const [marioVelocity, setMarioVelocity] = useVector({
    x: 2,
    y: 0,
  });
  const [jumping, setJumping] = useState(false);
  const keyboardState = useKeyboardState({
    use: ["ArrowLeft", "ArrowRight"],
  });
  useKeydownEvent(
    "Space",
    () => {
      if (!jumping) {
        setMarioVelocity({
          ...marioVelocity,
          y: -5,
        });
        setJumping(true);
      }
    },
    [jumping]
  );

  useEffect(() => {
    debug(jumping);
  }, [jumping]);

  if (!tilesSpritesheet || !charactersSpritesheet) return null;

  return (
    <div className="flex justify-center items-center w-full h-screen bg-yellow-400">
      <Stage width={width} height={height}>
        <Container x={sky.x} y={sky.y}>
          <TilingSprite
            texture={tilesSpritesheet.textures.sky}
            {...sky}
            tilePosition={sky}
          />
        </Container>
        <Container x={ground.x} y={ground.y}>
          <TilingSprite
            texture={tilesSpritesheet.textures.ground}
            width={ground.width}
            height={ground.height}
            tilePosition={ground}
          />
        </Container>

        {grounds.map((ground, i) => (
          <Container key={i} x={ground.x} y={ground.y}>
            <TilingSprite
              texture={tilesSpritesheet.textures.ground}
              width={ground.width}
              height={ground.height}
              tilePosition={ground}
            />
          </Container>
        ))}

        <WithTick
          onTick={(delta) => {
            const direction = keyboardState.current["ArrowRight"].pressed
              ? 1
              : keyboardState.current["ArrowLeft"].pressed
              ? -1
              : 0;

            let nextMario = setBottom(
              Math.floor(
                mario.bottom + Math.min(marioVelocity.y * delta, tileSize)
              ),
              setLeft(
                Math.floor(mario.left + marioVelocity.x * direction * delta),
                mario
              )
            );

            let nextMarioVelocity = {
              ...marioVelocity,
              y: marioVelocity.y + gravity,
            };

            const topCollision = groundsTileMatrix.getTopCollision({
              from: mario,
              to: nextMario,
            });

            if (topCollision) {
              nextMario = setTop(topCollision.bottom + 1, nextMario);
              nextMarioVelocity.y = 0;
            }

            const bottomCollision = groundsTileMatrix.getBottomCollision({
              from: mario,
              to: nextMario,
            });

            if (bottomCollision) {
              nextMario = setBottom(bottomCollision.top - 1, nextMario);
              nextMarioVelocity.y = 0;
              setJumping(false);
            }

            const leftCollision = groundsTileMatrix.getLeftCollision({
              from: mario,
              to: nextMario,
            });
            if (leftCollision) {
              nextMario = setLeft(leftCollision.right + 1, nextMario);
            }

            const rightCollision = groundsTileMatrix.getRightCollision({
              from: mario,
              to: nextMario,
            });
            if (rightCollision) {
              nextMario = setRight(rightCollision.left - 1, nextMario);
            }

            nextMario = setLeft(Math.max(nextMario.left, 0), nextMario);
            nextMario = setRight(Math.min(nextMario.right, width), nextMario);

            setMario(nextMario);
            setMarioVelocity(nextMarioVelocity);
          }}
        >
          <Sprite
            texture={charactersSpritesheet.textures.idle}
            x={mario.x}
            y={mario.y}
          ></Sprite>
        </WithTick>
      </Stage>
    </div>
  );
}
