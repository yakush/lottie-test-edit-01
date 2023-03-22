import React from "react";
import {
  isSimpleLottieColor,
  LottieAnimColor,
  LottieColor,
  LottieSimpleColor,
} from "../../types/LottieShape";
import { LottieUtils } from "../../utils/lottieUtils";
import ColorSlot from "../ColorSlot";

type Props = {
  color: LottieColor;
  onclick?: () => void;
  //children?: React.ReactNode;
};

const ShapeColor: React.FC<Props> = ({ color, onclick }) => {
  const isSimpleColor = isSimpleLottieColor(color);
  const colorArray = isSimpleColor
    ? (color as LottieSimpleColor).k
    : "#000000ff";

  function handleColorClick() {
    color.k = [Math.random(), Math.random(), Math.random(), 1];
    onclick && onclick();
  }

  if (!color) {
    color = color as LottieAnimColor;
    return <></>;
  }

  if (!isSimpleColor) {
    return (
      <div>
        <div>animated color</div>
        {color.k?.map((item, i) => {
          const subColor: LottieSimpleColor = {
            a: 0,
            ix: color.ix,
            k: item.s,
          };
          function handleSubColorClick() {
            //subColor.k = [Math.random(), Math.random(), Math.random(), 1];
            item.s = [Math.random(), Math.random(), Math.random(), 1];
            onclick && onclick();
          }

          return (
            <ShapeColor
              key={i}
              color={subColor}
              onclick={handleSubColorClick}
            />
          );
        })}
      </div>
    );
  }

  return (
    <ColorSlot
      color={colorArray}
      onClick={handleColorClick}
      showArray={true}
      showHex={true}
    />
  );
};

export default ShapeColor;
