import { Vector } from "./vector";

export type Movement<T extends Vector> = {
  from: T;
  to: T;
};

export function isMovingUp<T extends Vector>({ from, to }: Movement<T>) {
  return to.y < from.y;
}
export function isMovingDown<T extends Vector>({ from, to }: Movement<T>) {
  return to.y > from.y;
}
export function isMovingLeft<T extends Vector>({ from, to }: Movement<T>) {
  return to.x < from.x;
}
export function isMovingRight<T extends Vector>({ from, to }: Movement<T>) {
  return to.x > from.x;
}
