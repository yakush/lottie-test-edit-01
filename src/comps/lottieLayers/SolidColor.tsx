import React from "react";
import { LottieLayer } from "../../types/LottieLayer";
import { hexToRgb, rgbToHex } from "../../utils/cssUtils";
import ShapeColorItem from "./ShapeColorItem";

type Props = {
  layer: LottieLayer;
  onclick?: () => void;
};

const SolidColor: React.FC<Props> = ({ layer, onclick }) => {
  const colorHex = layer?.sc; //hex string!

  function handleColorClick() {
    layer.sc = rgbToHex(
      255 * Math.random(),
      255 * Math.random(),
      255 * Math.random()
    );
    onclick && onclick();
  }

  return <ShapeColorItem colorHex={colorHex} onclick={handleColorClick} />;
};


export default SolidColor;
