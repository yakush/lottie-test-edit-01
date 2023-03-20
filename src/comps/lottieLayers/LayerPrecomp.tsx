import React from "react";
import { useLottieContext } from "../../LottieContext";
import { LottieLayer } from "../../types/LottieLayer";
import { LottieUtils } from "../../utils/lottieUtils";
import LayersList from "../LayersList";
//import styles from "./LayerItem.module.css";

type Props = {
  enabled?: boolean;
  layer: LottieLayer;
  children?: React.ReactNode;
};

const LayerPrecomp: React.FC<Props> = ({ layer, enabled = true }) => {
  //console.log(layer.refId, layer.layers?.length);
  const lottie = useLottieContext();
  const asset = lottie.json?.assets?.find((asset) => asset.id === layer.refId);
  const hidden = LottieUtils.isLayerHidden(layer);

  if (!asset) {
    return <div>no matching refId {layer.refId}</div>;
  }

  function handleLayerClick(layer) {
    if (layer) {
      console.log(layer);
      LottieUtils.setLayerHidden(layer, !LottieUtils.isLayerHidden(layer));
      lottie.setJson((json) => ({ ...json }));
    }

  }

  return (
    <div>
      <div>id: {asset.id || ""}</div>
      <div>layers: {asset.layers?.length}</div>

      <div style={{ marginLeft: 10 }}>
        <LayersList
          layers={asset.layers || []}
          onClick={handleLayerClick}
          enabled={enabled && !hidden}
        />
      </div>
    </div>
  );
};

export default LayerPrecomp;
