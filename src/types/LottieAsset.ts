import { LottieLayer } from "./LottieLayer";

export type LottieAsset = {
  id: string; //ref
  nm: string; //name
  fr?: number; //framerate?
  layers?: LottieLayer[];
  [key: string]: any;
};
