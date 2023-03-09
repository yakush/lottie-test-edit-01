import React, { useState } from "react";
import { shapeTypes, shapeTypeToName } from "../../enums";
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
      <div>shapes: {layer.shapes?.length || 0}</div>
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
  const isGroup = shape.ty === shapeTypes.group;

  const color: Color = shape.c;

  const isSimpleColor = color ? color.a === 0 : false;
  const rgba = isSimpleColor ? RGBA(color.k) : RGBA([0, 0, 0, 0]);

  function handleColorClick(e) {
    e.preventDefault();
    e.stopPropagation();
    color.k = [Math.random(), Math.random(), Math.random(), 1];
    onChangeColor && onChangeColor();
  }

  if (isGroup) {
    return <GroupShape shape={shape} onChangeColor={onChangeColor} />;
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
        name: {shape.nm} | type: {shapeTypeToName(shape.ty)} ({shape.ty})
      </div>
      {color && (
        <>
          <div>
            {isSimpleColor ? (
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
            ) : (
              <div>animated color</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

//-------------------------------------------------------

type GroupShapeProps = {
  shape: LottieShape;
  children?: React.ReactNode;
  onChangeColor?: () => void;
};

const GroupShape: React.FC<GroupShapeProps> = ({ shape, onChangeColor }) => {
  const items = shape.it;

  return (
    <div
      style={{
        borderBottom: "1px solid black",
        padding: 3,
        margin: 3,
      }}
    >
      <div>
        name: {shape.nm} | type: {shapeTypeToName(shape.ty)} ({shape.ty})
      </div>
      <div>items: {items?.length}</div>
      <ul style={{ marginLeft: 5, borderLeft: "solid 1px gray" }}>
        {items?.map((item) => (
          <li>
            <Shape shape={item} onChangeColor={onChangeColor} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LayerShape;
