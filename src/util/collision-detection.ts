import { Rect } from "./rect";

export interface CollisionDetector {
  getLeftCollision(from: Rect, to: Rect): Rect | undefined;
  getRightCollision(from: Rect, to: Rect): Rect | undefined;
  getTopCollision(from: Rect, to: Rect): Rect | undefined;
  getBottomCollision(from: Rect, to: Rect): Rect | undefined;
}
