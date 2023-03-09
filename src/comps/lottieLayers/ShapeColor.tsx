import React, { useState } from "react";
import { LottieLayer } from "../../types/LottieLayer";
import {
  isSimpleLottieColor,
  LottieAnimColor,
  LottieColor,
  LottieShape,
  LottieSimpleColor,
} from "../../types/LottieShape";

type Props = {
  color: LottieColor;
  onclick?: () => void;
  //children?: React.ReactNode;
};

const ShapeColor: React.FC<Props> = ({ color, onclick }) => {
  const isSimpleColor = isSimpleLottieColor(color);
  const rgba = isSimpleColor
    ? RGBA((color as LottieSimpleColor).k)
    : RGBA([0, 0, 0, 0]);

  function handleColorClick(e) {
    e.preventDefault();
    e.stopPropagation();
    color.k = [Math.random(), Math.random(), Math.random(), 1];
    onclick && onclick();
  }

  if (!color) {
    color = color as LottieAnimColor;
    return <></>;
  }

  if (!isSimpleColor) {
    return (
      <div>
        <div>animated color</div>
        {color.k?.map((item, i) => {
          const subColor: LottieSimpleColor = {
            a: 0,
            ix: color.ix,
            k: item.s,
          };
          function handleSubColorClick() {
            //subColor.k = [Math.random(), Math.random(), Math.random(), 1];
            item.s = [Math.random(), Math.random(), Math.random(), 1];
            onclick && onclick();
          }

          return (
            <ShapeColor
              key={i}
              color={subColor}
              onclick={handleSubColorClick}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div>
      <div>
        <div>
          <div
            style={{
              backgroundColor: rgba,
              userSelect: "none",
              cursor: "pointer",
              border: "solid 2px black",
              borderRadius: 5,
              padding: "2px 20px",
              marginRight: 5,
              display: "inline-block",
            }}
            onClick={(e) => handleColorClick(e)}
          >
            COLOR
          </div>
          {JSON.stringify(color.k.map((x) => Math.round(x * 255)))}
        </div>
      </div>
    </div>
  );
};

//-------------------------------------------------------

function RGBA(arr: number[]) {
  const [r, g, b, a = 1] = arr;
  return `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${a})`;
}

export default ShapeColor;
