import { shapeTypes } from "../enums";

export type LottieShape = {
  ty: shapeTypes; //type
  nm: string; //name

  it?: LottieShape[]; //items in group

  [key: string]: any;
};

export type LottieColor = LottieSimpleColor | LottieAnimColor;

export function isSimpleLottieColor(c: LottieColor) {
  return c?.a === 0;
}

export type LottieSimpleColor = {
  a: 0;
  ix: number;
  k: number[];
};

export type LottieAnimColor = {
  a: 1;
  ix: number;
  k: {
    i: { x: number; y: number };
    o: { x: number; y: number };
    s: number[];
    t: number;
  }[];
};
