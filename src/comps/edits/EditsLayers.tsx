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

  const [selectedLayers, setSelectedLayers] = useState(
    lottie.editsJson?.layerEdits?.map((item) => item.defaultOption ?? 0)
  );

  useEffect(() => {
    console.log(JSON.stringify(selectedLayers));
  }, [selectedLayers]);

  const handleLayerChange = (i_layerOptions: number, i_option: number) => {
    setSelectedLayers((state) => {
      if (!state) {
        return undefined;
      }
      let temp = [...state];
      temp[i_layerOptions] = i_option;

      return temp;
    });
  };

  if (!layerSelects) {
    return <></>;
  }
  return (
    <div className={styles.root}>
      <div>layer options</div>

      {layerSelects.map((layerOptions, i_layerOptions) => (
        <Layer
          key={i_layerOptions}
          layer={layerOptions}
          onChange={(idx) => handleLayerChange(i_layerOptions, idx)}
        />
      ))}
    </div>
  );
};

//-------------------------------------------------------
//-------------------------------------------------------

type PropsLayer = {
  layer: LayerEditsConfig;
  onChange?: (selectedIdx: number) => void;
};

const Layer: React.FC<PropsLayer> = ({ layer, onChange }) => {
  const id = useId();
  const [selectedIdx, setSelectedIdx] = useState(layer.defaultOption ?? 0);

  const handleRadio = (i: number) => {
    setSelectedIdx(i);
    onChange && onChange(i);
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
