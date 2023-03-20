import React from "react";
import { useLottieContext } from "../LottieContext";
import { ColorsEditsConfig } from "../types/LottieEditsConfig";
import { LottieLayer } from "../types/LottieLayer";
import { ColorRef, ColorRefGroup, LottieUtils } from "../utils/lottieUtils";
import styles from "./ColorPalette.module.css";

type Props = {
  enabled?: boolean;
  children?: React.ReactNode;
  onClick?: (layer: LottieLayer) => void;
};

const ColorPalette: React.FC<Props> = ({}) => {
  const lottie = useLottieContext();

  const colors = lottie.json ? LottieUtils.getColorRefs(lottie.json) : [];
  const groupedColors = LottieUtils.groupColors(colors);

  function handleColorClick(swatch: ColorRefGroup) {
    const newColor = [Math.random(), Math.random(), Math.random(), 1];
    swatch.refs.forEach((ref) => {
      if (ref.type === "simple") {
        ref.ref.k = [...newColor];
      }
      if (ref.type === "anim") {
        ref.ref.k[ref.animIdx].s = [...newColor];
      }
      if (ref.type === "text") {
        ref.ref.fc = [...newColor];
      }
      if (ref.type === "solid") {
        ref.ref.sc = LottieUtils.rgbToHex(newColor);
        console.log(ref.ref.sc);
      }
    });
    lottie.setJson((s) => ({ ...s }));
  }

  function generateSchemeJson() {
    const colorEdits: ColorsEditsConfig = {
      scheme: groupedColors.map((color, i) => ({
        name: `color ${i}`,
        description: `color ${i} description`,
        origColorStr: LottieUtils.rgbToHex(color.color),
      })),
    };
    console.log(JSON.stringify(colorEdits, null, 2));
    // navigator.clipboard.writeText(JSON.stringify(colorEdits, null, 2));
  }

  return (
    <div className={styles.root}>
      <div className={styles.title}>Color Palette</div>
      <div className={styles.swatchGroup}>
        {/* {colors?.map((color) => (
          <div>
            {color.type}
            {color.type === "simple" && JSON.stringify(color.ref.k)}
            {color.type === "anim" &&
              JSON.stringify(color.ref.k[color.animIdx!].s)}
          </div>
        ))} */}

        {groupedColors.map((swatch, i) => (
          <div key={i}>
            <div className={styles.swatch}>
              <div
                className={styles.color}
                onClick={() => handleColorClick(swatch)}
                style={{ backgroundColor: RGBA(swatch.color) }}
              ></div>
              <div>
                refs: {JSON.stringify(swatch.refs.length)}
                {/* color:                {JSON.stringify(swatch.color)} */}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.summery}>
        colors: {colors?.length} unique: {groupedColors?.length}
      </div>
      <button onClick={generateSchemeJson}>log scheme json...</button>
    </div>
  );
};

//-------------------------------------------------------
//-------------------------------------------------------
//-------------------------------------------------------

function RGBA(arr: number[]) {
  const [r, g, b, a = 1] = arr;
  return `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${a})`;
}

export default ColorPalette;
