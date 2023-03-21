import React, { useState } from "react";
import {
  isSimpleLottieColor,
  LottieColor,
  LottieSimpleColor,
} from "../../types/LottieShape";
import { LottieUtils } from "../../utils/lottieUtils";

type Props = {
  colorHex: string;
  onclick?: () => void;
};

const ShapeColorItem: React.FC<Props> = ({ colorHex, onclick }) => {
  return (
    <div>
      <div
        style={{
          backgroundColor: colorHex,
          userSelect: "none",
          cursor: "pointer",
          border: "solid 2px black",
          borderRadius: 5,
          padding: "2px 20px",
          marginRight: 5,
          display: "inline-block",
          width: "80px",
          textAlign: "center",
        }}
        onClick={onclick}
      >
        {colorHex}
      </div>
      {JSON.stringify(
        LottieUtils.hexToRgb(colorHex).map((x) => Math.round(x * 255))
      )}
    </div>
  );
};

function RGBA(arr: number[]) {
  const [r, g, b, a = 1] = arr;
  return `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${a})`;
}

export default ShapeColorItem;
