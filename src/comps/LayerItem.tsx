import React from "react";
import { layerTypes } from "../enums";
import { LottieLayer } from "../types/LottieLayer";
import { joinClasses } from "../utils/cssUtils";
import styles from "./LayerItem.module.css";

type Props = {
  layer: LottieLayer;
  children?: React.ReactNode;
  onClick?: () => void;
};

const LayerItem: React.FC<Props> = ({ layer, onClick }) => {
  const hidden = layer.ty === -100;
  const type = !hidden ? layer.ty : layer.tyOld;
  let layerTypeName = layerTypes[type];

  return (
    <div
      className={joinClasses(styles.root, hidden ? styles.hidden : "")}
      onClick={onClick}
    >
      <div>
        {hidden && "(X)"} {layer.nm}
      </div>
      <div>{layerTypeName}</div>

      {type === layerTypes.shape && (
        <div className={styles.subText}>{layer.shapes?.length || 0} shapes</div>
      )}

      {type === layerTypes.precomp && (
        <div className={styles.subText}>refID: {layer.refId || ""}</div>
      )}
    </div>
  );
};

export default LayerItem;
