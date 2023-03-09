import { shapeTypes } from "../enums";

export type LottieShape = {
  ty: shapeTypes; //type
  nm: string; //name
  
  it?: LottieShape[]; //items in group
  
  [key: string]: any;
};
