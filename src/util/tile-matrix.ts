import {
  isMovingUp,
  isMovingDown,
  isMovingLeft,
  isMovingRight,
  Movement,
} from "./movement";
import { Rect, setLeft, setTop } from "./rect";
import { Vector } from "./vector";

type Cell = Rect;
type Rows = Map<number, Cell>;
type TileMatrix = {
  unitSize: number;
  offset: Vector;
  matrix: Map<number, Rows>;
  getCell(v: Vector): Cell | undefined;

  getTopCollision(m: Movement<Rect>): Cell | undefined;
  getBottomCollision(m: Movement<Rect>): Cell | undefined;
  getLeftCollision(m: Movement<Rect>): Cell | undefined;
  getRightCollision(m: Movement<Rect>): Cell | undefined;

  getStaticTopCollision(r: Rect): Cell | undefined;
  getStaticBottomCollision(r: Rect): Cell | undefined;
  getStaticLeftCollision(r: Rect): Cell | undefined;
  getStaticRightCollision(r: Rect): Cell | undefined;
};

export function TileMatrix(
  rects: Rect[],
  size = 1,
  offset: Vector = {
    x: 0,
    y: 0,
  }
): TileMatrix {
  const matrix: TileMatrix["matrix"] = new Map();
  for (let i = 0, imax = rects.length; i < imax; i = (i + 1) | 0) {
    const rect = rects[i];
    const offsetX = Math.floor((rect.left - offset.x) / size);
    const offsetY = Math.floor((rect.top - offset.y) / size);
    const width = Math.floor(rect.width / size);
    const height = Math.floor(rect.height / size);

    for (let xi = 0; xi < width; xi = (xi + 1) | 0) {
      const rows: Rows = matrix.get(xi + offsetX) || new Map();
      for (let yi = 0; yi < height; yi = (yi + 1) | 0) {
        const cell: Cell = rows.get(yi + offsetY) || rect;
        rows.set(yi + offsetY, cell);
      }
      matrix.set(xi + offsetX, rows);
    }
  }

  return {
    matrix,
    unitSize: size,
    offset,
    getCell(v) {
      const rows = matrix.get(v.x);
      if (rows) {
        const cell = rows.get(v.y);

        if (cell) {
          return setLeft(cell.left, setTop(cell.top, cell));
        } else {
          return undefined;
        }
      } else {
        return undefined;
      }
    },
    getTopCollision(move) {
      if (!isMovingUp(move)) return undefined;
      const xAxisCollision =
        (isMovingLeft(move) && this.getStaticLeftCollision(move.to)) ||
        (isMovingRight(move) && this.getStaticRightCollision(move.to));

      return xAxisCollision
        ? this.getStaticTopCollision(setLeft(move.from.left, move.to))
        : this.getStaticTopCollision(move.to);
    },
    getBottomCollision(move) {
      if (!isMovingDown(move)) return undefined;
      const xAxisCollision =
        (isMovingLeft(move) && this.getStaticLeftCollision(move.to)) ||
        (isMovingRight(move) && this.getStaticRightCollision(move.to));

      return xAxisCollision
        ? this.getStaticBottomCollision(setLeft(move.from.left, move.to))
        : this.getStaticBottomCollision(move.to);
    },
    getLeftCollision(move) {
      if (!isMovingLeft(move)) return undefined;
      const yAxisCollision =
        (isMovingUp(move) && this.getStaticTopCollision(move.to)) ||
        (isMovingDown(move) && this.getStaticBottomCollision(move.to));

      return yAxisCollision
        ? this.getStaticLeftCollision(setTop(move.from.top, move.to))
        : this.getStaticLeftCollision(move.to);
    },
    getRightCollision(move) {
      if (!isMovingRight(move)) return undefined;
      const yAxisCollision =
        (isMovingUp(move) && this.getStaticTopCollision(move.to)) ||
        (isMovingDown(move) && this.getStaticBottomCollision(move.to));

      return yAxisCollision
        ? this.getStaticRightCollision(setTop(move.from.top, move.to))
        : this.getStaticRightCollision(move.to);
    },
    getStaticTopCollision(rect: Rect) {
      return (
        this.getCell({
          x: Math.floor((rect.left - this.offset.x) / this.unitSize),
          y: Math.floor((rect.top - this.offset.y) / this.unitSize),
        }) ||
        this.getCell({
          x: Math.floor((rect.right - this.offset.x) / this.unitSize),
          y: Math.floor((rect.top - this.offset.y) / this.unitSize),
        })
      );
    },
    getStaticBottomCollision(rect: Rect) {
      return (
        this.getCell({
          x: Math.floor((rect.left - this.offset.x) / this.unitSize),
          y: Math.floor((rect.bottom - this.offset.y) / this.unitSize),
        }) ||
        this.getCell({
          x: Math.floor((rect.right - this.offset.x) / this.unitSize),
          y: Math.floor((rect.bottom - this.offset.y) / this.unitSize),
        })
      );
    },
    getStaticLeftCollision(rect: Rect) {
      return (
        this.getCell({
          x: Math.floor((rect.left - this.offset.x) / this.unitSize),
          y: Math.floor((rect.top - this.offset.y) / this.unitSize),
        }) ||
        this.getCell({
          x: Math.floor((rect.left - this.offset.x) / this.unitSize),
          y: Math.floor((rect.bottom - this.offset.y) / this.unitSize),
        })
      );
    },
    getStaticRightCollision(rect: Rect) {
      return (
        this.getCell({
          x: Math.floor((rect.right - this.offset.x) / this.unitSize),
          y: Math.floor((rect.top - this.offset.y) / this.unitSize),
        }) ||
        this.getCell({
          x: Math.floor((rect.right - this.offset.x) / this.unitSize),
          y: Math.floor((rect.bottom - this.offset.y) / this.unitSize),
        })
      );
    },
  };
}
