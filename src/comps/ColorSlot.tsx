import React from "react";
import { LottieUtils } from "../utils/lottieUtils";
import styles from "./ColorSlot.module.css";

type Props = {
  onClick?: () => void;
  color: number[] | string;
  showHex?: boolean;
  showArray?: boolean;
};

const ColorSlot: React.FC<Props> = ({
  color,
  onClick,
  showHex = false,
  showArray = false,
}) => {
  let colorHex: string;
  let colorArray: number[];

  if (Array.isArray(color)) {
    colorArray = color;
    colorHex = LottieUtils.rgbToHex(color);
  } else {
    colorArray = LottieUtils.hexToRgb(color);
    colorHex = color;
  }
  const colorArray255 = colorArray.map((x) => Math.round(x * 255));

  return (
    <div className={styles.root}>
      <div
        className={styles.color}
        style={{ backgroundColor: colorHex }}
        onClick={onClick}
      >
        {showHex ? colorHex : <span>&nbsp;</span>}
      </div>
      {showArray ? JSON.stringify(colorArray255) : <span>&nbsp;</span>}
    </div>
  );
};

//-------------------------------------------------------

export default ColorSlot;
