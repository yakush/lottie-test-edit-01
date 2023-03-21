import React from "react";
import { LottieLayer } from "../../types/LottieLayer";
import { LottieUtils } from "../../utils/lottieUtils";
import ShapeColorItem from "./ShapeColorItem";

type Props = {
  layer: LottieLayer;
  onclick?: () => void;
};

function getLayerTextNode(layer: LottieLayer) {
  return layer?.t?.d?.k[0]?.s;
}

const TextColor: React.FC<Props> = ({ layer, onclick }) => {
  const textNode = getLayerTextNode(layer); //array
  const color = textNode?.fc; //array

  function handleColorClick() {
    if (!textNode) {
      return;
    }

    textNode.fc = [Math.random(), Math.random(), Math.random(), 1];
    onclick && onclick();
  }

  if (!color) {
    return <></>;
  }

  return (
    <ShapeColorItem
      colorHex={LottieUtils.rgbToHex(color)}
      onclick={handleColorClick}
    />
  );
};

export default TextColor;
