export type LottieLayer = {
  ty: number; //type
  nm: string; //name
  hd?: boolean; //hidden
  ind: number;
  [key: string]: any;
};

export type SolidLayer = LottieLayer & {
  sc?: string; //hex string
};

export type TextLayer = LottieLayer & {
  t?: {
    d?: {
      k?: {
        s?: {
          t?: string; //text
          [key: string]: any;
        };
      }[];
    };
  };
};
