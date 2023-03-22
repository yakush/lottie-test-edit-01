import React from "react";

import {
  LottieAnimColor,
  LottieColor,
  LottieShape,
  LottieSimpleColor,
} from "../../types/LottieShape";
import ShapeColor from "./ShapeColor";

type Props = {
  shape: LottieShape;
  onclick?: () => void;
  //children?: React.ReactNode;
};

const ShapeColorGradient: React.FC<Props> = ({ shape, onclick }) => {
  const gradient = shape.g;
  const keysData: LottieColor = gradient?.k;
  const anim = keysData?.a === 1;

  const keys = keysData?.k;
  if (!keys) {
    return <></>;
  }

  function handleColorClick(newColors: number[], stopIdx: number) {
    if (anim) {
      keysData.k[stopIdx].s = newColors;
    } else {
      keysData.k = [...newColors];
    }
    onclick && onclick();
  }

  if (anim) {
    return (
      <div>
        <div>gradient colors</div>
        <GradAnim
          grad={keysData as LottieAnimColor}
          onclick={handleColorClick}
        />
      </div>
    );
  }

  return (
    <div>
      <div>gradient colors</div>
      <GradSimple
        colors={keys as number[]}
        onclick={(newColors) => handleColorClick(newColors, 0)}
      />
    </div>
  );
};

const GradSimple: React.FC<{
  colors: number[];
  onclick: (colors: number[]) => void;
}> = ({ colors, onclick }) => {
  function handleColorClickSimple(idx: number) {
    // color.k = [Math.random(), Math.random(), Math.random(), 1];
    // onclick && onclick();
    colors[idx * 4 + 0] = colors[idx * 4 + 0];
    colors[idx * 4 + 1] = Math.random();
    colors[idx * 4 + 2] = Math.random();
    colors[idx * 4 + 3] = Math.random();

    onclick && onclick(colors);
  }

  const colorItems: LottieColor[] = [];
  for (let i = 0; i < colors.length / 4; i++) {
    const color = [colors[i * 4 + 1], colors[i * 4 + 2], colors[i * 4 + 3]];
    colorItems.push({
      a: 0,
      ix: 4,
      k: color,
    });
  }

  return (
    <div>
      {colorItems.map((item, i) => (
        <ShapeColor
          key={i}
          color={item}
          onclick={() => {
            handleColorClickSimple(i);
          }}
        />
      ))}
    </div>
  );
};

const GradAnim: React.FC<{
  grad: LottieAnimColor;
  onclick: (colors: number[], stopIdx: number) => void;
}> = ({ grad, onclick }) => {
  const stops = grad.k;

  function handleColorClick(newColors: number[], stopIdx: number) {
    onclick && onclick(newColors, stopIdx);
  }

  return (
    <div>
      {stops.map((item, i) => (
        <div key={i}>
          grad stop {i + 1}
          <GradSimple
            colors={item.s}
            onclick={(colors) => handleColorClick(colors, i)}
          />
        </div>
      ))}
    </div>
  );
};

export default ShapeColorGradient;
