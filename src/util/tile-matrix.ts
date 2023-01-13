import { CollisionDetector } from "./collision-detection";
import {
  isMovingDown,
  isMovingLeft,
  isMovingRight,
  isMovingUp,
  Rect,
  setLeft,
  setTop,
} from "./rect";
import {
  // isMovingDown,
  // isMovingLeft,
  // isMovingRight,
  // isMovingUp,
  Vector,
} from "./vector";

type Cell = Rect;
type Rows = Map<number, Cell>;
type TileMatrix = {
  unitSize: number;
  offset: Vector;
  matrix: Map<number, Rows>;
  getCell(v: Vector): Cell | undefined;
} & CollisionDetector;

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

  console.log(matrix);

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
    getTopCollision(from, to) {
      if (!isMovingUp(from, to)) return undefined;
      const xAxisCollision =
        getLeftCollision(from, to, this) || getRightCollision(from, to, this);

      return xAxisCollision
        ? getTopCollision(from, setLeft(from.left, to), this)
        : getTopCollision(from, to, this);
    },
    getBottomCollision(from, to) {
      if (!isMovingDown(from, to)) return undefined;
      const xAxisCollision =
        getLeftCollision(from, to, this) || getRightCollision(from, to, this);

      return xAxisCollision
        ? getBottomCollision(from, setLeft(from.left, to), this)
        : getBottomCollision(from, to, this);
    },
    getLeftCollision(from, to) {
      if (!isMovingLeft(from, to)) return undefined;
      const yAxisCollision =
        getTopCollision(from, to, this) || getBottomCollision(from, to, this);

      return yAxisCollision
        ? getLeftCollision(from, setTop(from.top, to), this)
        : getLeftCollision(from, to, this);
    },
    getRightCollision(from, to) {
      if (!isMovingRight(from, to)) return undefined;
      const yAxisCollision =
        getTopCollision(from, to, this) || getBottomCollision(from, to, this);

      return yAxisCollision
        ? getRightCollision(from, setTop(from.top, to), this)
        : getRightCollision(from, to, this);
    },
  };
}

function getTopCollision(from: Rect, to: Rect, tileMatrix: TileMatrix) {
  if (!isMovingUp(from, to)) return undefined;

  return (
    tileMatrix.getCell({
      x: Math.floor((to.left - tileMatrix.offset.x) / tileMatrix.unitSize),
      y: Math.floor((to.top - tileMatrix.offset.y) / tileMatrix.unitSize),
    }) ||
    tileMatrix.getCell({
      x: Math.floor((to.right - tileMatrix.offset.x) / tileMatrix.unitSize),
      y: Math.floor((to.top - tileMatrix.offset.y) / tileMatrix.unitSize),
    })
  );
}

function getBottomCollision(from: Rect, to: Rect, tileMatrix: TileMatrix) {
  if (!isMovingDown(from, to)) return undefined;

  return (
    tileMatrix.getCell({
      x: Math.floor((to.left - tileMatrix.offset.x) / tileMatrix.unitSize),
      y: Math.floor((to.bottom - tileMatrix.offset.y) / tileMatrix.unitSize),
    }) ||
    tileMatrix.getCell({
      x: Math.floor((to.right - tileMatrix.offset.x) / tileMatrix.unitSize),
      y: Math.floor((to.bottom - tileMatrix.offset.y) / tileMatrix.unitSize),
    })
  );
}

function getLeftCollision(from: Rect, to: Rect, tileMatrix: TileMatrix) {
  if (!isMovingLeft(from, to)) return undefined;
  return (
    tileMatrix.getCell({
      x: Math.floor((to.left - tileMatrix.offset.x) / tileMatrix.unitSize),
      y: Math.floor((to.top - tileMatrix.offset.y) / tileMatrix.unitSize),
    }) ||
    tileMatrix.getCell({
      x: Math.floor((to.left - tileMatrix.offset.x) / tileMatrix.unitSize),
      y: Math.floor((to.bottom - tileMatrix.offset.y) / tileMatrix.unitSize),
    })
  );
}
function getRightCollision(from: Rect, to: Rect, tileMatrix: TileMatrix) {
  if (!isMovingRight(from, to)) return undefined;

  return (
    tileMatrix.getCell({
      x: Math.floor((to.right - tileMatrix.offset.x) / tileMatrix.unitSize),
      y: Math.floor((to.top - tileMatrix.offset.y) / tileMatrix.unitSize),
    }) ||
    tileMatrix.getCell({
      x: Math.floor((to.right - tileMatrix.offset.x) / tileMatrix.unitSize),
      y: Math.floor((to.bottom - tileMatrix.offset.y) / tileMatrix.unitSize),
    })
  );
}
