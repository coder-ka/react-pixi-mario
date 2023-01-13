import { useState } from "react";

export type Vector = {
  x: number;
  y: number;
};

export function useVector(init: Vector) {
  return useState<Vector>(init);
}

export function isMovingUp(from: Vector, to: Vector) {
  return to.y < from.y;
}
export function isMovingDown(from: Vector, to: Vector) {
  return to.y > from.y;
}
export function isMovingLeft(from: Vector, to: Vector) {
  return to.x < from.x;
}
export function isMovingRight(from: Vector, to: Vector) {
  return to.x > from.x;
}
