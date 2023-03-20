import React, { useId } from "react";
import { useLottieContext } from "../../LottieContext";
import EditCard from "./EditCard";
import styles from "./EditsColors.module.css";

type Props = {
  children?: React.ReactNode;
};

const EditsColors: React.FC<Props> = ({}) => {
  const id = useId();
  const lottie = useLottieContext();
  const colors = lottie.editsJson?.colorEdits;

  if (!colors) {
    return <></>;
  }

  return (
    <EditCard title="color schemes">
      <div>
        <label htmlFor={`${id}-select`}>select preset: </label>
        <select id={`${id}-select`}>
          {colors.options?.map((item, i) => (
            <option value={i} key={i}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        {colors.scheme.map((item, i) => (
          <div
            key={i}
            className={styles.color}
            style={{ backgroundColor: item.origColorStr }}
          >
            {item.name}
            <span className={styles.tooltiptext}>
              {item.description} <br />
              <br />
              {item.origColorStr?.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </EditCard>
  );
};

export default EditsColors;
