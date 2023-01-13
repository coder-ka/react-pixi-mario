import { Movement } from "./movement";
import { Rect } from "./rect";

export interface CollisionDetector {
  getTopCollision(m: Movement<Rect>): Rect | undefined;
  getBottomCollision(m: Movement<Rect>): Rect | undefined;
  getLeftCollision(m: Movement<Rect>): Rect | undefined;
  getRightCollision(m: Movement<Rect>): Rect | undefined;

  getStaticTopCollision(r: Rect): Rect | undefined;
  getStaticBottomCollision(r: Rect): Rect | undefined;
  getStaticLeftCollision(r: Rect): Rect | undefined;
  getStaticRightCollision(r: Rect): Rect | undefined;
}
