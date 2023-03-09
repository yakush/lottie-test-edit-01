import React, { useCallback, useEffect, useState } from "react";
import styles from "./LottieFileSelector.module.css";
import { useDropzone } from "react-dropzone";

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

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length) {
      try {
        const file = acceptedFiles[0];
        await lottie.loadFile(file);
        setLottieIdx(-1);
      } catch (e) {
        setLottieIdx(-1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    if (lottieIdx < 0) {
      return;
    }

    const item = lottieSamplesList.samples[lottieIdx];
    const url = createUrl(item.file);

    console.log("change lottie", lottieIdx, item.name);
    lottie.loadUrl(url);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lottieIdx]);

  const handleSelect = async (event: React.FormEvent) => {
    const idx = (event.target as any).value;
    setLottieIdx(idx);
  };

  return (
    <div className={styles.root}>
      <div className={styles.selector}>
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
        {/* <div>{lottie.url}</div> */}
      </div>
      <div className={styles.dropZone} {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <div>Drop it like it's hot</div>
        ) : (
          <div>Drop JSON files here or click</div>
        )}
      </div>
    </div>
  );
};

export default LottieFileSelector;
