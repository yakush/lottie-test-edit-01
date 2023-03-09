import React, { useState } from "react";
import { useLottieContext } from "../../LottieContext";
import { LottieLayer } from "../../types/LottieLayer";
import { LottieShape } from "../../types/LottieShape";
//import styles from "./LayerItem.module.css";

type Props = {
  enabled?: boolean;
  layer: LottieLayer;
  children?: React.ReactNode;
};

const LayerShape: React.FC<Props> = ({ layer, enabled = true }) => {
  const lottie = useLottieContext();

  function onChangeColor(shape) {
    lottie.setJson((j) => ({ ...j }));
  }

  return (
    <div>
      <div>{layer.shapes?.length || 0} shapes</div>
      {layer.shapes.map((shape: LottieShape) => (
        <Shape
          key={shape.nm}
          shape={shape}
          onChangeColor={() => onChangeColor(shape)}
        />
      ))}
    </div>
  );
};

//-------------------------------------------------------

interface Color {
  a: number; // 0-solid, 1- animation
  k: number[];
  ix: number;
}

function RGBA(arr: number[]) {
  const [r, g, b, a = 1] = arr;
  return `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${a})`;
}

type ShapeProps = {
  shape: LottieShape;
  children?: React.ReactNode;
  onChangeColor?: () => void;
};

const Shape: React.FC<ShapeProps> = ({ shape, onChangeColor }) => {
  //try to find color attr:
  const color: Color = shape.it?.find(({ ty }) => ty === "fl")?.c;

  const isSimpleColor = color ? color.a === 0 : false;
  const rgba = isSimpleColor ? RGBA(color.k) : RGBA([0, 0, 0, 0]);

  function handleColorClick(e) {
    e.preventDefault();
    e.stopPropagation();
    color.k = [Math.random(), Math.random(), Math.random(), 1];
    onChangeColor && onChangeColor();
  }

  return (
    <div
      style={{
        borderBottom: "1px solid black",
        padding: 3,
        margin: 3,
      }}
    >
      <div>
        name: {shape.nm} | ty: {shape.ty}
      </div>
      {color && (
        <>
          <div>
            {isSimpleColor
              ? `simple color ${JSON.stringify(
                  color.k.map((x) => Math.round(x * 255))
                )}`
              : "animated color"}
          </div>
          {isSimpleColor && (
            <div
              style={{
                backgroundColor: rgba,
                userSelect: "none",
                cursor: "pointer",
                border: "solid 1px black",
              }}
              onClick={(e) => handleColorClick(e)}
            >
              COLOR
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LayerShape;
