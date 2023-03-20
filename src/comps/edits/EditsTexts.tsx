import React, { useEffect, useId, useState } from "react";
import { useLottieContext } from "../../LottieContext";
import { TextEditsConfig } from "../../types/LottieEditsConfig";
import EditCard from "./EditCard";
import styles from "./EditsTexts.module.css";

type Props = {
  children?: React.ReactNode;
};

const EditsTexts: React.FC<Props> = ({}) => {
  const lottie = useLottieContext();
  const texts = lottie.editsJson?.textEdits;

  if (!texts) {
    return <></>;
  }
  return (
    <EditCard title="editable texts">
      {texts.map((textOption, i) => (
        <Text key={i} layer={textOption} />
      ))}
    </EditCard>
  );
};

//-------------------------------------------------------
//-------------------------------------------------------

type PropsText = {
  layer: TextEditsConfig;
};

const Text: React.FC<PropsText> = ({ layer }) => {
  const labelId = useId();

  const lottie = useLottieContext();
  const mgr = lottie.lottieManager;

  const selectedText = layer._edited?.selectedText || " ";
  const origText = layer._edited?.origText || " ";

  const [currentText, setCurrentText] = useState(origText);

  const handleText = (e) => {
    e.preventDefault();
    setCurrentText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submit");
    mgr?.editText(layer.name, currentText);
  };

  const handleReset = (e) => {
    e.preventDefault();
    console.log("reset");
    setCurrentText(origText);
    mgr?.editText(layer.name, origText);
  };

  return (
    <form
      className={styles.layer}
      onSubmit={handleSubmit}
      onReset={handleReset}
    >
      <label className={styles.layerName} htmlFor={labelId}>
        {layer.name}{" "}
      </label>
      <input
        className={styles.layerText}
        id={labelId}
        type="text"
        value={currentText}
        onChange={handleText}
      />
      <input type="submit" value="update" />
      <input type="reset" value="reset" />
    </form>
  );
};

export default EditsTexts;
