import React, { useEffect, useRef, useState } from "react";
import { useLottieContext } from "../../LottieContext";
import { LottieLayer } from "../../types/LottieLayer";
import TextColor from "./TextColor";
//import styles from "./LayerItem.module.css";

type Props = {
  enabled?: boolean;
  layer: LottieLayer;
  children?: React.ReactNode;
};

function getLayerTextNode(layer: LottieLayer) {
  return layer?.t?.d?.k[0]?.s;
}

const LayerText: React.FC<Props> = ({ layer, enabled = true }) => {
  const [inputText, setInputText] = useState(getLayerTextNode(layer)?.t || "");
  const [origText, setOrigText] = useState(getLayerTextNode(layer)?.t || "");
  const lottie = useLottieContext();

  const textNode = getLayerTextNode(layer);

  function onUpdate() {
    if (!textNode?.t) return;

    textNode.t = inputText;
    lottie.setJson((j) => ({ ...j }));
  }

  function onRevert() {
    if (!textNode?.t) return;

    setInputText(origText);
    textNode.t = origText;
    lottie.setJson((j) => ({ ...j }));
  }

  function handleColorChange() {
    lottie.setJson((j) => ({ ...j }));
  }

  return (
    <div>
      <div>
        <input
          type="text"
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
          }}
        />
        <button onClick={onUpdate}>update</button>
        <button onClick={onRevert}>revert</button>
      </div>
      <div>
        <TextColor layer={layer} onclick={handleColorChange} />
      </div>
    </div>
  );
};

export default LayerText;
