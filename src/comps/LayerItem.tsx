import React from "react";
import { layerTypes } from "../enums";
import { LottieLayer } from "../types/LottieLayer";
import styles from './LayerItem.module.css';

type Props = {
  layer: LottieLayer;
  children?: React.ReactNode;
};

const LayerItem: React.FC<Props> = ({ layer }) => {
  let layerTypeName = layerTypes[layer.ty];
  return (
    <div className={styles.root}>
      <div>{layer.nm}</div>
      <div>{layerTypeName}</div>
      {layer.ty === layerTypes.shape && (
        <div className={styles.subText} >{layer.shapes?.length || 0} shapes</div>
      )}
      {layer.ty === layerTypes.precomp && (
        <div className={styles.subText}>refID: {layer.refId || ""}</div>
      )}
    </div>
  );
};

export default LayerItem;
