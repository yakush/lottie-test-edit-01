import React, { Children } from "react";
import styles from "./EditCard.module.css";

type Props = {
  title: string;
  children?: React.ReactNode;
};

const EditCard: React.FC<Props> = ({ children, title }) => {
  return (
    <div className={styles.root}>
      <div className={styles.title}>{title}</div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default EditCard;
