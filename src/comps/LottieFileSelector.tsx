import React, { useCallback, useEffect, useState } from "react";
import styles from "./LottieFileSelector.module.css";

import lottieSamplesList from "../assets/lottie-sample-list.json";
import { useLottieContext } from "../LottieContext";

type Props = {
  children?: React.ReactNode;
};

function createUrl(file: string) {
  return `${process.env.PUBLIC_URL}/lottie-samples/${file}`;
}

const LottieFileSelector: React.FC<Props> = ({}) => {
  const lottie = useLottieContext();

  const [lottieIdx, setLottieIdx] = useState(0);

  useEffect(() => {
    const item = lottieSamplesList.samples[lottieIdx];
    const url = createUrl(item.file);

    console.log("change lottie", lottieIdx, item.name);
    lottie.loadUrl(url);
  }, [lottieIdx]);

  const handleSelect = async (event: React.FormEvent) => {
    const idx = (event.target as any).value;
    setLottieIdx(idx);
  };

  return (
    <div className={styles.root}>
      <label htmlFor="selectLottie">select lottie</label>
      <select
        name="selectLottie"
        id="selectLottie"
        value={lottieIdx}
        onChange={(event) => handleSelect(event)}
      >
        {lottieSamplesList.samples.map((item, i) => (
          <option key={item.name} value={i}>
            {item.name}
          </option>
        ))}
      </select>
      <div>{lottie.url}</div>
    </div>
  );
};

export default LottieFileSelector;
