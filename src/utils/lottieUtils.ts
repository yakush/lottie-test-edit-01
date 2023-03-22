import { layerTypes, shapeTypes } from "../enums";
import { LayerRef } from "../types/LottieEditsConfig";
import { LottieJson } from "../types/LottieJson";
import { LottieLayer, SolidLayer, TextLayer } from "../types/LottieLayer";
import {
  LottieShape,
  LottieColor,
  LottieAnimColor,
  LottieSimpleColor,
} from "../types/LottieShape";

export class LottieUtils {
  static findTarget(lottieJson: LottieJson | undefined, ref: LayerRef) {
    if (!!ref.assetId) {
      const asset = lottieJson?.assets?.find(
        (asset) => asset.id === ref.assetId
      );
      return asset?.layers?.find((layer) => layer.ind === ref.ind);
    } else {
      return lottieJson?.layers?.find((layer) => layer.ind === ref.ind);
    }
  }

  static findTargetArray(
    lottieJson: LottieJson | undefined,
    refs: LayerRef[]
  ): LottieLayer[] {
    const list: LottieLayer[] = [];
    refs.forEach((ref) => {
      const target = LottieUtils.findTarget(lottieJson, ref);
      if (target) {
        list.push(target);
      }
    });
    return list;
  }

  static getLayerText(layer: TextLayer | undefined) {
    if (!layer?.t?.d?.k) return;
    if (!layer.t.d.k[0]) return;
    return layer.t.d.k[0].s?.t;
  }

  static setLayerText(layer: TextLayer | undefined, text: string) {
    if (!layer?.t?.d?.k) return;
    if (!layer.t.d.k[0]) return;
    if (!layer.t.d.k[0].s?.t) return;
    layer.t.d.k[0].s.t = text;
  }

  static isLayerHidden(layer: LottieLayer | undefined) {
    return layer?.hd == null ? false : layer.hd;
  }

  static setLayerHidden(layer: LottieLayer | undefined, hidden: boolean) {
    if (!layer) {
      return;
    }
    layer.hd = hidden;
  }

  //-------------------------------------------------------
  // color refs

  static setLottieColor(refs: ColorRef[] | undefined, colorHex?: string) {
    refs?.forEach((ref) => {
      if (ref.type === "simple") {
        ref.ref.k = LottieUtils.hexToRgb(colorHex);
      }
      if (ref.type === "anim") {
        ref.ref.k[ref.animIdx].s = LottieUtils.hexToRgb(colorHex);
      }

      if (ref.type === "gradSimple") {
        const { gradIdx, gradStopPosition } = ref;
        const gradStopColor = LottieUtils.hexToRgb(colorHex);
        gradStopColor.length = 3; //remove alpha

        ref.ref.k[gradIdx * 4 + 0] = gradStopPosition;
        ref.ref.k[gradIdx * 4 + 1] = gradStopColor[0];
        ref.ref.k[gradIdx * 4 + 2] = gradStopColor[1];
        ref.ref.k[gradIdx * 4 + 3] = gradStopColor[2];
      }
      if (ref.type === "gradAnim") {
        const { gradIdx, gradStopPosition, animIdx } = ref;
        const gradStopColor = LottieUtils.hexToRgb(colorHex);
        gradStopColor.length = 3; //remove alpha

        ref.ref.k[animIdx].s[gradIdx * 4 + 0] = gradStopPosition;
        ref.ref.k[animIdx].s[gradIdx * 4 + 1] = gradStopColor[0];
        ref.ref.k[animIdx].s[gradIdx * 4 + 2] = gradStopColor[1];
        ref.ref.k[animIdx].s[gradIdx * 4 + 3] = gradStopColor[2];
      }

      if (ref.type === "text") {
        ref.ref.fc = LottieUtils.hexToRgb(colorHex);
      }
      if (ref.type === "solid") {
        ref.ref.sc = colorHex;
      }
    });
  }

  static getColorRefs(
    json: LottieJson | undefined,
    colorHex?: string
  ): ColorRef[] {
    const refs: ColorRef[] = [];

    if (!json) {
      return refs;
    }

    json.layers?.forEach((layer) => {
      refs.push(...LottieUtils.getLayerColorRefs(json, layer, colorHex));
    });

    return refs;
  }

  //-------------------------------------------------------

