import React from "react";
import { useLottieContext } from "../../LottieContext";
import styles from "./Edits.module.css";
import EditsColors from "./EditsColors";
import EditsLayers from "./EditsLayers";
import EditsTexts from "./EditsTexts";

type Props = {
  children?: React.ReactNode;
};

const Edits: React.FC<Props> = ({}) => {
  const lottie = useLottieContext();

  if (!lottie.editsJson) {
    return (
      <div className={styles.root}>
        <div className={styles.title}>No User Edits Json Loaded...</div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.title}>User Edits</div>

      <EditsColors />
      <EditsLayers />
      <EditsTexts />
    </div>
  );
};

export default Edits;
