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
  const mgr = lottie.lottieManager;
  const colors = lottie.editsJson?.colorEdits;

  const handleSelectPalette = (i: number) => {
    mgr?.editColors(i);
  };

  if (!colors) {
    return <></>;
  }

  return (
    <EditCard title="color schemes">
      <div>
        <label htmlFor={`${id}-select`}>select preset: </label>
        <select
          id={`${id}-select`}
          onChange={(e) => handleSelectPalette(+e.target.value)}
        >
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
            style={{ backgroundColor: item._currentColorStr ?? item.origColorStr }}
            onClick={() => {
              console.log(item._targets);
            }}
          >
            {item.name}
            <br /> ({item._targets?.length} refs)
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
