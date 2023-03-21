import React, { useState } from "react";
import { shapeTypes, shapeTypeToName } from "../../enums";
import { useLottieContext } from "../../LottieContext";
import { LottieLayer } from "../../types/LottieLayer";
import {
  isSimpleLottieColor,
  LottieColor,
  LottieShape,
  LottieSimpleColor,
} from "../../types/LottieShape";
import ShapeColor from "./ShapeColor";
import ShapeColorGradient from "./ShapeColorGradient";
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
  const isSolidColor =
    shape.ty === shapeTypes.fill || shape.ty === shapeTypes.stroke;
  const isGradColor =
    shape.ty === shapeTypes.gfill || shape.ty === shapeTypes.gStroke;

  const solidColor: LottieColor = isSolidColor && shape.c;
  const gradColor: LottieColor = isGradColor && shape.g.k;

  function handleColorClick() {
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

      {solidColor && (
        <ShapeColor color={solidColor} onclick={handleColorClick} />
      )}
      {gradColor && (
        <ShapeColorGradient shape={shape} onclick={handleColorClick} />
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
        {items?.map((item, i) => (
          <li>
            <Shape key={i} shape={item} onChangeColor={onChangeColor} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LayerShape;
