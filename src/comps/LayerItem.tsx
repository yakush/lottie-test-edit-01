import React from "react";
import { layerTypes } from "../enums";
import { LottieLayer } from "../types/LottieLayer";

type Props = {
  layer: LottieLayer;
  children?: React.ReactNode;
};

const LayerItem: React.FC<Props> = ({ layer }) => {
  let layerTypeName = layerTypes[layer.ty];
  return (
    <div>
      <div>{layer.nm}</div>
      <div>{layerTypeName}</div>
      {layer.ty === layerTypes.shape && (
        <div style={{ color: "gray" }}>{layer.shapes?.length || 0} shapes</div>
      )}
      {layer.ty === layerTypes.precomp && (
        <div style={{ color: "gray" }}>refID: {layer.refId || ""}</div>
      )}
    </div>
  );
};

export default LayerItem;
