import { useTick } from "@inlet/react-pixi";
import { ReactNode } from "react";

export function WithTick({
  onTick,
  children,
}: {
  onTick?: (delta: number) => void;
  children: ReactNode;
}) {
  useTick((delta) => {
    if (onTick) {
      onTick(delta);
    }
  });

  return <>{children}</>;
}
