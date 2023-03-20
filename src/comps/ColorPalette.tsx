import React from "react";
import { layerTypes, shapeTypes } from "../enums";
import { useLottieContext } from "../LottieContext";
import { LottieJson } from "../types/LottieJson";
import { LottieLayer, SolidLayer } from "../types/LottieLayer";
import {
  LottieAnimColor,
  LottieColor,
  LottieShape,
  LottieSimpleColor,
} from "../types/LottieShape";
import { ColorsEditsConfig } from "../types/LottieEditsConfig";
import { hexToRgb, rgbToHex } from "../utils/cssUtils";

import styles from "./ColorPalette.module.css";

type Props = {
  enabled?: boolean;
  children?: React.ReactNode;
  onClick?: (layer: LottieLayer) => void;
};

const ColorPalette: React.FC<Props> = ({}) => {
  const lottie = useLottieContext();

  const colors = lottie.json ? getLottieColors(lottie.json) : [];
  const groupedColors = groupColors(colors);

  function handleColorClick(swatch: Swatch) {
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
        ref.ref.sc = rgbToHex(
          255 * newColor[0],
          255 * newColor[1],
          255 * newColor[2]
        );
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
        origColorStr: rgbToHex(
          color.color[0] * 255,
          color.color[1] * 255,
          color.color[2] * 255,
          color.color[3] * 255
        ),
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
type ColorRef =
  | {
      type: "text";
      //text node"
      ref: {
        fc: number[];
      };
    }
  | {
      type: "simple";
      ref: LottieSimpleColor;
    }
  | {
      type: "anim";
      ref: LottieAnimColor;
      animIdx: number;
    }
  | {
      type: "solid";
      ref: SolidLayer;
    };

type Swatch = {
  color: number[];
  refs: ColorRef[];
};

//-------------------------------------------------------

function compareColors(a: number[], b: number[]) {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (Math.abs(a[i] - b[i]) > 0.00001) {
      return false;
    }
  }
  return true;
}

//-------------------------------------------------------

function groupColors(colors: ColorRef[]) {
  const swatches: Swatch[] = [];

  colors.forEach((color) => {
    if (color.type === "anim") {
      const colorArray = color.ref.k[color.animIdx].s;
      let swatch = swatches.find((x) => compareColors(x.color, colorArray));
      if (!swatch) {
        swatch = {
          color: colorArray,
          refs: [],
        };
        swatches.push(swatch);
      }
      swatch.refs.push(color);
    }

    if (color.type === "simple") {
      const colorArray = color.ref.k;
      let swatch = swatches.find((x) => compareColors(x.color, colorArray));
      if (!swatch) {
        swatch = {
          color: colorArray,
          refs: [],
        };
        swatches.push(swatch);
      }
      swatch.refs.push(color);
    }

    if (color.type === "text") {
      const colorArray = color.ref.fc;
      let swatch = swatches.find((x) => compareColors(x.color, colorArray));
      if (!swatch) {
        swatch = {
          color: colorArray,
          refs: [],
        };
        swatches.push(swatch);
      }
      swatch.refs.push(color);
    }
    if (color.type === "solid") {
      const colorArray = hexToRgb(color.ref.sc)?.map((x) => x / 255);
      if (colorArray) {
        let swatch = swatches.find((x) => compareColors(x.color, colorArray));
        if (!swatch) {
          swatch = {
            color: colorArray,
            refs: [],
          };
          swatches.push(swatch);
        }
        swatch.refs.push(color);
      }
    }
  });

  return swatches;
}

//-------------------------------------------------------

function getLottieColors(json: LottieJson): ColorRef[] {
  const refs: ColorRef[] = [];

  json.layers?.forEach((layer) => {
    refs.push(...getLayerColors(json, layer));
  });

  return refs;
}

//-------------------------------------------------------

function getLayerColors(json: LottieJson, layer: LottieLayer): ColorRef[] {
  const refs: ColorRef[] = [];

  const layerType = layer.ty;

  if (layerType === layerTypes.precomp) {
    const asset = json.assets?.find((asset) => asset.id === layer.refId);
    if (asset?.layers) {
      asset.layers?.forEach((layer) => {
        refs.push(...getLayerColors(json, layer));
      });
    }
  }
  if (layerType === layerTypes.shape) {
    refs.push(...getShapeLayerColors(layer));
  }
  if (layerType === layerTypes.text) {
    refs.push(...getTextLayerColors(layer));
  }
  if (layerType === layerTypes.solid) {
    refs.push(...getSolidLayerColors(layer));
  }

  return refs;
}

//-------------------------------------------------------

function getSolidLayerColors(layer: SolidLayer): ColorRef[] {
  const refs: ColorRef[] = [];

  const color = layer.sc;

  if (color) {
    refs.push({
      type: "solid",
      ref: layer,
    });
  }

  return refs;
}

//-------------------------------------------------------

function getTextLayerColors(layer: LottieLayer): ColorRef[] {
  const refs: ColorRef[] = [];

  const textNode = layer?.t?.d?.k[0]?.s;
  const color = textNode?.fc; //array

  if (color) {
    refs.push({
      type: "text",
      ref: textNode,
    });
  }

  return refs;
}

//-------------------------------------------------------

function getShapeLayerColors(layer: LottieLayer): ColorRef[] {
  const refs: ColorRef[] = [];
  const shapes: LottieShape[] = layer.shapes || [];

  shapes.forEach((shape) => {
    refs.push(...getShapeColors(shape));
  });
  return refs;
}

//-------------------------------------------------------

function getShapeColors(shape: LottieShape): ColorRef[] {
  const refs: ColorRef[] = [];

  if (shape.ty === shapeTypes.group) {
    const items: LottieShape[] = shape.it || [];
    items.forEach((shape) => {
      refs.push(...getShapeColors(shape));
    });
    return refs;
  }

  const color: LottieColor = shape.c;
  if (color) {
    refs.push(...wrapColor(color));
  }

  return refs;
}

//-------------------------------------------------------

function wrapColor(color: LottieColor): ColorRef[] {
  if (color.a === 0) {
    return [
      {
        type: "simple",
        ref: color,
      },
    ];
  }

  return color.k.map((item, i) => ({
    type: "anim",
    animIdx: i,
    ref: color,
  }));
}

//-------------------------------------------------------

function RGBA(arr: number[]) {
  const [r, g, b, a = 1] = arr;
  return `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${a})`;
}

export default ColorPalette;
