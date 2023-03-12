export type LottieLayer = {
  ty: number; //type
  nm: string; //name
  [key: string]: any;
};

export type SolidLayer = LottieLayer & {
  sc?: string; //hex string
};
