import React from "react";
import { JsxElement } from "typescript";
import { layerTypes } from "../enums";
import { LottieLayer } from "../types/LottieLayer";
import { joinClasses } from "../utils/cssUtils";
import styles from "./LayerItem.module.css";
import LayerPrecomp from "./lottieLayers/LayerPrecomp";
import LayerShape from "./lottieLayers/LayerShape";
import LayerSolid from "./lottieLayers/LayerSolid";
import LayerText from "./lottieLayers/LayerText";
import Toggle from "./ui/Toggle";

type Props = {
  layer: LottieLayer;
  enabled?: boolean;
  onClick?: (layer: LottieLayer) => void;
  onLayerVisibility?: (layer: LottieLayer) => void;
  children?: React.ReactNode;
};

const LayerItem: React.FC<Props> = ({ layer, onClick, enabled = true }) => {
  
  const hidden = layer.hd === true;
  const type = layer.ty;

  let layerTypeName = layerTypes[type];

  let contentLayer: JSX.Element = <></>;

  switch (type) {
    case layerTypes.text:
      contentLayer = <LayerText layer={layer} enabled={enabled} />;
      break;

    case layerTypes.precomp:
      contentLayer = <LayerPrecomp layer={layer} enabled={enabled} />;
      break;

    case layerTypes.shape:
      contentLayer = <LayerShape layer={layer} enabled={enabled} />;
      break;

    case layerTypes.solid:
      contentLayer = <LayerSolid layer={layer} enabled={enabled} />;
      break;

    default:
      break;
  }

  return (
    <div className={joinClasses(styles.root, hidden ? styles.hidden : "")}>
      <div className={styles.layerHeader}>
        <Toggle checked={!hidden} onChange={() => onClick && onClick(layer)} />
        <span>
          {" "}
          [{layerTypeName}] {layer.nm}
        </span>
      </div>
      <div className={styles.layerContent}>{contentLayer}</div>
    </div>
  );
};

export default LayerItem;
