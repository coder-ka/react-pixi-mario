import { useState } from "react";
import { Stage } from "@inlet/react-pixi";

import { Mario } from "./Mario";
import { Background } from "./Background";

export default function App() {
  const [width] = useState(16 * 25);
  const [height] = useState(16 * 15);

  return (
    <div className="flex justify-center items-center w-full h-screen bg-yellow-400">
      <Stage width={width} height={height}>
        <Background></Background>
        <Mario></Mario>
      </Stage>
    </div>
  );
}
