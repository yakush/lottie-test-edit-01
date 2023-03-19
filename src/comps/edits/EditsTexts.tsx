import React, { useEffect, useId, useState } from "react";
import { useLottieContext } from "../../LottieContext";
import styles from "./EditsTexts.module.css";

type Props = {
  children?: React.ReactNode;
};

const EditsTexts: React.FC<Props> = ({}) => {
  const lottie = useLottieContext();
  const texts = lottie.editsJson?.textEdits;

  const [textEdits, setTextEdits] = useState(
    texts?.map((layer) => "orig text")
  );

  useEffect(() => {
    console.log({ textEdits });
  }, [textEdits]);

  const handleText = (text: string, i: number) => {
    setTextEdits((s) => {
      if (!s) {
        return s;
      }

      let temp = { ...s };
      temp[i] = text;
      return temp;
    });
  };

  if (!texts) {
    return <></>;
  }
  return (
    <div className={styles.root}>
      <div>editable texts</div>

      {texts.map((textOption, i) => (
        <Text
          key={i}
          name={textOption.name}
          orig={"orig test !"}
          onChange={(text) => handleText(text, i)}
        />
      ))}
    </div>
  );
};

//-------------------------------------------------------
//-------------------------------------------------------

type PropsText = {
  name: string;
  orig?: string;
  onChange?: (text: string) => void;
};

const Text: React.FC<PropsText> = ({ name, orig = "", onChange }) => {
  const labelId = useId();

  const [currentText, setCurrentText] = useState(orig ?? "");

  const handleText = (e) => {
    e.preventDefault();
    setCurrentText(e.target.value);
  };
  const handleSubmit = (e) => {
    console.log("submit");

    e.preventDefault();
    onChange && onChange(currentText);
  };

  const handleReset = (e) => {
    console.log("reset");

    e.preventDefault();
    setCurrentText(orig);
    onChange && onChange(orig);
  };

  return (
    <form onSubmit={handleSubmit} onReset={handleReset}>
      <label htmlFor={labelId}>{name} </label>
      <input
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
