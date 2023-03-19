import React from "react";
import { useLottieContext } from "../LottieContext";
import ColorPalette from "./ColorPalette";
import LayersList from "./LayersList";

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
      console.log(layer);

      if (layer) {
        console.log(layer.op);
        layer.hd = layer.hd == null ? true : !layer.hd;
      }
      return { ...json };
    });
  }

  function handleAssetLayerClick(name: string) {
    lottie.setJson((json) => {
      const layer = lottie.json?.layers?.find((layer) => layer.nm === name);
      console.log(layer);

      if (layer) {
        console.log(layer.op);
        layer.hd = layer.hd == null ? true : !layer.hd;
      }
      return { ...json };
    });
  }

  return (
    <>
      <h3>{layers.length} layers</h3>

      <LayersList
        layers={layers}
        onClick={(layer) => handleLayerClick(layer.nm)}
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
