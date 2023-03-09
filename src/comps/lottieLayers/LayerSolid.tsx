import React from "react";
import { useLottieContext } from "../../LottieContext";
import { LottieLayer } from "../../types/LottieLayer";
import { rgbToHex } from "../../utils/cssUtils";
import SolidColor from "./SolidColor";
//import styles from "./LayerItem.module.css";

type Props = {
  enabled?: boolean;
  layer: LottieLayer;
  children?: React.ReactNode;
};

const LayerSolid: React.FC<Props> = ({ layer, enabled = true }) => {
  const lottie = useLottieContext();

  const color = layer?.sc;

  function handleColorChange() {
    lottie.setJson((j) => ({ ...j }));
  }

  return (
    <div>
      <div>
        SOLID
        <SolidColor layer={layer} onclick={handleColorChange} />
      </div>
    </div>
  );
};

export default LayerSolid;
