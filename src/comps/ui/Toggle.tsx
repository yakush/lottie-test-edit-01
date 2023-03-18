import React, { ChangeEventHandler } from "react";
import { joinClasses } from "../../utils/cssUtils";
import styles from "./Toggle.module.css";

type Props = {
  onChange?: ChangeEventHandler;
  checked?: boolean;
  label?: string;
};

const Toggle: React.FC<Props> = ({ onChange, label, checked = false }) => {
  return (
    <div className={styles.root}>
      <label className={styles.switch}>
        <input onChange={onChange} type="checkbox" checked={checked} />
        <span className={joinClasses(styles.slider, styles.round)}></span>
      </label>
      {!!label && <span className={styles.label}>{label}</span>}
    </div>
  );
};

export default Toggle;
