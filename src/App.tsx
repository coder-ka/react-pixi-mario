import { useState } from "react";
import { Stage, Sprite } from "@inlet/react-pixi";

import bunnyPng from "./assets/bunny.png";

export default function App() {
  const [width] = useState(16 * 40);
  const [height] = useState(16 * 25);

  return (
    <div className="flex justify-center items-center w-full h-screen bg-yellow-400">
      <Stage width={width} height={height}>
        <Sprite image={bunnyPng} x={width / 2 - 20} y={height - 40} />
      </Stage>
    </div>
  );
}