  static getLayerColorRefs(
    json: LottieJson,
    layer: LottieLayer,
    colorHex?: string
  ): ColorRef[] {
    const refs: ColorRef[] = [];

    const layerType = layer.ty;

    if (layerType === layerTypes.precomp) {
      const asset = json.assets?.find((asset) => asset.id === layer.refId);
      if (asset?.layers) {
        asset.layers?.forEach((layer) => {
          refs.push(...LottieUtils.getLayerColorRefs(json, layer, colorHex));
        });
      }
    }
    if (layerType === layerTypes.solid) {
      refs.push(...LottieUtils.getSolidLayerColorRefs(layer, colorHex));
    }
    if (layerType === layerTypes.text) {
      refs.push(...LottieUtils.getTextLayerColorRefs(layer, colorHex));
    }
    if (layerType === layerTypes.shape) {
      refs.push(...LottieUtils.getShapeLayerColorRefs(layer, colorHex));
    }

    return refs;
  }

  //-------------------------------------------------------

  static getSolidLayerColorRefs(
    layer: SolidLayer,
    colorHex?: string
  ): ColorRef[] {
    const refs: ColorRef[] = [];

    const layerColor = layer.sc;

    const allColors = colorHex == null;
    if (allColors || LottieUtils.compareColorsHex(layerColor, colorHex)) {
      refs.push({
        type: "solid",
        hexNormalized: normalizeHexString(layerColor),
        ref: layer,
      });
    }
    return refs;
  }

  //-------------------------------------------------------

  static getTextLayerColorRefs(
    layer: LottieLayer,
    colorHex?: string
  ): ColorRef[] {
    const refs: ColorRef[] = [];

    const textNode = layer?.t?.d?.k[0]?.s;
    const layerColorArr: number[] = textNode?.fc; //array
    const layerColor = LottieUtils.rgbToHex(layerColorArr);

    const allColors = colorHex == null;
    if (allColors || LottieUtils.compareColorsHex(layerColor, colorHex)) {
      refs.push({
        type: "text",
        hexNormalized: layerColor,
        ref: textNode,
      });
    }

    return refs;
  }

  static getShapeLayerColorRefs(
    layer: LottieLayer,
    colorHex?: string
  ): ColorRef[] {
    const refs: ColorRef[] = [];
    const shapes: LottieShape[] = layer.shapes || [];

    shapes.forEach((shape) => {
      refs.push(...LottieUtils.getShapeColorRefs(shape, colorHex));
    });
    return refs;
  }

  //-------------------------------------------------------

  static getShapeColorRefs(shape: LottieShape, colorHex?: string): ColorRef[] {
    const refs: ColorRef[] = [];
    const type = shape.ty;

    //group
    if (type === shapeTypes.group) {
      const items: LottieShape[] = shape.it || [];
      items.forEach((shape) => {
        refs.push(...LottieUtils.getShapeColorRefs(shape, colorHex));
      });
    }

    //solids
    if (type === shapeTypes.fill || type === shapeTypes.stroke) {
      const color: LottieColor = shape.c;
      if (!color) {
        return refs;
      }

      if (color.a === 0) {
        //simple
        const shapeColorArr = color.k;
        const shapeColorHex = this.rgbToHex(shapeColorArr);
        const allColors = colorHex == null;
        if (
          allColors ||
          LottieUtils.compareColorsHex(shapeColorHex, colorHex)
        ) {
          refs.push({
            type: "simple",
            hexNormalized: shapeColorHex,
            ref: color,
          });
        }
      } else {
        //anim
        color.k.forEach((keyframe, i) => {
          const keyframeColorArr = keyframe.s;
          const keyframeColorHex = this.rgbToHex(keyframeColorArr);
          const allColors = colorHex == null;
          if (
            allColors ||
            LottieUtils.compareColorsHex(keyframeColorHex, colorHex)
          ) {
            refs.push({
              type: "anim",
              hexNormalized: keyframeColorHex,
              animIdx: i,
              ref: color,
            });
          }
        });
      }
    }

    //gradients
    if (type === shapeTypes.gfill || type === shapeTypes.gStroke) {
      //g.k =  {anim / simple}
      const color: LottieColor = shape.g.k;
      if (!color) {
        return refs;
      }

      if (color.a === 0) {
        //simple grad
        const numColors = color.k.length / 4;
        for (let gradIdx = 0; gradIdx < numColors; gradIdx++) {
          const pos = color.k[gradIdx * 4 + 0];
          const r = color.k[gradIdx * 4 + 1];
          const g = color.k[gradIdx * 4 + 2];
          const b = color.k[gradIdx * 4 + 3];

          const gradStopColorArr = [r, g, b];
          const gradStopColorHex = LottieUtils.rgbToHex(gradStopColorArr);
          const allColors = colorHex == null;

          if (
            allColors ||
            LottieUtils.compareColorsHex(gradStopColorHex, colorHex)
          ) {
            refs.push({
              type: "gradSimple",
              hexNormalized: gradStopColorHex,
              ref: color,
              gradStopPosition: pos,
              gradIdx: gradIdx,
            });
          }
        }
      } else {
        //anim grad
        color.k.forEach((keyframe, animIdx) => {
          const numColors = keyframe.s.length / 4;
          for (let gradIdx = 0; gradIdx < numColors; gradIdx++) {
            const pos = keyframe.s[gradIdx * 4 + 0];
            const r = keyframe.s[gradIdx * 4 + 1];
            const g = keyframe.s[gradIdx * 4 + 2];
            const b = keyframe.s[gradIdx * 4 + 3];

            const gradStopColorArr = [r, g, b];
            const gradStopColorHex = LottieUtils.rgbToHex(gradStopColorArr);
            const allColors = colorHex == null;

            if (
              allColors ||
              LottieUtils.compareColorsHex(gradStopColorHex, colorHex)
            ) {
              refs.push({
                type: "gradAnim",
                hexNormalized: gradStopColorHex,
                ref: color,
                animIdx: animIdx,
                gradStopPosition: pos,
                gradIdx: gradIdx,
              });
            }
          }
        });
      }
    }

    return refs;
  }

