import React, { useEffect, useState } from "react";
import { useLottieContext } from "../../LottieContext";
import styles from "./EditsLayers.module.css";

type Props = {
  children?: React.ReactNode;
};

const EditsLayers: React.FC<Props> = ({}) => {
  const lottie = useLottieContext();
  const layerOptions = lottie.editsJson?.layerOptions;

  const [selectedLayers, setSelectedLayers] = useState(
    lottie.editsJson?.layerOptions.map((item) => item.defaultOption ?? 0)
  );

  useEffect(() => {
    console.log(selectedLayers);
  }, [selectedLayers]);

  const handleRadio = (i_layerOptions: number, i_option: number) => {
    setSelectedLayers((state) => {
      if (!state) {
        return undefined;
      }
      let temp = [...state];
      temp[i_layerOptions] = i_option;

      return temp;
    });
  };

  if (!layerOptions) {
    return <></>;
  }
  return (
    <div className={styles.root}>
      <div>layer options</div>

      {layerOptions.map((layerOptions, i_layerOptions) => (
        <div key={i_layerOptions}>
          {layerOptions.name} :
          {layerOptions.options.map((option, i_option) => (
            <span key={i_option}>
              <input
                onChange={() => handleRadio(i_layerOptions, i_option)}
                checked={
                  selectedLayers && selectedLayers[i_layerOptions] === i_option
                }
                id={`layer-option-${i_layerOptions}-${i_option}`}
                type="radio"
                value={i_option}
                name={`layer-option-${i_layerOptions}`}
              />
              <label htmlFor={`layer-option-${i_layerOptions}-${i_option}`}>
                {option.name}
              </label>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default EditsLayers;
