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
import { isMovingLeft, isMovingRight } from "./util/movement";

export default function App() {
  const tileSize = 16;

  // screen
  const [screenWidth] = useState(tileSize * 25);
  const [screenHeight] = useState(tileSize * 15);

  // camera
  const minimumXRest = tileSize * 4;

  // world
  const [worldWidth] = useState(tileSize * 25 * 6);
  const [worldHeight] = useState(tileSize * 15);
  const [worldOffset, setWorldOffset] = useVector({
    x: 0,
    y: 0,
  });

  /**
   * background
   */
  const [tilesSpritesheet] = useTilesSpritesheet();
  const [sky] = useRect({
    left: 0,
    top: 0,
    width: worldWidth,
    height: worldHeight,
  });

  const [ground] = useRect({
    left: 0,
    top: tileSize * 13 + 8,
    width: worldWidth,
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
  const [keyboardState] = useKeyboardState({
    use: ["ArrowLeft", "ArrowRight"],
  });
  const direction = keyboardState.get("ArrowRight")?.pressed
    ? 1
    : keyboardState.get("ArrowLeft")?.pressed
    ? -1
    : 0;

  useKeydownEvent(
    " ",
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

  if (!tilesSpritesheet || !charactersSpritesheet) return null;

  return (
    <div className="flex justify-center items-center w-full h-screen bg-yellow-400">
      <Stage width={screenWidth} height={screenHeight}>
        <Container x={worldOffset.x} y={worldOffset.y}>
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

              const marioMove = {
                from: mario,
                to: nextMario,
              };

              const topCollision = groundsTileMatrix.getTopCollision(marioMove);

              if (topCollision) {
                nextMario = setTop(topCollision.bottom + 1, nextMario);
                nextMarioVelocity.y = 0;
              }

              const bottomCollision =
                groundsTileMatrix.getBottomCollision(marioMove);

              if (bottomCollision) {
                nextMario = setBottom(bottomCollision.top - 1, nextMario);
                nextMarioVelocity.y = 0;
                setJumping(false);
              }

              const leftCollision =
                groundsTileMatrix.getLeftCollision(marioMove);
              if (leftCollision) {
                nextMario = setLeft(leftCollision.right + 1, nextMario);
              }

              const rightCollision =
                groundsTileMatrix.getRightCollision(marioMove);
              if (rightCollision) {
                nextMario = setRight(rightCollision.left - 1, nextMario);
              }

              nextMario = setLeft(Math.max(nextMario.left, 0), nextMario);
              nextMario = setRight(
                Math.min(nextMario.right, worldWidth),
                nextMario
              );

              if (isMovingRight(marioMove)) {
                const rightRest = screenWidth - worldOffset.x - nextMario.right;
                if (rightRest < minimumXRest) {
                  setWorldOffset({
                    ...worldOffset,
                    x: Math.max(
                      worldOffset.x - (minimumXRest - rightRest),
                      worldWidth * -1 + screenWidth
                    ),
                  });
                }
              }
              if (isMovingLeft(marioMove)) {
                const leftRest = nextMario.left + worldOffset.x;
                if (leftRest < minimumXRest) {
                  setWorldOffset({
                    ...worldOffset,
                    x: Math.min(worldOffset.x + (minimumXRest - leftRest), 0),
                  });
                }
              }

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
        </Container>
      </Stage>
    </div>
  );
}
