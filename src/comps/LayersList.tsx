import React from "react";
import { LottieLayer } from "../types/LottieLayer";
import LayerItem from "./LayerItem";

type Props = {
  enabled?: boolean;
  layers: LottieLayer[];
  children?: React.ReactNode;
  onClick?: (layer: LottieLayer) => void;
};

const LayersList: React.FC<Props> = ({ layers, onClick, enabled = true }) => {
  return (
    <>
      <ul>
        {layers?.map((layer) => (
          <li key={layer.nm}>
            <LayerItem layer={layer} onClick={onClick} enabled={enabled} />
          </li>
        ))}
      </ul>
    </>
  );
};

export default LayersList;
