import React, { FormEvent, useEffect, useRef, useState } from "react";
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

  function onUpdate(e: FormEvent) {
    e.preventDefault();

    if (!textNode?.t) return;
    let text = inputText;
    if (text == null ||text === "") {
      text = " "; 
    }

    textNode.t = text;
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
        <form onSubmit={onUpdate}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
            }}
          />
          <input type="submit" value="update" />
          {/* <button  onClick={onUpdate}>update</button> */}
          <button onClick={onRevert}>revert</button>
        </form>
      </div>
      <div>
        <TextColor layer={layer} onclick={handleColorChange} />
      </div>
    </div>
  );
};

export default LayerText;
