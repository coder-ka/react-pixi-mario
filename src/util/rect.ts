import { useState } from "react";
import { Vector } from "./vector";

export type Rect = {
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly bottom: number;
  readonly width: number;
  readonly height: number;
} & Vector;

export function useRect(part: Partial<Rect>) {
  return useState<Rect>(normalize(part));
}

export function useRects(parts: Partial<Rect>[]) {
  return useState<Rect[]>(parts.map(normalize));
}

export function setLeft(left: number, rect: Rect) {
  return {
    ...rect,
    left,
    x: left,
    right: left + rect.width,
  };
}
export function setRight(right: number, rect: Rect) {
  const left = right - rect.width;
  return {
    ...rect,
    right,
    left,
    x: left,
  };
}
export function setTop(top: number, rect: Rect) {
  return {
    ...rect,
    top,
    bottom: top + rect.height,
    y: top,
  };
}
export function setBottom(bottom: number, rect: Rect) {
  const top = bottom - rect.height;
  return {
    ...rect,
    bottom,
    top: top,
    y: top,
  };
}
export function setWidth(width: number, rect: Rect) {
  return {
    ...rect,
    width,
    right: rect.left + width,
  };
}
export function setHeight(height: number, rect: Rect) {
  return {
    ...rect,
    height,
    bottom: rect.top + height,
  };
}

function normalize(part: Partial<Rect>): Rect {
  return {
    left:
      part.left !== undefined
        ? part.left
        : part.right !== undefined && part.width !== undefined
        ? part.right - part.width
        : 0,
    right:
      part.right !== undefined
        ? part.right
        : part.left !== undefined && part.width !== undefined
        ? part.left + part.width
        : 0,
    top:
      part.top !== undefined
        ? part.top
        : part.bottom !== undefined && part.height !== undefined
        ? part.bottom - part.height
        : 0,
    bottom:
      part.bottom !== undefined
        ? part.bottom
        : part.top !== undefined && part.height !== undefined
        ? part.top + part.height
        : 0,
    width:
      part.width !== undefined
        ? part.width
        : part.left !== undefined && part.right !== undefined
        ? Math.abs(part.right - part.left)
        : 0,
    height:
      part.height !== undefined
        ? part.height
        : part.top !== undefined && part.bottom !== undefined
        ? Math.abs(part.bottom - part.top)
        : 0,
    x:
      part.left !== undefined
        ? part.left
        : part.right !== undefined && part.width !== undefined
        ? part.right - part.width
        : 0,
    y:
      part.top !== undefined
        ? part.top
        : part.bottom !== undefined && part.height !== undefined
        ? part.bottom - part.height
        : 0,
  };
}
