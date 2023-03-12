import React from "react";

import { LottieShape } from "../../types/LottieShape";
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

  function handleColorClick(e) {
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
    let simpleColorRefs: any[] = [];
    for (let i = 0; i < keys.length; i += 3) {
      const color = [keys[i + 0], keys[i + 1], keys[i + 2]];
      simpleColorRefs.push({
        a: 0,
        ix: keys.ix,
        k: color,
      });
    }

    return (
      <div>
        gradient colors (anim)
        <div>
          {keys.map((item, i) => {
            console.log({ keys });
            return <div key={i}>color {i}</div>;
          })}
        </div>
      </div>
    );
  }

  let colorRefs: any[] = [];
  for (let i = 0; i < keys.length; i += 3) {
    const color = [keys[i + 0], keys[i + 1], keys[i + 2]];
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
