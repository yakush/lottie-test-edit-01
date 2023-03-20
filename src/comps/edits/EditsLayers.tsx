import React, { useEffect, useId, useState } from "react";
import { useLottieContext } from "../../LottieContext";
import { LayerEditsConfig } from "../../types/LottieEditsConfig";
import styles from "./EditsLayers.module.css";

type Props = {
  children?: React.ReactNode;
};

const EditsLayers: React.FC<Props> = ({}) => {
  const id = useId();

  const lottie = useLottieContext();
  const layerSelects = lottie.editsJson?.layerEdits;

  if (!layerSelects) {
    return <></>;
  }
  return (
    <div className={styles.root}>
      <div>layer options</div>

      {layerSelects.map((layerOptions, i_layerOptions) => (
        <Layer key={i_layerOptions} layer={layerOptions} />
      ))}
    </div>
  );
};

//-------------------------------------------------------
//-------------------------------------------------------

type PropsLayer = {
  layer: LayerEditsConfig;
};

const Layer: React.FC<PropsLayer> = ({ layer }) => {
  const id = useId();
  // const [selectedIdx, setSelectedIdx] = useState(layer.defaultOption ?? 0);
  const lottie = useLottieContext();
  const mgr = lottie.lottieManager;
  const selectedIdx = layer._edited?.selectedOption ?? 0;

  const handleRadio = (i: number) => {
    mgr?.editLayer(layer.name, i);
  };

  return (
    <div className={styles.layer}>
      <span className={styles.layerName}>{layer.name} :</span>
      {layer.options.length > 0 && (
        <>
          {layer.allowNone === true && (
            <span key={-1}>
              <input
                onChange={() => handleRadio(-1)}
                checked={selectedIdx === -1}
                id={`${id}_layer-option-${-1}`}
                type="radio"
                value={-1}
                name={`${id}-layer-options`}
              />
              <label htmlFor={`${id}_layer-option-${-1}`}>hide</label>
            </span>
          )}

          {layer.options.map((option, i_option) => (
            <span key={i_option}>
              <input
                onChange={() => handleRadio(i_option)}
                checked={selectedIdx === i_option}
                id={`${id}_layer-option-${i_option}`}
                type="radio"
                value={i_option}
                name={`${id}-layer-options`}
              />
              <label htmlFor={`${id}_layer-option-${i_option}`}>
                {option.name}
              </label>
            </span>
          ))}
        </>
      )}
    </div>
  );
};

export default EditsLayers;
