import React from "react";
import { LottieLayer } from "../../types/LottieLayer";
import { hexToRgb, rgbToHex } from "../../utils/cssUtils";

type Props = {
  layer: LottieLayer;
  onclick?: () => void;
};

const SolidColor: React.FC<Props> = ({ layer, onclick }) => {
  
  const colorHex = layer?.sc; //hex string!
  
  function handleColorClick(e) {
    e.preventDefault();
    e.stopPropagation();
  
    layer.sc = rgbToHex(
      255 * Math.random(),
      255 * Math.random(),
      255 * Math.random()
    );
    onclick && onclick();
  }

  return (
    <div>
      <div>
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
            }}
            onClick={(e) => handleColorClick(e)}
          >
            COLOR
          </div>
          {colorHex}
        </div>
      </div>
    </div>
  );
};

//-------------------------------------------------------

function RGBA(arr: number[]) {
  const [r, g, b, a = 1] = arr;
  return `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${a})`;
}

export default SolidColor;
