import React from "react";

import { LottieShape, LottieSimpleColor } from "../../types/LottieShape";
import ShapeColor from "./ShapeColor";

type Props = {
  shape: LottieShape;
  onclick?: () => void;
  //children?: React.ReactNode;
};

const ShapeColorGradient: React.FC<Props> = ({ shape, onclick }) => {
  const gradient = shape.g;
  const keysData = gradient?.k;
  const keys = keysData?.k;
  const anim = keysData?.a === 1;

  function handleColorClick(e,idx:number) {
    e.preventDefault();
    e.stopPropagation();
    // color.k = [Math.random(), Math.random(), Math.random(), 1];
    // onclick && onclick();
  }
  if (!keys) {
    return <></>;
  }

  console.log(keys);

  if (anim) {
    return (
      <div>
        <div>animated color</div>
      </div>
    );
  }

  let colorRefs: any[] = [];
  for (let i = 0; i < keys.length / 4; i++) {
    const color = [keys[i * 4 + 1], keys[i * 4 + 2], keys[i * 4 + 3]];
    colorRefs.push({
      a: 0,
      ix: 4,
      k: color,
    });
  }

  return (
    <div>
      <div>gradient colors</div>
      <div>
        {colorRefs.map((item, i) => {
          return <ShapeColor key={i} color={item} />;
        })}
      </div>
    </div>
  );
};

//-------------------------------------------------------

function RGBA(arr: number[]) {
  const [r, g, b, a = 1] = arr;
  return `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${a})`;
}

export default ShapeColorGradient;
