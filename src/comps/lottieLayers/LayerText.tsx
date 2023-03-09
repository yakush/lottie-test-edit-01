import React from "react";
import { LottieLayer } from "../../types/LottieLayer";
//import styles from "./LayerItem.module.css";

type Props = {
  enabled?: boolean;
  layer: LottieLayer;
  children?: React.ReactNode;
};

const LayerText: React.FC<Props> = ({ layer, enabled = true }) => {
  return <div>LayerText</div>;
};

export default LayerText;
