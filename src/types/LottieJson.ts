import { LottieAsset } from "./LottieAsset";
import { LottieLayer } from "./LottieLayer";

export interface LottieJson {
  layers?: LottieLayer[];
  assets?: LottieAsset[];
  [key: string]: any;
}
