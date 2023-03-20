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

    if (shape.ty === shapeTypes.group) {
      const items: LottieShape[] = shape.it || [];
      items.forEach((shape) => {
        refs.push(...LottieUtils.getShapeColorRefs(shape, colorHex));
      });
      return refs;
    }

    const color: LottieColor = shape.c;
    if (!color) {
      return refs;
    }

    if (color.a === 0) {
      //simple
      const shapeColorArr = color.k;
      const shapeColorHex = this.rgbToHex(shapeColorArr);
      const allColors = colorHex == null;
      if (allColors || LottieUtils.compareColorsHex(shapeColorHex, colorHex)) {
        refs.push({
          type: "simple",
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
            animIdx: i,
            ref: color,
          });
        }
      });
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

  static groupColors(colors: ColorRef[]) {
    const groups: ColorRefGroup[] = [];

    colors.forEach((color) => {
      if (color.type === "anim") {
        const colorArray = color.ref.k[color.animIdx].s;
        let group = groups.find((x) =>
          LottieUtils.compareColors(x.color, colorArray)
        );
        if (!group) {
          group = {
            color: colorArray,
            refs: [],
          };
          groups.push(group);
        }
        group.refs.push(color);
      }

      if (color.type === "simple") {
        const colorArray = color.ref.k;
        let group = groups.find((x) =>
          LottieUtils.compareColors(x.color, colorArray)
        );
        if (!group) {
          group = {
            color: colorArray,
            refs: [],
          };
          groups.push(group);
        }
        group.refs.push(color);
      }

      if (color.type === "text") {
        const colorArray = color.ref.fc;
        let group = groups.find((x) =>
          LottieUtils.compareColors(x.color, colorArray)
        );
        if (!group) {
          group = {
            color: colorArray,
            refs: [],
          };
          groups.push(group);
        }
        group.refs.push(color);
      }

      if (color.type === "solid") {
        const colorArray = LottieUtils.hexToRgb(color.ref.sc)?.map(
          (x) => x / 255
        );
        if (colorArray) {
          let group = groups.find((x) =>
            LottieUtils.compareColors(x.color, colorArray)
          );
          if (!group) {
            group = {
              color: colorArray,
              refs: [],
            };
            groups.push(group);
          }
          group.refs.push(color);
        }
      }
    });

    return groups;
  }
}

//-------------------------------------------------------
//-------------------------------------------------------

function normalizeHexString(hex: string) {
  return LottieUtils.rgbToHex(LottieUtils.hexToRgb(hex));
}

export type ColorRefGroup = {
  color: number[];
  refs: ColorRef[];
};

export type ColorRef =
  | {
      type: "text";
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

function bounds(num: number, min: number, max: number) {
  return Math.max(min, Math.min(max, num));
}

function colorComponentToHexPart(x: number) {
  x = Math.round(bounds(x * 255, 0, 255));
  let num = (1 << 8) + x;
  return num.toString(16).slice(1);
}
