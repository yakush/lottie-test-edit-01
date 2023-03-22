import React from "react";
import { LottieLayer } from "../../types/LottieLayer";
import { LottieUtils } from "../../utils/lottieUtils";

import ColorSlot from "../ColorSlot";

type Props = {
  layer: LottieLayer;
  onclick?: () => void;
};

const SolidColor: React.FC<Props> = ({ layer, onclick }) => {
  const colorHex = layer?.sc; //hex string!

  function handleColorClick() {
    layer.sc = LottieUtils.rgbToHex([
      Math.random(),
      Math.random(),
      Math.random(),
    ]);
    onclick && onclick();
  }

  return (
    <ColorSlot
      color={colorHex}
      onClick={handleColorClick}
      showArray={true}
      showHex={true}
    />
  );
};

export default SolidColor;
