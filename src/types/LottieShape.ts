export type LottieShape = {
  ty: string; //type
  nm: string; //name
  it: {
    ty: string;
    [key: string]: any;
  }[];
  [key: string]: any;
};
