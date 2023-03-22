import React from "react";
import { LottieLayer } from "../../types/LottieLayer";
import { LottieUtils } from "../../utils/lottieUtils";
import ColorSlot from "../ColorSlot";

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
    <ColorSlot color={color} onClick={handleColorClick} showArray={true} showHex={true}/>
  );
};

export default TextColor;