  static rgbToHex(color: number[]) {
    if (color.length > 4 || color.length < 3) {
      console.warn(`rgbToHex() accepted array of ${color.length} elements...`);
      return "#000000";
    }

    const r = color[0];
    const g = color[1];
    const b = color[2];
    const a = color[3] ?? 1;

    const r_str = colorComponentToHexPart(r);
    const g_str = colorComponentToHexPart(g);
    const b_str = colorComponentToHexPart(b);
    const a_str = colorComponentToHexPart(a);

    return `#${r_str}${g_str}${b_str}${a_str}`;
  }

  static hexToRgb(hex?: string) {
    let parts: RegExpExecArray | null = null;
    let result = [0, 0, 0, 1];

    if (!hex) {
      return result;
    }

    parts = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (parts) {
      result = parts.slice(1).map((i) => parseInt(i, 16) / 255);
    }

    parts = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(hex);
    if (parts) {
      result = parts.slice(1).map((i) => parseInt(i, 16) / 255);
    }

    parts = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (parts) {
      result = parts.slice(1).map((i) => parseInt(i, 16) / 255);
    }

    parts = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(hex);
    if (parts) {
      result = parts.slice(1).map((i) => parseInt(i, 16) / 255);
    }

    result.length = Math.min(4, result.length);
    if (result.length < 4) {
      result[0] = result[0] ?? 0;
      result[1] = result[1] ?? 0;
      result[2] = result[2] ?? 0;
      result[3] = result[3] ?? 1;
    }

    return result;
  }

  static compareColors(a: number[], b: number[]) {
    return LottieUtils.compareColorsHex(
      LottieUtils.rgbToHex(a),
      LottieUtils.rgbToHex(b)
    );
  }

  static compareColorsHex(a: string | undefined, b: string | undefined) {
    if (a == null || b == null) {
      return false;
    }
    a = normalizeHexString(a);
    b = normalizeHexString(b);
    return a === b;
  }

  static groupColors(colorsRefs: ColorRef[]) {
    const groups: ColorRefGroup[] = [];

    colorsRefs.forEach((colorRef) => {
      const colorHex = colorRef.hexNormalized;
      let group = groups.find((g) =>
        LottieUtils.compareColorsHex(g.colorHex, colorHex)
      );
      if (!group) {
        group = {
          colorHex: colorHex,
          refs: [],
        };
        groups.push(group);
      }
      group.refs.push(colorRef);
    });

    return groups;
  }
}

//-------------------------------------------------------
//-------------------------------------------------------

function normalizeHexString(hex?: string) {
  return LottieUtils.rgbToHex(LottieUtils.hexToRgb(hex));
}

export type ColorRefGroup = {
  colorHex: string;
  refs: ColorRef[];
};

export type ColorRef =
  | {
      type: "text";
      hexNormalized: string;
      ref: {
        fc: number[];
      };
    }
  | {
      type: "simple";
      hexNormalized: string;
      ref: LottieSimpleColor;
    }
  | {
      type: "anim";
      hexNormalized: string;
      ref: LottieAnimColor;
      animIdx: number;
    }
  | {
      type: "gradSimple";
      hexNormalized: string;
      ref: LottieSimpleColor;
      gradIdx: number;
      gradStopPosition: number;
    }
  | {
      type: "gradAnim";
      hexNormalized: string;
      ref: LottieAnimColor;
      animIdx: number;
      gradIdx: number;
      gradStopPosition: number;
    }
  | {
      type: "solid";
      hexNormalized: string;
      ref: SolidLayer;
    };

function bounds(num: number, min: number, max: number) {
  return Math.max(min, Math.min(max, num));
}

function colorComponentToHexPart(x: number) {
  x = Math.round(bounds(x * 255, 0, 255));
  let num = (1 << 8) + x;
  return num.toString(16).slice(1);
}
