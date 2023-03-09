import React, { ChangeEventHandler } from "react";
import { joinClasses } from "../../utils/cssUtils";
import styles from "./Toggle.module.css";

type Props = {
  onChange?: ChangeEventHandler;
  checked?: boolean;
};

const Toggle: React.FC<Props> = ({ onChange, checked = false }) => {
  return (
    <label className={styles.switch}>
      <input onChange={onChange} type="checkbox" checked={checked} />
      <span className={joinClasses(styles.slider, styles.round)}></span>
    </label>
  );
};

export default Toggle;
