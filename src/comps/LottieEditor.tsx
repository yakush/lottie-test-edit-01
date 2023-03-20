import React from "react";
import { useLottieContext } from "../LottieContext";
import { LottieLayer } from "../types/LottieLayer";
import { LottieUtils } from "../utils/lottieUtils";
import ColorPalette from "./ColorPalette";
import LayersList from "./LayersList";

type Props = {
  children?: React.ReactNode;
};

const LottieEditor: React.FC<Props> = ({}) => {
  const lottie = useLottieContext();

  const layers = lottie.json?.layers || [];
  const assets = lottie.json?.assets || [];

  function handleLayerClick(layer: LottieLayer) {
    if (layer) {
      console.log(layer);
      LottieUtils.setLayerHidden(layer, !LottieUtils.isLayerHidden(layer));
      lottie.setJson((json) => ({ ...json }));
    }
  }

  // function handleAssetLayerClick(layer: LottieLayer) {
  //   if (layer) {
  //     console.log(layer);
  //     LottieUtils.setLayerHidden(layer, !LottieUtils.isLayerHidden(layer));
  //     lottie.setJson((json) => ({ ...json }));
  //   }
  // }

  return (
    <>
      <h3>{layers.length} layers</h3>

      <LayersList
        layers={layers}
        onClick={(layer) => handleLayerClick(layer)}
      />

      <h3>{assets.length} assets</h3>
      {/* 
      <ul>
        {assets?.map((asset) => (
          <li key={asset.id} className={styles.item}>
            ({asset.id}) {asset.nm} : {asset.layers?.length || 0} layers
            <LayersList
              layers={asset.layers}
              onClick={(layer) => console.log(asset.id, layer.ind, layer)}
            />
          </li>
        ))}
      </ul>
       */}
    </>
  );
};

export default LottieEditor;
