import React from "react";
import { LottieLayer } from "../../types/LottieLayer";

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

  const rgba = color ? RGBA(color) : RGBA([1, 1, 1, 1]);

  function handleColorClick(e) {
    e.preventDefault();
    e.stopPropagation();
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
    <div>
      <div>
        <div>
          <div
            style={{
              backgroundColor: rgba,
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
          {JSON.stringify(color.map((x) => Math.round(x * 255)))}
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

export default TextColor;
