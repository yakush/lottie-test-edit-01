import React from "react";
import { useLottieContext } from "../LottieContext";
import LayerItem from "./LayerItem";

import styles from "./LottieEditor.module.css";

type Props = {
  children?: React.ReactNode;
};

const LottieEditor: React.FC<Props> = ({}) => {
  const lottie = useLottieContext();

  const layers = lottie.json?.layers || [];
  const assets = lottie.json?.assets || [];

  function handleLayerClick(name: string) {
    lottie.setJson((json) => {
      const layer = lottie.json?.layers?.find((layer) => layer.nm === name);
      if (layer) {
        const temp = layer.ty;
        layer.ty = layer.tyOld != null ? layer.tyOld : -100;
        layer.tyOld = temp;
      }
      return { ...json };
    });
  }

  return (
    <>
      <h3>{layers.length} layers</h3>

      <ul>
        {layers?.map((layer) => (
          <li key={layer.nm} className={styles.item}>
            <LayerItem
              layer={layer}
              onClick={() => handleLayerClick(layer.nm)}
            ></LayerItem>
          </li>
        ))}
      </ul>

      <h3>{assets.length} assets</h3>
      <ul>
        {assets?.map((asset) => (
          <li key={asset.id} className={styles.item}>
            ({asset.id}) {asset.nm} : {asset.layers?.length || 0} layers
            <ul>
              {asset.layers?.map((layer) => (
                <li key={layer.nm} className={styles.item}>
                  <LayerItem layer={layer}></LayerItem>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
};

export default LottieEditor;
