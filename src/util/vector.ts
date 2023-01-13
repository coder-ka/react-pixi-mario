import { useState } from "react";

export type Vector = {
  x: number;
  y: number;
};

export function useVector(init: Vector) {
  return useState<Vector>(init);
}
