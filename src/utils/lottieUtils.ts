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
import { hexToRgb } from "./cssUtils";

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

  static setLottieColor(json: LottieJson, refs: ColorRef[], colorHex: string) {
    //refs.forEach()
  }

  static getLottieColors(json: LottieJson): ColorRef[] {
    const refs: ColorRef[] = [];

    json.layers?.forEach((layer) => {
      refs.push(...LottieUtils.getLayerColors(json, layer));
    });

    return refs;
  }

  //-------------------------------------------------------

  static getLayerColors(json: LottieJson, layer: LottieLayer): ColorRef[] {
    const refs: ColorRef[] = [];

    const layerType = layer.ty;

    if (layerType === layerTypes.precomp) {
      const asset = json.assets?.find((asset) => asset.id === layer.refId);
      if (asset?.layers) {
        asset.layers?.forEach((layer) => {
          refs.push(...LottieUtils.getLayerColors(json, layer));
        });
      }
    }
    if (layerType === layerTypes.shape) {
      refs.push(...LottieUtils.getShapeLayerColors(layer));
    }
    if (layerType === layerTypes.text) {
      refs.push(...LottieUtils.getTextLayerColors(layer));
    }
    if (layerType === layerTypes.solid) {
      refs.push(...LottieUtils.getSolidLayerColors(layer));
    }

    return refs;
  }

  //-------------------------------------------------------

  static getSolidLayerColors(layer: SolidLayer): ColorRef[] {
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

  static getTextLayerColors(layer: LottieLayer): ColorRef[] {
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

  static getShapeLayerColors(layer: LottieLayer): ColorRef[] {
    const refs: ColorRef[] = [];
    const shapes: LottieShape[] = layer.shapes || [];

    shapes.forEach((shape) => {
      refs.push(...LottieUtils.getShapeColors(shape));
    });
    return refs;
  }

  //-------------------------------------------------------

  static getShapeColors(shape: LottieShape): ColorRef[] {
    const refs: ColorRef[] = [];

    if (shape.ty === shapeTypes.group) {
      const items: LottieShape[] = shape.it || [];
      items.forEach((shape) => {
        refs.push(...LottieUtils.getShapeColors(shape));
      });
      return refs;
    }

    const color: LottieColor = shape.c;
    if (color) {
      refs.push(...wrapColor(color));
    }

    return refs;
  }
}

//-------------------------------------------------------
//-------------------------------------------------------

function groupColors(colors: ColorRef[]) {
  const groups: ColorRefGroup[] = [];

  colors.forEach((color) => {
    if (color.type === "anim") {
      const colorArray = color.ref.k[color.animIdx].s;
      let group = groups.find((x) => compareColors(x.color, colorArray));
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
      let group = groups.find((x) => compareColors(x.color, colorArray));
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
      let group = groups.find((x) => compareColors(x.color, colorArray));
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
      const colorArray = hexToRgb(color.ref.sc)?.map((x) => x / 255);
      if (colorArray) {
        let group = groups.find((x) => compareColors(x.color, colorArray));
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
